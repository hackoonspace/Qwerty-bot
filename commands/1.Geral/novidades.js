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
			.addFields({ name: 'Remoção de validação', value: 'Agora para validar seu acesso ao servidor e receber outros cargos, verifique a aba `Canais & Cargos` do Discord', inline: true });

		inter.reply({ embeds: [embed] });
	},
};