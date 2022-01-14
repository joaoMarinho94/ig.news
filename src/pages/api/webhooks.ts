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

const relevantEvents = new Set(['checkout.session.completed']);

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
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
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const { type } = event;

  if (relevantEvents.has(type)) {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;

    try {
      switch (type) {
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
      return res.json({ error: 'Webhook handler failed.' });
    }
  }

  return res.json({ receive: true });
};
