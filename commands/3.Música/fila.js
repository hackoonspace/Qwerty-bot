"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fila')
        .setDescription('Veja a fila de músicas atual'),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);

        if (!guildQueue || !guildQueue.songs || !guildQueue.songs.length)
            return inter.reply({ content: 'Não há nenhuma fila de músicas ativa', ephemeral: true });

        const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Fila de músicas atual')
            .setFooter({ text: 'Mostrando as 20 primeiras músicas da lista' });

        const songList = guildQueue.songs.slice(0, 20).map((song, index) => {
            return `**${index+1}**. [${song.name}](${song.url})`;
        });

        embed.setDescription(songList.join('\n'));

        inter.reply({ embeds: [embed] });
	},
};