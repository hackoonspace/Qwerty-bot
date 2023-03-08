"use strict";

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, reactRoles, roleGivingChannel } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudocargos')
        .setDescription('Reenvie a mensagem de reações por cargos'),
    admin: true,
    cooldown: 30,
    async execute(bot, inter, args) {
        const channel = bot.channels.cache.get(roleGivingChannel);

        if(channel) {
            const embed = new EmbedBuilder()
            .setTitle('Reaja esta mensagem com o emoji correspondente para receber um cargo')
            .setColor(embedColor);

            let description = '';
            reactRoles.forEach(role => {
                description += `${role.reaction} - <@&${role.role}>: ${role.description}\n`;
            });

            embed.setDescription(description);

            const message = await channel.send({ embeds: [ embed ] });
            reactRoles.forEach(role => {
                message.react(role.reaction);
            });
            return inter.reply({ content: 'Mensagem de cargos enviada com sucesso! Por favor, atualize o arquivo config.json no repositório do projeto' });
        }

        inter.reply({ content: 'Alguma coisa deu errado! Verifique os dados fornecidos e tente novamente', ephemeral: true });
    }
}
