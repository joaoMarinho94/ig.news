import { NextHead } from '../components/NextHead';

import styles from './home.module.scss';

export default function Home(): JSX.Element {
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
            <span>for $9.90 month</span>
          </p>
        </section>

        <img src="/img/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}
