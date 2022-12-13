const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('get info about the specified country')
        .setDescriptionLocalizations({ 'es-ES': 'muestra informacion sobre el pais indicado' })
        .addStringOption((option) =>
            option
                .setName('country')
                .setNameLocalizations({ 'es-ES': 'pais' })
                .setDescription('country from which you want to get info')
                .setDescriptionLocalizations({ 'es-ES': 'pais del que quieres obtener informacion' })
                .setRequired(true)
                .addChoices()),
    async execute(interaction, files) {

        const strings = files.get('strings');
        const countries = files.get('countries');

        let option = interaction.options.getString('country');
        let country = countries.find(c => c.name.common.normalize() === option.normalize());

        if (country) {

            const embed = new EmbedBuilder();
            const flagImage = new AttachmentBuilder(`src/assets/flags/${country.cca2}.png`);
            embed.setAuthor({ name: `${country.name.common.toUpperCase()}`, iconURL: `attachment://${country.cca2}.png` });
            embed.setImage(`attachment://${country.cca2}.png`);

            let bString = '\n';
            if (country.borders.length) country.borders.forEach(b => bString += `${b.flag} ${b.name}\n`);
            else bString += strings['DOES_NOT_HAVE'];

            let cString = '\n';
            if (country.capital.length) country.capital.forEach(c => cString += `${c}\n`);
            else cString += strings['DOES_NOT_HAVE'];

            embed.addFields(
                {
                    name: strings['OFFICIAL_NAME'],
                    value: `\`\`\`${country.name.official}\`\`\``
                },
                {
                    name: strings['CAPITAL'],
                    value: `\`\`\`${cString}\`\`\``
                },
                {
                    name: strings['CONTINENT'],
                    value: `\`\`\`${country.continent}\`\`\``
                },
                {
                    name: strings['SUBREGION'],
                    value: `\`\`\`${country.subregion}\`\`\``,
                },
                {
                    name: strings['BORDERS_WITH'],
                    value: `${bString}`
                },
                {
                    name: strings['AREA'],
                    value: `\`\`\`${country.area} km2\`\`\``
                }
            )

            interaction.reply({ embeds: [embed], files: [flagImage] });
        }
        else interaction.reply(strings['COUNTRY_NOT_VALID']);
    }
}