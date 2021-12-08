import { GetStaticProps } from 'next';
import { NextHead } from '../components/NextHead';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface Props {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: Props): JSX.Element {
  return (
    <>
      <NextHead title="Home" />

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          👋<span> Hey, welcome</span>
          <h1>
            News acout the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/img/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K4PX8IZRJ0h5UwBH8Llc1a4');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-Us', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
