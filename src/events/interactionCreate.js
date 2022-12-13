const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return console.error(`No command matching ${interaction.commandName} was found.`);

        try {
            let language = interaction.locale;
            let { client } = interaction;
            const files = client.files.get(language) ?? client.files.get('en-US');
            await command.execute(interaction, files);
        }
        catch (err) {
            console.log(`Error executing ${interaction.commandName}`);
            console.log(err);
        }
    },
};