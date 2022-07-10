"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { embedColor, moderationChannel } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('feedback')
        .setDescription('Dê sua opinião e ganhe um chicletão!')
        .addStringOption(option => option.setName('texto')
            .setDescription('Opinião a ser enviada para a equipe do HackoonSpace')
            .setRequired(true)
        ),
	display: true,
    dm: true,
	cooldown: 60,
	execute(bot, inter, args) {

        if(!args[0])
            return inter.reply({ content: 'É necessário enviar um feedback válido', ephemeral: true });

        const feedbackMessage = args[0].value;

        return bot.channels.fetch(moderationChannel).then(channel => {
            const embed = new MessageEmbed()
            .setColor(embedColor)
            .setTitle('Feedback anônimo recebido')
            .setDescription(feedbackMessage)
            .setTimestamp();

            channel.send({embeds: [embed]});
            inter.reply('Mensagem enviada. Obrigada pelo seu feedback!');
        }).catch( e => {
            console.log(e);
            inter.reply({ content: 'Alguma coisa deu errado! Tente novamente mais tarde', ephemeral: true });
        });
	},
};