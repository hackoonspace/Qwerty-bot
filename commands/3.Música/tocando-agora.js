"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tocando-agora')
        .setDescription('Veja qual música está sendo tocada agora'),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);

        if (!guildQueue)
            return inter.reply({ content: 'Não há nenhuma fila de músicas ativa', ephemeral: true });

        const song = guildQueue.nowPlaying;

        const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Tocando agora')
            .setDescription(`[${song.name}](${song.url}) - por **${song.author}**`);

        inter.reply({ embeds: [embed] });
	},
};