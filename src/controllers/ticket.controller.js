const { Ticket, Event, User } = require('../db');

// CREATE TICKET ---------------------------------------------------------------------
const createTicket = async (data) => {
    try {
        const { priceTotal, quantity, event } = data;

        const newTicket = await Ticket.create({
            priceTotal,
            quantity,
        });

        const eventDB = await Event.findAll({
            where: { name: event }
        });

        newTicket.addEvent(eventDB);
        return newTicket;

    } catch (error) {
        console.log('ERROR EN createPost', error);
    }
};

module.exports = { createTicket };