const { Client, GatewayIntentBits, REST, Routes, Events } = require('discord.js');
const config = require('./config.json');
const token = config.BOT_ID;
const guildId = config.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(token);
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});


client.once(Events.ClientReady, async () => {
    console.log('Bot is online!');
    
    // Register slash commands once the bot is ready
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), {
            body: [
                {
                    name: 'verify',
                    description: 'Start the wallet verification process',
                },
            ],
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'verify') {
        const user = interaction.user;
        try {
            await user.send('Click the link to verify your wallet: http://localhost:3000/verify?userId=' + user.id);
            await interaction.reply('Verification link has been sent to your DMs.');
        } catch (error) {
            console.error('Could not send DM to the user.');
            await interaction.reply('Could not send you a DM. Please make sure you have DMs enabled.');
        }
    }
});

client.login(token);
