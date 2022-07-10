"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('novidades')
		.setDescription('Novidades da minha última atualização'),
	display: true,
	cooldown: 300,
	execute(bot, inter, args) {
        const embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle('Novidades - bot do Qwerty')
        .addField('Minha criação', 'Meu bot finalmente está online! Espero poder ajudar vocês o máximo que eu puder', true);

		inter.reply({ embeds: [ embed ] });
	},
};