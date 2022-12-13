const { Client, Collection, GatewayIntentBits } = require('discord.js');

class DiscordClient extends Client {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions]
        });
        this.commands = new Collection();
        this.files = new Collection();
    }
}

module.exports = DiscordClient;