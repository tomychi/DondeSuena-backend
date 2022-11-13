const { response } = require('express');
const { Ticket, Event, User } = require('../db');

const createTicket = async (req, res = response) => {
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

        res.status(201).json({
            msg: `Tenés ${quantity} tickets para ir a ${event} `,
            newTicket,
        });

    } catch (error) {
        res.status(500).send({ msg: 'Hable con el administrador' }, error);
    }
};

const getTicket = async (req, res = response) => {
    const { id } = req.params;

    let ticketId = await Ticket.findByPk(id, {
        include: {
            model: Event,
            attibutes: ['name'],
            through: {
                attributes: []
            },
        }
    });
    res.status(200).json({
        msg: 'Estos son tus tickets',
        ticketId,
    });

};

module.exports = { createTicket, getTicket };