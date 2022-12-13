require('dotenv').config();
require('./utils/normalizeText.js');

const mongoose = require('mongoose');

const DiscordClient = require('./utils/structures/Client.js');
const client = new DiscordClient();

const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

const registerCommands = require('./utils/registerCommands.js');
const registerEvents = require('./utils/registerEvents.js');
const registerLanguages = require('./utils/registerLanguages.js');

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.MONGODB_URI)
            .then((m) => {
                console.log('Connected to DB');
            });
        await registerLanguages(client);
        await registerEvents(client);
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: await registerCommands(client)
        });
        client.login(process.env.BOT_TOKEN);
    }
    catch (err) {
        console.log(err);
    }
})();