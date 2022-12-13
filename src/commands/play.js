const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Users = require('../../database/schemas/userSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('start playing with flags')
        .setDescriptionLocalizations({ 'es-ES': 'empieza a jugar con banderas' })
        .addStringOption((option) =>
            option
                .setName('continent')
                .setNameLocalizations({ 'es-ES': 'continente' })
                .setDescription('select the continent')
                .setDescriptionLocalizations({ 'es-ES': 'elige un continente' })
                .addChoices(
                    {
                        name: 'africa',
                        name_localizations: { 'es-ES': 'africa' },
                        value: 'AFRICA',
                    },
                    {
                        name: 'americas',
                        name_localizations: { 'es-ES': 'america' },
                        value: 'AMERICAS',
                    },
                    {
                        name: 'asia',
                        name_localizations: { 'es-ES': 'asia' },
                        value: 'ASIA',
                    },
                    {
                        name: 'europe',
                        name_localizations: { 'es-ES': 'europa' },
                        value: 'EUROPE',
                    },
                    {
                        name: 'oceania',
                        name_localizations: { 'es-ES': 'oceania' },
                        value: 'OCEANIA',
                    },
                )
        ),
    async execute(interaction, files) {

        try {
            var result = await Users.findOne({ discordid: interaction.user.id });
            if (!result) {
                result = await Users.create({
                    discordid: interaction.user.id,
                    username: interaction.user.username
                });
            }
        }
        catch (err) {
            console.log(err);
        }

        const strings = files.get('strings');
        let countries = files.get('countries');

        let option = interaction.options.get('continent');
        if (option) {
            let continent = option.value;
            countries = countries.filter(c => c.continent.normalize() === strings[continent].normalize());
        }

        let embeds = [];
        let flags = [];
        let answers = [];

        for (let i = 0; i < 5; i++) {
            let index = Math.floor(Math.random() * countries.length);
            let country = countries[index];
            countries.splice(index, 1);
            let flag = new AttachmentBuilder(`src/assets/flags/${country.cca2}.png`);
            let embed = new EmbedBuilder();
            embed.setTitle(strings['GUESS']);
            embed.setImage(`attachment://${country.cca2}.png`);
            embeds.push(embed);
            flags.push(flag);
            answers.push([country.name.official, country.name.common]);
        }

        let sessionCorrectAnswers = 0;
        let sessionPoints = 0;

        await interaction.reply(strings['STARTING'])
            .then(async () => {
                for (let i = 0; i < 5; i++) {
                    let message = await interaction.channel.send({ embeds: [embeds[i]], files: [flags[i]] });
                    let filter = response => {
                        return answers[i].some(r => r.normalize() === response.content.normalize() && interaction.user.id === response.author.id);
                    };
                    await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] })
                        .then(collected => {
                            message.react('🟢');
                            sessionPoints = sessionPoints + ((i + 1) * 10);
                            sessionCorrectAnswers++;
                        })
                        .catch(collected => {
                            message.react('🔴');
                        });
                }
            });

        await interaction.followUp(`${strings['CORRECT_ANSWERS'].replace(/%REPL%/g, sessionCorrectAnswers)}. ${strings['POINTS'].replace(/%REPL%/g, sessionPoints)}`)
            .then(async () => {
                result.daysPlayed++;
                result.points += sessionPoints;
                result.correctAnswers += sessionCorrectAnswers;
                await result.save();
            })
            .catch(err => console.log(err));
    }
}