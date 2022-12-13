const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

async function registerLanguages(client) {
    const languagesPath = path.join(__dirname, '/localization');
    const languages = fs.readdirSync(languagesPath);
    if (languages.length) {
        for (const language of languages) {
            const strings = require(`./localization/${language}/strings/strings.json`);
            const countries = require(`./localization/${language}/countries/countries.json`);
            const collection = new Collection();
            collection.set('strings', strings);
            collection.set('countries', countries);
            client.files.set(language, collection);
        }
    }
    else throw new Error('ERROR FETCHING LANGUAGES');
}

module.exports = registerLanguages;