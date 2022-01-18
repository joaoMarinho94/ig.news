import Head from 'next/head';
import styles from './styles.module.scss';

const Posts: React.FC = () => {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#" rel="noopener noreferrer">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with lerna and yarn workspaces</strong>
            <p>
              In this guide. you will learn hew to create a monotepo to manage
              multiple packages with a shared
            </p>
          </a>
          <a href="#" rel="noopener noreferrer">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with lerna and yarn workspaces</strong>
            <p>
              In this guide. you will learn hew to create a monotepo to manage
              multiple packages with a shared
            </p>
          </a>
          <a href="#" rel="noopener noreferrer">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with lerna and yarn workspaces</strong>
            <p>
              In this guide. you will learn hew to create a monotepo to manage
              multiple packages with a shared
            </p>
          </a>
        </div>
      </main>
    </>
  );
};

export default Posts;
