"use strict";

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { calendarChannel, embedColor } = require('../../config.json');

const calendarDates = [];

function addEvents(embed){
    const fieldLength = calendarDates.length > 25 ? 25 : calendarDates.length;

    for(let i = 0; i < fieldLength; i++)
        embed.addField(calendarDates[i].date, `\`\`\`yaml\n${calendarDates[i].description}\n\`\`\``);

    return embed;
}

async function getCalendarDates(bot) {
    const channel = await bot.channels.fetch(calendarChannel);

    if(!channel)
        throw new Error("Canal de calendário da equipe do Hackoon não encontrado");

    const messages = await channel.messages.fetch();

    messages.forEach(message => {
        if(!message.embeds || !message.embeds.length)
            return;

        const embed = message.embeds[0];

        const date = embed.fields.find(field => field.name === 'Data')?.value || 'Inválido';
        const description = embed.fields.find(field => field.name === 'Descrição')?.value || 'Inválido';

        calendarDates.push({
            date, description
        });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calendario')
        .setDescription('Veja as próximas datas importantes do nosso calendário'),
    display: true,
	async execute(bot, inter, args) {
        await getCalendarDates(bot);
        
        if(!calendarDates.length)
            return inter.reply({ content: 'Nenhuma data importante foi adicionada ao calendário por enquanto'});

        const embedResponse = new MessageEmbed()
        .setColor(embedColor)
        .setTitle('Próximas datas importantes:');

        inter.reply({ embeds: [addEvents(embedResponse)] });
	},
};