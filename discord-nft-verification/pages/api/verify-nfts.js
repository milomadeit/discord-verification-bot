import prisma from '../../lib/prisma';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const contractAddress = '0xe87c975a7f0bEdA747bc748e138413Af7d148a45';
const contractABI = []; 

export default async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      wallets: true
    }
  });

  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  for (const user of users) {
    let totalNFTs = 0;

    for (const wallet of user.wallets) {
      const balance = await contract.balanceOf(wallet.address);
      totalNFTs += parseInt(balance.toString(), 10);
    }

    // update user roles in Discord based on totalNFTs
    // will need to create an endpoint on bot to handle this and make a request here

    // await fetch('http://your-discord-bot-endpoint/update-roles', {
    //   method: 'POST',
    //   body: JSON.stringify({ discordId: user.discordId, totalNFTs }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  }

  res.status(200).json({ success: true });
};
