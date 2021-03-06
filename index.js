'use strict';

require('dotenv').config();

const { readdirSync } = require('fs');
const Discord = require('discord.js');
const { mainGuild, reactRoles, roleGivingMessage, welcomeChannel } = require('./config.json');
const notification = require('./system/notification.js');
const errorHandler = require('./system/errorHandler.js');

const Intents = Discord.Intents.FLAGS;

const bot = new Discord.Client({
    intents: [
        Intents.GUILDS,
        Intents.GUILD_MEMBERS,
        Intents.GUILD_EMOJIS_AND_STICKERS,
        Intents.GUILD_VOICE_STATES,
        Intents.GUILD_PRESENCES,
        Intents.GUILD_MESSAGES,
        Intents.GUILD_MESSAGE_REACTIONS,
        Intents.DIRECT_MESSAGES,
        Intents.DIRECT_MESSAGE_REACTIONS,
        Intents.GUILD_SCHEDULED_EVENTS
    ],
    partials: [
        'CHANNEL',
        'MESSAGE',
        'REACTION'
    ]
});

require('./system/commandRegister.js').execute(bot);

bot.commands = new Discord.Collection();

const commandDirectories = readdirSync(`./commands/`);
for(const dir of commandDirectories){
    const commandFiles = readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        if(command.data)
            bot.commands.set(command.data.name, command);
    }
}

bot.once('ready', async () => {
	bot.user.setActivity('CTF', { type: 'COMPETING' });

    try {
        notification.meetingNotifications(bot);
        notification.eventNotifications(bot);
    } catch (error) {
        errorHandler.logGenericError(bot, error);
    }

	console.log('Bot do Qwerty online');
});

bot.on('guildMemberAdd', async member => {
    if(member.guild.id !== mainGuild) return;

    if(member.user.bot) { 
        const botRole = member.guild.roles.cache.find(role => role.name === "Bots");

        if(botRole)
            member.roles.add(botRole);
        
        return;
    }
        
    const channel = member.guild.channels.cache.get(welcomeChannel);

    if(channel)
	    channel.send(`Ol?? <@${member.id}>. Sou o Qwerty e te dou boas-vindas ao **HackoonSpace**!\n\nSe tiver alguma d??vida, n??o tenha medo de perguntar. S?? hackeamos os outros nas horas vagas...\n\nPara ter acesso ao resto do servidor, preciso que voc?? use o comando \`/validar\` e envie um texto dizendo o porqu?? voc?? entrou aqui (ex: "Sou da turma X de Y da UFSCar e me interessei em conhecer o HackoonSpace..."). ?? para evitar a entrada de bots e pessoas mal-intencionadas\n\nQualquer problema, s?? chamar a equipe aqui do Hackoon!`)
            .catch(error => errorHandler.logGenericError(bot, error));
});

bot.on('guildMemberRemove', member => {
    const channel = member.guild.channels.cache.get(welcomeChannel);

    if(channel)
        channel.send("<@" + member.id + ">, fez overclocking e queimou o PC. At?? mais!").catch(error => errorHandler.logGenericError(bot, error));
})

bot.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.id === roleGivingMessage) {
        const newRole = reactRoles.find(newRole => newRole.reaction == reaction.emoji.name);
        if(newRole){
            const guildMember = reaction.message.guild.members.cache.get(user.id);
            guildMember.roles.add(newRole.role);
        }
    }
})

bot.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.id === roleGivingMessage) {
        const newRole = reactRoles.find(newRole => newRole.reaction == reaction.emoji.name);
        if(newRole){
            const guildMember = reaction.message.guild.members.cache.get(user.id);
            guildMember.roles.remove(newRole.role);
        }
    }
})

bot.on('interactionCreate', async inter => {
    if(inter.isModalSubmit()) {
        try {
            const commandName = inter.customId.substring(0, inter.customId.indexOf("|"));
            const command = bot.interactions.get(commandName) || bot.commands.get(commandName);
            
            if(!command) return;
    
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