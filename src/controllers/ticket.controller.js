const { Ticket, Event, User } = require('../db');

const createTicket = async (data) => {
    try {
        const { priceTotal, quantity, event, user } = data;

        const newTicket = await Ticket.create({
            priceTotal,
            quantity, 
        });

        const eventDB = await Event.findAll({
            where: { name: event }
        });

        const userDB = await User.findAll({
            where: { firstName: user }
        });

        newTicket.addEvent(eventDB);
        newTicket.addUser(userDB);
        return newTicket;

    } catch (error) {
        console.log('ERROR EN createTicket', error);
    }
};

module.exports = { createTicket };