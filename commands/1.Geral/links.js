'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('links')
		.setDescription('Lista de links importantes do HackoonSpace'),
	display: true,
	cooldown: 300,
	async execute(bot, inter, args) {
		const embed = new EmbedBuilder()
		.setAuthor({name: inter.user.username, iconURL: inter.user.displayAvatarURL({dynamic: true})})
		.setColor(embedColor)
		.setTitle('Links importantes do HackoonSpace')
		.addFields([
			{ name: 'Aulas gravadas', value: '[Link](https://www.youtube.com/playlist?list=PLSYx7h5HkQPqKBD3LauBiADc2DOv0C3Ok) - Assista a uma playlist com as aulas que gravamos e disponibilizamos no nosso canal do Youtube' },
			{ name: 'Drive com conteúdo', value: '[Link](https://drive.google.com/drive/folders/1G3wUd7A4mK1LoAJWdyDh4Lsn3hQY1vbz) - Acesse o nosso Google Drive para ver .PDFs, slides e outros materiais nossos' },
			{ name: 'Edições da nossa revista', value: '[Link](https://www.hackoonspace.com/projects) - Leia as edições da nossa revista técnica com artigos e projetos feitos por nossos membros' },
			{ name: 'Encontros passados', value: '[Link](https://discord.com/channels/492748426270998529/828691067531952178/828693384087732242) - Assista às gravações de encontros passados realizados na nossa atividade de extensão' },
			{ name: 'Guia de como fazer artigos/projetos', value: '[Link](https://drive.google.com/file/d/1XgK7N1jNAQZlCngcnfFFAqebvVYOwgJT/view?usp=sharing) - Saiba mais detalhes sobre como fazer e apresentar artigos e projetos no Hackoon'},
			{ name: 'Redes sociais', value: '[Link](https://linktr.ee/hackoonspace) - Acesse nossas redes sociais e outros links interessantes sobre o Hackoon' },
			{ name: 'HackaSalves', value: '[Link](https://www.youtube.com/playlist?list=PLSYx7h5HkQPpH5RS7QxSxCo3a3Yx6Vy0g) - Salves que recebemos mundo afora' },
		]);

		inter.reply({embeds: [embed]});
	},
};
