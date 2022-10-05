"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, moderationChannel } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marcar')
        .setDescription('Marque um evento no servidor do HackoonSpace')
        .addStringOption(option => option.setName('detalhes')
            .setDescription('Detalhes do evento a ser marcado')
            .setRequired(true)
        ),
	display: true,
    dm: true,
	cooldown: 60,
	execute(bot, inter, args) {
        if(!args[0])
            return inter.reply({ content: 'É necessário enviar os detalhes do evento', ephemeral: true });

        const eventDetailsMessage = args[0].value;

        return bot.channels.fetch(moderationChannel).then(channel => {
            const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle(`Evento a ser marcado - ${inter.user.username} - ${inter.user.id}`)
            .setDescription(eventDetailsMessage)
            .setTimestamp();

            channel.send({embeds: [embed]});
            inter.reply({ content: 'Evento enviado. Ele será analisado pela equipe do Hackoon e se tudo estiver certo será marcado!', ephemeral: true });
        }).catch(e => {
            console.log(e);
            inter.reply({ content: 'Alguma coisa deu errado! Tente novamente mais tarde', ephemeral: true });
        });
	},
};