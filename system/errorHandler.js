const { MessageEmbed}  = require('discord.js');
const { logChannel } = require('../config.json');

function logInteractionError(bot, inter, error) {
    console.log(error);
    
    const channel = bot.channels.cache.get(logChannel);

    if (channel) {
        const embed = new MessageEmbed()
        .setTitle(`Erro encontrado no comando /${inter.commandName}`)
        .setAuthor({ name: 'Qwerty', iconURL: bot.user.displayAvatarURL() })
        .setDescription(error.message);

        channel.send({ embeds: [embed] });
    }
}

function logGenericError(bot, error) {
    console.log(error);

    const channel = bot.channels.cache.get(logChannel);

    if (channel) {
        const embed = new MessageEmbed()
        .setTitle('Erro encontrado')
        .setAuthor({ name: 'Qwerty', iconURL: bot.user.displayAvatarURL() })
        .setDescription(error.message);

        channel.send({ embeds: [embed] });
    }
}

module.exports = {
    logGenericError,
    logInteractionError,
}