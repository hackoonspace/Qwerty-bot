const { REST } = require('@discordjs/rest');
const { Collection } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { clientID, mainGuild, moderationGuild } = require('../config.json');
const { readdirSync } = require('fs');
const { logGenericError } = require('./errorHandler.js');

module.exports = {
    execute: async bot => {
        const interactions = [];
        const moderationInteractions = [];
        bot.interactions = new Collection();

        const interactionsDirectories = readdirSync('./commands/');
        for(const dir of interactionsDirectories){
            const interactionsFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
            for (const file of interactionsFiles) {
                const inter = require(`../commands/${dir}/${file}`);
                if(inter.data){
                    if(inter.admin)
                        moderationInteractions.push(inter.data.toJSON());
                    else
                        interactions.push(inter.data.toJSON());
                    bot.interactions.set(inter.data.name, inter);
                }
            }
        }
        
        const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
        
        try {
            console.log('Atualizando slash commands');

            // Servidor do Hackoon
            await rest.put(
                Routes.applicationGuildCommands(clientID, mainGuild),
                { body: [] },
            );

            // Servidor da Equipe do Hackoon
            await rest.put(
                Routes.applicationGuildCommands(clientID, moderationGuild),
                { body:  moderationInteractions },
            );
                
            // Comandos gerais
            await rest.put(
                Routes.applicationCommands(clientID),
                { body: interactions },
            );

            console.log('Slash commands atualizados com sucesso');
        } catch (error) {
            logGenericError(bot, error);
        }   
    }
}