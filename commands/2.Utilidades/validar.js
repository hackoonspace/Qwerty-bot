"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const { mainGuild, newUserChannel, welcomeRole } = require('../../config.json');

async function modalCollector(bot, inter) {
    const reasonMessage = inter.fields.getTextInputValue('motivacao');
    const role = bot.guilds.cache.get(mainGuild).members.cache.get(inter.user.id).roles.cache.get(welcomeRole);

    if(role)
        return inter.reply({ content: "Parece que você já tem acesso ao servidor do Hackoon!", ephemeral: true });

    if(!reasonMessage || !reasonMessage.length)
        return inter.reply({ content: "O texto com a motivação não pode estar vazio", ephemeral: true });

    return bot.channels.fetch(newUserChannel).then(channel => {
        channel.send(`<@&${process.env.ADMIN_DISCORD_ID}> - **Novo membro a ser adicionado:** Usuário => <@${inter.user.id}>\n${reasonMessage}`);
        inter.reply({ content: "Mensagem enviada. Logo logo vamos dar uma olhada e te liberar no servidor!", ephemeral: true });
    }).catch(e => {
        console.log(e);
        inter.reply({ content: "Alguma coisa deu errado! Tente novamente mais tarde", ephemeral: true });
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('validar')
        .setDescription('Confirme sua entrada no nosso servidor. É apenas para evitar bots e spam'),
	display: true,
	cooldown: 60,
	async execute(bot, inter, args) {
        const reasonInput = new TextInputComponent()
            .setCustomId('motivacao')
            .setLabel("Por que você deseja entrar no HackoonSpace?")
            .setPlaceholder('Quero entrar no Hackoon porque...')
            .setMaxLength('300')
            .setMinLength('10')
            .setRequired()
            .setStyle('PARAGRAPH');

        const actionRow = new MessageActionRow().addComponents(reasonInput);
        
        const modal = new Modal()
            .setCustomId('validar|modal')
            .setTitle('Validação de entrada')
            .addComponents(actionRow);

        try {
            await inter.showModal(modal);
        } catch (e) {
            inter.reply({ content: 'Problema ao enviar formulário. Tente novamente mais tarde', ephemeral: true });
        }
	},
    modalCollector
};