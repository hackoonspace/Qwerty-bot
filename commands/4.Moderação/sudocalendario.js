"use strict";

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { calendarChannel, embedColor } = require('../../config.json');

async function sendCalendarDate(bot, date, description) {

    const channel = bot.channels.cache.get(calendarChannel);

    if(channel) {
        const embed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('Sistema de calendário do Hackoon')
        .addFields([
            { name: 'Data', value: date },
            { name:'Descrição', value: description }
        ]);

        channel.send({ embeds: [embed] });
        return true;
    }

    return false;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudocalendario')
        .setDescription('Marque uma data no calendário do Hackoon')
        .addStringOption(option => option.setName('data')
            .setDescription('Data (de preferência no formato DD/MM)')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('descrição')
            .setDescription('Descrição da data no calendário')
            .setRequired(true)
        ),
    admin: true,
	cooldown: 30,
	async execute(bot, inter, args) {
        const [ dateArg, descriptionArg ] = args;
        
        const response = await sendCalendarDate(bot, dateArg.value, descriptionArg.value);

        if(response)
            return inter.reply({ content: 'Data marcada no calendário com sucesso'});
        
        inter.reply({ content: 'Problema ao marcar data no calendário'});
    }
}