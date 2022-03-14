import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable): Promise<Buffer> {
  const chunks = [];

  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
    return;
  }

  const buf = await buffer(req);
  const secretStripe = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      secretStripe,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    res.status(400).send(`Webhook error: ${error.message}`);
    return;
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    try {
      switch (type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await saveSubscription(
            subscription.id,
            subscription.customer.toString(),
            type === 'customer.subscription.created'
          );

          break;

        case 'checkout.session.completed':
          await saveSubscription(
            checkoutSession.subscription.toString(),
            checkoutSession.customer.toString()
          );
          break;

        default:
          throw new Error('Unhandled event.');
      }
    } catch (error) {
      res.json({ error: 'Webhook handler failed.' });
      return;
    }
  }

  res.json({ receive: true });
};
