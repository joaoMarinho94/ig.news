import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface ResponseApiSubscribe {
  sessionId: string;
}

export function SubscribeButton(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSubscribe(): Promise<void> {
    if (!session) {
      signIn('github');
      return;
    }

    if (session.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const {
        data: { sessionId },
      } = await api.post<ResponseApiSubscribe>('/subscribe');

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
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
