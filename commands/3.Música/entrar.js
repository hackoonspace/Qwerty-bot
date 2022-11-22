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

        const channel = member.voice.channel;

        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
          selfDeaf : false,
        });

        inter.reply({ content: 'Entrando no seu canal de voz agora', ephemeral: true });
	},
};
