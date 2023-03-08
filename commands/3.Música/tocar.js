"use strict";

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tocar')
        .setDescription('Toque uma música no servidor')
        .addStringOption(option => option.setName('musica')
            .setDescription('URL ou nome da música')
            .setRequired(true)
        ),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);
        const queue = bot.player.createQueue(inter.guild.id);

        await inter.deferReply({ content: 'Processando música', ephemeral: true });

        try {
            await queue.join(inter.member.voice.channel);

            queue.setData({
                channelId: inter.channel.id
            });

            const music = args[0].value;
            const song = await queue.play(music);

            if (!song)
                return inter.editReply({ content: 'Nenhuma música ou vídeo encontrado. Tente novamente', ephemeral: true });

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('Música adicionada à fila')
                .setDescription(`[${song.name}](${song.url}) - por **${song.author}**`);

            inter.editReply({ content: 'Música processada', ephemeral: true });
            inter.channel.send({ embeds: [embed]});
        } catch (error) {
            console.log(error);

            if (!guildQueue)
                queue.stop();

            inter.editReply({ content: 'Ocorreu algum problema ao tocar a música selecionada', ephemeral: true });
        }
	},
};