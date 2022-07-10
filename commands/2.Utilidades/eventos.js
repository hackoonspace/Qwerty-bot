"use strict";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eventos')
        .setDescription('Saiba mais sobre os eventos do Discord do HackoonSpace'),
    display: true,
    cooldown: 60,
    async execute(bot, inter, args) {
        return inter.reply(`
            Para ficar inteirado nos nossos eventos, faça o seguinte:\n- Fique de olho no nosso canal <#592447648967950386>. Lá nós avisamos sobre coisas grandes, como eventos de feriado e eventos nas nossas redes sociais\n- Veja o canal <#769567911387201547>. Lá há mais detalhes sobre como participar dos eventos marcados pelos próprios participantes da comunidade do Hackoon
        `);
    },
};