"use strict";

const schedule = require('node-schedule');
const { logGenericError } = require('./errorHandler.js');
const { meetingScheduleChannel } = require('../config.json');

async function meetingNotifications (bot) {
    try {
        const channel = await bot.channels.fetch(meetingScheduleChannel);

        if(!channel)
            return;

        const messages = await channel.messages.fetch({ limit: 50 }) || [];

        if(!messages)
            return;

        messages.filter(message => message.embeds[0]).each(message => {
            const embed = message.embeds[0];
            
            const title = embed.title;
            const date = embed.fields.find(field => field.name === 'Data').value;
            const time = embed.fields.find(field => field.name === 'Horário').value;

            const formatedDate = date.split('/');
            const formatedTime = time.split(':');

            let subMinutes = Number(formatedTime[1].substring(0, 2));
            let subHours = Number(formatedTime[0].substring(0, 2));

            if(Number.isNaN(subMinutes) || Number.isNaN(subHours)) 
                return;

            subMinutes -= 15;

            if(subMinutes < 0){
                subMinutes += 60;
                subHours = (subHours - 1) < 0 ? 23 : subHours - 1;
            }

            console.log(`Reunião maracada: ${title} ->> ${time}`);

            const meetingScheduleHandler = async () => {
                const reaction = message.reactions.cache.find(reaction => reaction.emoji.name === '👍');
                await reaction.users.fetch();
                reaction.users.cache.each(user =>{
                    if(user.bot) 
                        return;
                    try {
                        user.send(`A reunião **${title}** irá começar **${time}**. Não se esqueça de comparecer!`);
                    } catch (e) {
                        console.log("Não foi possível enviar notificação para usuário");
                        logGenericError(bot, error);
                    }
                });
            }

            schedule.scheduleJob(`${subMinutes} ${subHours} ${formatedDate[0]} ${formatedDate[1]} *`, meetingScheduleHandler);
            schedule.scheduleJob(`${Number(formatedTime[1])} ${Number(formatedTime[0])} ${formatedDate[0]} ${formatedDate[1]} *`, meetingScheduleHandler);
        });
    } catch (error) {
        console.error(error);
        logGenericError(bot, error);
    }
}

function getEventNotificationHour(minute, hour) {
    if(!minute || !hour)
        return;

    minute -= 15;

    if(minute < 0){
        minute += 60;
        hour = (hour - 1) < 0 ? 23 : hour - 1;
    }

    return `${minute} ${hour}`;
}

async function eventNotifications (bot) {
    const guilds = await bot.guilds.fetch();
        
    guilds.forEach(async guild => {
        guild = await guild.fetch();
        const events = await guild.scheduledEvents.fetch();
            
        events.forEach(async event => {
            const eventDate = new Date(event.scheduledStartTimestamp);
            const day = eventDate.getDate();
            const month = eventDate.getMonth() + 1;
            const hour = eventDate.getHours();
            const minute = eventDate.getMinutes();

            console.log(`Evento marcado: ${event.name} ->> ${hour}:${minute} do dia ${day}/${month}`); 

            //evento 8 da manhã
            schedule.scheduleJob(`00 08 ${day} ${month} *`, async () => {
                const subscribers = await event.fetchSubscribers();
                console.log('Começando a enviar notificações às 8h');
                console.log(subscribers);
                subscribers.forEach(subscriber => {
                    if(subscriber.user.bot) return;
                    try {
                        subscriber.user.send(`Hoje você terá o evento **${event.name}** que irá começar **${hour}:${String(minute).padStart(2, '0')}**. Não se esqueça de comparecer!\n\nMais detalhes em: ${event.url}`);
                    } catch (error) {
                        console.log("Não foi possível enviar notificação para usuário");
                        logGenericError(bot, error);
                    }
                });
            });

            // evento 15 min antes
            schedule.scheduleJob(`${getEventNotificationHour(minute, hour)} ${day} ${month}  *`, async () => {
                const subscribers = await event.fetchSubscribers();
                console.log('Começando a enviar notificações 15 min antes');
                console.log(subscribers);
                subscribers.forEach(subscriber => {
                    if(subscriber.user.bot) return;
                    try {
                        subscriber.user.send(`O evento **${event.name}** irá começar em 15 minutos. Não se esqueça de comparecer!\n\nMais detalhes em: ${event.url}`);
                    } catch (e) {
                        console.log("Não foi possível enviar notificação para usuário");
                        logGenericError(bot, error);
                    }
                });
            });
        });
    });
}
module.exports = {
    meetingNotifications,
    eventNotifications,
}
