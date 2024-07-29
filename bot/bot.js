const express = require('express');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config.json');
const token = config.BOT_ID;
const app = express();

app.use(express.json());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

client.once('ready', () => {
    console.log('Bot is online!');
});

client.login(token);

app.post('/update-roles', async (req, res) => {
    const { discordId, totalNFTs } = req.body;

    const guild = client.guilds.cache.get('YOUR_GUILD_ID');
    const member = guild.members.cache.get(discordId);

    const roles = {
        '1-9': 'ROLE_ID_1',
        '10-24': 'ROLE_ID_2',
        '25-49': 'ROLE_ID_3',
        '50-99': 'ROLE_ID_4',
        '100+': 'ROLE_ID_5'
    };

    let roleId;
    if (totalNFTs >= 100) {
        roleId = roles['100+'];
    } else if (totalNFTs >= 50) {
        roleId = roles['50-99'];
    } else if (totalNFTs >= 25) {
        roleId = roles['25-49'];
    } else if (totalNFTs >= 10) {
        roleId = roles['10-24'];
    } else if (totalNFTs >= 1) {
        roleId = roles['1-9'];
    }

    if (roleId) {
        await member.roles.add(roleId);
    }

    res.status(200).json({ success: true });
});

app.listen(3001, ()
