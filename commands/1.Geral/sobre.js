"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sobre')
		.setDescription('Quem é o Qwerty?'),
	display: true,
	cooldown: 300,
	execute(bot, inter, args) {
        const aboutMe = 'Olá. Me chamo **Qwerty**! Sou o mascote oficial do **HackoonSpace**. Vocês provavelmente devem ter me visto nas logos e outras artes aqui da comunidade. Bom, eu também estou aqui em formato de bot de Discord para ajudar vocês\n\nSe precisarem de alguma ajuda, usem o comando `/ajuda`';
		inter.reply({ content: aboutMe });
	},
};