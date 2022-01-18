import * as Prismic from '@prismicio/client';

export function getPrismicClient(): Prismic.Client {
  const prismic = Prismic.createClient(process.env.PRISMIC_ACCESS_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}
