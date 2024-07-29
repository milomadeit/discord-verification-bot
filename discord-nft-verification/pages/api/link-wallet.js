import { getSession } from 'next-auth/react';
import prisma from '../../lib/prisma';

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { address } = req.body;
  const chain = "Sei"

  await prisma.wallet.create({
    data: {
      address,
      user: { connect: { id: session.user.id } },
	  chain
    }
  });

  res.status(200).json({ success: true });
};
