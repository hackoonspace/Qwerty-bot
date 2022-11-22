"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('entrar')
        .setDescription('Chame o Qwerty para o seu canal de voz'),
    display: true,
	async execute(bot, inter, args) {
	const member = inter.member;

        if (!member || !member.voice.channel) {
          return inter.reply({ content: 'Você precisa estar em um canal de voz para fazer isso', ephemeral: true });
        }

	const guildQueue = bot.player.getQueue(inter.guild.id);
        const queue = bot.player.createQueue(inter.guild.id);

	try {
		await queue.join(inter.member.voice.channel);

		queue.setData({
			channelId: inter.channel.id
		});
	} catch (error) {
		console.log(error);
		return inter.reply({ content: 'Ocorreu algum problema. Tente novamente', ephemeral: true });
	}

        inter.reply({ content: 'Entrando no seu canal de voz agora', ephemeral: true });
	},
};
