"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('novidades')
		.setDescription('Novidades da minha última atualização'),
	display: true,
	cooldown: 300,
	execute(bot, inter, args) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Novidades - bot do Qwerty')
        .addFields({ name: 'Minha criação', value: 'Meu bot finalmente está online! Espero poder ajudar vocês o máximo que eu puder', inline: true });

		inter.reply({ embeds: [ embed ] });
	},
};