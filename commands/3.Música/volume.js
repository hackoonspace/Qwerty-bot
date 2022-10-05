"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Mude o volume das músicas ou veja o volume atual')
        .addNumberOption(option => option.setName('volume')
            .setDescription('Volume entre 0 e 2. Se não passsado, mostra o volume atual')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(2)
        ),
    display: true,
	async execute(bot, inter, args) {
        const guildQueue = bot.player.getQueue(inter.guild.id);

        if (!guildQueue)
            return inter.reply({ content: 'Não há nenhuma fila de músicas ativa', ephemeral: true });

        if (!args[0])
            return inter.reply({ content: `O volume atual é **${(guildQueue.volume/100).toFixed(1)}**` });

        const volume = args[0].value;
        guildQueue.setVolume(volume*100);

        inter.reply({ content: `Volume alterado para **${volume}**` });
	},
};