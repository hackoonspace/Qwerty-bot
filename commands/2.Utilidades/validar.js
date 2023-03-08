"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { mainGuild, newUserChannel, welcomeRole } = require('../../config.json');

async function modalCollector(bot, inter) {
    const reasonMessage = inter.fields.getTextInputValue('motivacao');

    const guild = bot.guilds.cache.get(mainGuild);
    const member = guild?.members.cache.get(inter.user.id);
    const role = member?.roles.cache.get(welcomeRole);

    if (role)
        return inter.reply({ content: "Parece que você já tem acesso ao servidor do Hackoon!", ephemeral: true });

    if (!reasonMessage || !reasonMessage.length)
        return inter.reply({ content: "O texto com a motivação não pode estar vazio", ephemeral: true });

    try {
        const channel = await bot.channels.fetch(newUserChannel);
        channel.send(`**Novo membro do servidor:** Usuário => <@${inter.user.id}>\n${reasonMessage}`);

        member.roles.add(welcomeRole);
        inter.reply({ content: "Formulário enviada. Seu acesso ao resto do servidor foi liberado!", ephemeral: true });
    } catch (e) {
        console.log(e);
        inter.reply({ content: "Algo deu errado! Tente novamente mais tarde", ephemeral: true });
    }
}

async function sendValidateModal (inter) {
    const reasonInput = new TextInputBuilder()
        .setCustomId('motivacao')
        .setLabel("Por que você deseja entrar no HackoonSpace?")
        .setPlaceholder('Ex: Sou da turma X de Y da UFSCar e me interessei em conhecer o HackoonSpace...')
        .setMaxLength(400)
        .setMinLength(7)
        .setRequired()
        .setStyle(TextInputStyle.Paragraph);

    const actionRow = new ActionRowBuilder().addComponents(reasonInput);

    const modal = new ModalBuilder()
        .setCustomId('validar|modal')
        .setTitle('Validação de entrada')
        .addComponents(actionRow);

    try {
        await inter.showModal(modal);
    } catch (e) {
        inter.reply({ content: 'Problema ao enviar formulário. Tente novamente mais tarde', ephemeral: true });
    }
}

async function buttonCollector(bot, inter) {
    return await sendValidateModal(inter);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('validar')
        .setDescription('Confirme sua entrada no nosso servidor. É apenas para evitar bots e spam'),
	display: true,
	cooldown: 60,
	async execute(bot, inter, args) {
        return await sendValidateModal(inter);
	},
    modalCollector,
    buttonCollector,
};