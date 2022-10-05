"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remover')
        .setDescription('Remova uma música da lista')
        .addIntegerOption(option => option.setName('id')
            .setDescription('ID da música a ser retirada da fila')
            .setRequired(true)
            .setMinValue(1)
        ),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);

        if (!guildQueue)
            return inter.reply({ content: 'Não há nenhuma fila de músicas ativa', ephemeral: true });

        const id = args[0].value;

        const removedSong = guildQueue.remove(id-1);

        if (!removedSong)
            return inter.reply({ content: 'Nenhuma música com o ID fornecido foi encontrada', ephemeral: true });

        inter.reply({ content: 'Música retirada da fila' });
	},
};