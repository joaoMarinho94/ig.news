import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  console.log('evento recebido');

  return res.status(200).json({ ok: true });
};
