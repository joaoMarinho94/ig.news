import Head from 'next/head';

interface Props {
  title: string;
}

export function NextHead({ title }: Props): JSX.Element {
  return (
    <Head>
      <title> {title} | ig.news</title>
    </Head>
  );
}
