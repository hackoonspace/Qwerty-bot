"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudomensagem')
        .setDescription('Envie uma mensagem em um certo canal')
        .addStringOption(option => option.setName('id')
            .setDescription('ID do canal a enviar a mensagem')
            .setRequired(true)
        )
        .addStringOption(option => option.setName('mensagem')
            .setDescription('Mensagem a ser enviada')
            .setRequired(true)
        ),
    admin: true,
    cooldown: 30,
    async execute(bot, inter, args) {
        const [ channelArg, messageArg ] = args;

        if(!channelArg || !messageArg) 
            return inter.reply({ content: 'Faltam argumentos para usar este comando', ephemeral: true });
        
        const channel = bot.channels.cache.get(channelArg.value);

        if(channel) {
            channel.send(messageArg.value);
            return inter.reply({ content: 'Mensagem enviada com sucesso!' });
        }

        inter.reply({ content: 'Alguma coisa deu errado! Verifique os dados fornecidos e tente novamente', ephemeral: true });
    }
}