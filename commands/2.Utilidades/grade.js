"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('grade')
		.setDescription('Veja mais detalhes sobre grade de disciplinas de BCC da UFSCar Sorocaba'),
	display: true,
	cooldown: 300,
	execute(bot, inter, args) {
		inter.reply({ files: ["./images/grade.png"] });
	},
};