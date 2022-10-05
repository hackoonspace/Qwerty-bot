"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

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
        const queue = client.player.createQueue(inter.guild.id);

        try {
            await queue.join(inter.member.voice.channel);

            const music = args[0].trim();
            await queue.play(music);

            inter.reply({ content: 'Música adicionada à fila'});
            return 1;
        } catch (error) {
            console.log(error);

            if (!guildQueue)
                queue.stop();

            inter.reply({ content: 'Ocorreu algum problema ao tocar a música selecionada', ephemeral: true });
            return 0;
        }
	},
};