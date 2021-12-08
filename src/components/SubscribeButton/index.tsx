import { signIn, useSession } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface Props {
  priceId: string;
}

interface ResponseApiSubscribe {
  sessionId: string;
}

export function SubscribeButton({ priceId }: Props): JSX.Element {
  const { data: session } = useSession();

  async function handleSubscribe(): Promise<void> {
    if (!session) {
      signIn('github');
      return;
    }

    try {
      const { data } = await api.post<ResponseApiSubscribe>('/subscribe');

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error('error: ', error);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
