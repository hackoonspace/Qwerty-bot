'use strict';

const { readdirSync } = require('fs');
const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, moderationGuild } = require('../../config.json');

function embedHelpAboutCommand(command, inter){
	if (!command || (command.admin && inter.guildId != moderationGuild))
		return inter.reply({ content: 'Comando desconhecido', ephemeral: true });

	const embed = new EmbedBuilder()
	.setColor(embedColor)
	.setTitle('Detalhes sobre comando');

	const name = command.name || command.data.name;
	const description = command.description || command.data.description;

	embed.addFields({ name: 'Nome:', value: '```yaml\n' + `${name}` + '```', inline: true });

	if (description) 
		embed.addFields({ name: 'Descrição:', value: '```yaml\n' + `${description}` + '```' });

	if (command.cooldown) 
		embed.addFields({ name: 'Tempo de espera:', value: '```yaml\n' + `${command.cooldown} segundos` + '```', inline: true });

	inter.reply({ embeds: [embed] });
}

function createEmbedHelp(inter){
	const embed = new EmbedBuilder()
	.setColor(embedColor)
	.setTitle('Meus comandos (por categorias):')
	.setDescription('Use `/ajuda <comando>` para ter mais detalhes sobre um comando específico\n\nPara usar um comando, use `/<comando>`')
	.setTimestamp();

	const directories = readdirSync(`./commands/`);
	for(const dir of directories){
		if(dir.includes('Moderação') && inter.guildId != moderationGuild)
			continue;
		
		const commandFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));
		let string = '```yaml\n';
		let validate = false;
		for (const file of commandFiles) {
			const command = require(`../../commands/${dir}/${file}`);
			if(!validate)
				validate = true;
			string += ( (command.data?.name) + '\n');
		}

		if(validate)
			embed.addFields({ name: `${dir}`, value: string + '```', inline: true });
	}
	
	inter.reply({ embeds: [embed] });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('Conheça mais sobre os meus comandos ou peça ajuda sobre algum específico')
		.addStringOption(option =>
			option.setName('comando')
				.setDescription('Nome do comando que você deseja melhor')
				.setRequired(false)
		),
	display: true,
	cooldown: 5,
	async execute(bot, inter, args) {
		const { commands } = inter.client; 
		const [ commandArg ] = args;

		if (!commandArg || !commandArg.value)
			return createEmbedHelp(inter);

		const name = commandArg.value.toLowerCase().replace(/^-/, '');
		const commandObject = commands.get(name) || commands.find(c => (c.aliases && c.aliases.includes(name)) || (c.data && c.data.name === name));

		embedHelpAboutCommand(commandObject, inter);
	},
};
