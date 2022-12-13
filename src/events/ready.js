const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const guilds = client.guilds.cache;
        guilds.forEach(guild => {
            guild.members.fetch();
        })
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
};