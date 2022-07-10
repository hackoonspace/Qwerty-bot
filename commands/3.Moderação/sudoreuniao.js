"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { embedColor, meetingScheduleChannel } = require('../../config.json');

async function sendScheduleMeeting(bot, date, time, theme, group, observation) {
    const channel = bot.channels.cache.get(meetingScheduleChannel);

    if(channel) {
        const embed = new MessageEmbed()
        .setColor(embedColor)
        .setTitle(`Reunião: ${theme}`)
        .addField('Data', date, true)
        .addField('Horário', time, true)
        .addField('Grupo', `<@&${group}>`);

        if(observation) 
            embed.setDescription(observation);

        const message = await channel.send({ embeds: [embed] });
        message.react('👍');
        return true;
    }

    return false;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudoreuniao')
        .setDescription('Marque uma reunião para a equipe do Hackoon')
        .addStringOption(option => option.setName('data')
            .setDescription('Data (formato DD/MM)')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('horário')
            .setDescription('Horário da reunião (formato 00:00)')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('tema')
            .setDescription('Tema da reunião')
            .setRequired(true)
        )
        .addRoleOption(option => option.setName('grupo')
            .setDescription('Grupo que fará a reunião (equipe, organização, marketing, etc)')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('observações')
            .setDescription('Observações adicionais sobre a reunião')
            .setRequired(false)
        ),
    admin: true,
	cooldown: 30,
	async execute(bot, inter, args) {
        const [ dateArg, timeArg, themeArg, groupArg, observationArg ] = args;
        const response = await sendScheduleMeeting(bot, dateArg.value, timeArg.value, themeArg.value, groupArg.value, observationArg?.value);

        if(response)
            return inter.reply({ content: 'Reunião marcada com sucesso'});
        
        inter.reply({ content: 'Problema ao marcar data no calendário'});
    }
}