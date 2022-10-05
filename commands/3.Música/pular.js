"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pular')
        .setDescription('Pule a música atual'),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);
        guildQueue.skip();
        inter.reply({ content: 'Pulando para a próxima música' });
        return 1;
	},
};