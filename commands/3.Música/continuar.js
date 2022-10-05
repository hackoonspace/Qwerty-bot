"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('continuar')
        .setDescription('Continuar a tocar fila de músicas'),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);

        if (!guildQueue)
            return inter.reply({ content: 'Não há nenhuma fila de músicas ativa', ephemeral: true });

        guildQueue.setPaused(false);
        inter.reply({ content: 'Voltando a tocar fila de músicas' });
	},
};