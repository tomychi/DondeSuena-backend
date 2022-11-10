const { Ticket, Event, User } = require('../db');

// CREATE TICKET ---------------------------------------------------------------------
const createTicket = async (data) => {
    try {
        const { priceTotal, quantity, event, user } = data;

        const newTicket = await Ticket.create({
            priceTotal, // relacionar con cantidad de entradas (ej: 1 ticket = $200// 2 tickets x $200 = $400)
            quantity, // relacionar con quantity de tickets en el Evento
        });

        const eventDB = await Event.findAll({
            where: { name: event }
        });

        const userDB = await User.findAll({
            where: { nickname: user }
        });

        newTicket.addEvent(eventDB);
        newTicket.addUser(userDB);
        return newTicket;

    } catch (error) {
        console.log('ERROR EN createTicket', error);
    }
};

module.exports = { createTicket };