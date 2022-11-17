const { response } = require('express');
const { Ticket, Event, User, Artist } = require('../db');

const createTicket = async (req, res = response) => {
    try {
        const { priceTotal, quantity, event, user } = req.body;

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
    try {
        const { id } = req.params;

        let ticketId = await Ticket.findByPk(id, {
            include: {
                model: Event,
                attributes: ["name"],
                through: {
                    attributes: []
                },
            }
        });
        res.status(200).json({
            msg: 'Este es tu ticket',
            ticketId,
        });

    } catch (error) {
        res.status(500).send({ msg: 'Hable con el administrador' }, error);
    }
};

const getTickets = async (req, res = response) => {
    try {
        const { id } = req.params;

        let allTickets = await User.findByPk(id, {
            include: [
                {
                    model: Ticket,
                    attributes: ["priceTotal", "quantity"],
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Event,
                            attributes: ["name"],
                            through: {
                                attributes: []
                            },
                        },
                    ]
                }
            ]
        });
        res.status(200).json({
            msg: 'Todos tus tickets',
            allTickets,
        });

    } catch (error) {
        res.status(500).send({ msg: 'Hable con el administrador' }, error);
    }
};

// Artista ve todos sus eventos y tickets comprados
const getEventsByTickets = async (req, res = response) => {
    try {
        const { id } = req.params;

        let events = await Artist.findByPk(id, {
            include: [
                {
                    model: Event,
                    attributes: ["name"],
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Ticket,
                            through: {
                                attributes: []
                            },
                        },
                    ]
                }
            ]
        });
        res.status(200).json({
            msg: 'Todos los tickets comprados',
            events,
        });

    } catch (error) {
        res.status(500).send({ msg: 'Hable con el administrador' }, error);
    }
};

const updateStockTickets = async (req, res = response) => { // Probar
    try {
        let { id } = req.params;
        let quantity = req.body.quantity;
        let event = await Event.findByPk(id);

        if (event.quotas <= 0) {
            res.status(404).send("No hay más tickets");
        }
        else {

            await event.update(quantity, {
                ...event,
                quotas: event.quotas - quantity,
            }
            );
            res.status(200).send({ msg: "Se actualizó el stock de tickets para el Evento"});
        }
    } catch (error) {
        res.status(500).send({ msg: 'Hable con el administrador' }, error);
    }
};

module.exports = { createTicket, getTicket, getTickets, getEventsByTickets, updateStockTickets };