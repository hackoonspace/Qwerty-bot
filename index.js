'use strict';

require('dotenv').config();

const { readdirSync } = require('fs');
const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, Events, IntentsBitField, EmbedBuilder, Partials } = require('discord.js');
const { Player } = require("discord-music-player");

const { embedColor, logChannel, mainGuild, reactRoles, roleGivingMessage, welcomeChannel } = require('./config.json');
const notification = require('./system/notification.js');
const errorHandler = require('./system/errorHandler.js');

const Intents = IntentsBitField.Flags;

const bot = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildEmojisAndStickers,
        Intents.GuildVoiceStates,
        Intents.GuildPresences,
        Intents.GuildMessages,
        Intents.GuildMessageReactions,
        Intents.DirectMessages,
        Intents.DirectMessageReactions,
        Intents.GuildScheduledEvents,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
    ]
});

const player = new Player(bot, {
    leaveOnEmpty: false,
    leaveOnEnd: false,
    leaveOnStop: false,
});

bot.player = player;

bot.player.on('songChanged', (queue, newSong, oldSong) => {
    const channel = bot.channels.cache.find(channel => channel.id === queue.data.channelId);

    if (channel) {
        const embed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle('Tocando agora')
            .setDescription(`[${newSong.name}](${newSong.url}) - por **${newSong.author}**`);

        channel.send({ embeds: [embed] });
    }
});

require('./system/commandRegister.js').execute(bot);

bot.commands = new Collection();

const commandDirectories = readdirSync(`./commands/`);
for (const dir of commandDirectories) {
    const commandFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        if (command.data)
            bot.commands.set(command.data.name, command);
    }
}

bot.once(Events.ClientReady, async () => {
    bot.user.setActivity('CTF', { type: 'COMPETING' });

    try {
        notification.meetingNotifications(bot);
        notification.eventNotifications(bot);
    } catch (error) {
        errorHandler.logGenericError(bot, error);
    }

    console.log('Bot do Qwerty online');
});

bot.on(Events.GuildMemberAdd, async member => {
    if (member.guild.id !== mainGuild) return;

    if (member.user.bot) {
        const botRole = member.guild.roles.cache.find(role => role.name === "Bots");

        if (botRole)
            member.roles.add(botRole);

        return;
    }

    const channel = member.guild.channels.cache.get(welcomeChannel);

    if (channel) {
        const file = new AttachmentBuilder('./images/qwerty_face.png');

        const embed = new EmbedBuilder()
            .setTitle('Boas-vindas ao HackoonSpace!')
            .setDescription(`Olá <@${member.id}>. Sou o Qwerty e te dou boas-vindas ao **HackoonSpace**!\n\nSe tiver dúvidas, não tenha medo de perguntar. Só hackeamos os outros nas horas vagas...\n\nPara ter acesso ao resto do servidor e receber outros cargos, verifique a aba \`Canais & Cargos\` do Discord\n\nQualquer problema, só chamar a equipe aqui do Hackoon!`)
            .setThumbnail('attachment://qwerty_face.png')

        return channel.send({
            content: `<@${member.id}>`,
            components: [row],
            embeds: [embed],
            files: [file]
        })
            .catch(error => errorHandler.logGenericError(bot, error));
    }

    console.log('Não foi possível encontrar canal de boas-vindas');
});

bot.on(Events.GuildMemberRemove, member => {
    const channel = bot.channels.cache.get(logChannel);

    if (channel)
        channel.send(`<@${member.id}> - **${member.user.username}** saiu do servidor do **${member.guild.name}**`).catch(error => errorHandler.logGenericError(bot, error));

    console.log('Não foi possível encontrar canal de log');
})

bot.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (reaction.message.id === roleGivingMessage) {
        const newRole = reactRoles.find(newRole => newRole.reaction == reaction.emoji.name);
        if (newRole) {
            const guildMember = reaction.message.guild.members.cache.get(user.id);
            guildMember.roles.add(newRole.role);
        }
    }
})

bot.on(Events.MessageReactionRemove, async (reaction, user) => {
    if (reaction.message.id === roleGivingMessage) {
        const newRole = reactRoles.find(newRole => newRole.reaction == reaction.emoji.name);
        if (newRole) {
            const guildMember = reaction.message.guild.members.cache.get(user.id);
            guildMember.roles.remove(newRole.role);
        }
    }
})

bot.on(Events.GuildScheduledEventCreate, event => {
    notification.createNotificationsForEvent(event);
});

bot.on(Events.InteractionCreate, async inter => {
    if (inter.isButton()) {
        try {
            const commandName = inter.customId.substring(0, inter.customId.indexOf("|"));
            const command = bot.interactions.get(commandName) || bot.commands.get(commandName);

            if (!command) return;

            return command.buttonCollector(bot, inter);
        } catch (error) {
            errorHandler.logInteractionError(bot, inter, error);
            return inter.reply({ content: 'Ocorreu algum problema ao usar o comando!', ephemeral: true });
        }
    }

    if (inter.isModalSubmit()) {
        try {
            const commandName = inter.customId.substring(0, inter.customId.indexOf("|"));
            const command = bot.interactions.get(commandName) || bot.commands.get(commandName);

            if (!command) return;

            return command.modalCollector(bot, inter);
        } catch (error) {
            errorHandler.logInteractionError(bot, inter, error);
            return inter.reply({ content: 'Ocorreu algum problema ao usar o comando!', ephemeral: true });
        }
    }

    try {
        await bot.interactions.get(inter.commandName).execute(bot, inter, inter.options.data);
    } catch (error) {
        errorHandler.logInteractionError(bot, inter, error);
        return inter.reply({ content: 'Ocorreu algum problema ao usar o comando!', ephemeral: true });
    }
});

bot.login(process.env.BOT_TOKEN);
