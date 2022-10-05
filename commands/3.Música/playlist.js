"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Adicione uma playlist para tocar na fila')
        .addStringOption(option => option.setName('playlist')
            .setDescription('URL da playlist')
            .setRequired(true)
        ),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);
        const queue = bot.player.createQueue(inter.guild.id);

        await inter.deferReply({ content: 'Processando playlist', ephemeral: true });

        try {
            await queue.join(inter.member.voice.channel);

            queue.setData({
                channelId: inter.channel.id
            });

            const music = args[0].value;
            const playlist = await queue.playlist(music);

            if (!playlist)
                return inter.editReply({ content: 'Nenhuma playlist encontrada. Tente novamente', ephemeral: true });

            const embed = new MessageEmbed()
                .setColor(embedColor)
                .setTitle('Playlist adicionada à fila')
                .setDescription(`Começando agora a playlist [${playlist.name}](${playlist.url}) - por **${playlist.author}**`);

            inter.editReply({ content: 'Playlist processada', ephemeral: true });
            inter.channel.send({ embeds: [embed]});
        } catch (error) {
            console.log(error);

            if (!guildQueue)
                queue.stop();

            inter.editReply({ content: 'Ocorreu algum problema ao tocar a música selecionada', ephemeral: true });
        }
	},
};