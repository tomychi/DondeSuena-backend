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
        console.log("ERROR EN createTicket", error);
        res.status(500).send({ msg: "Hable con el administrador" });
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
        console.log("ERROR EN getTicket", error);
        res.status(500).send({ msg: "Hable con el administrador" });
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
        console.log("ERROR EN getTickets", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

// Artista ve todos sus eventos y tickets comprados (agregar usuarios)
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
                        {
                            model: User, // funcionará?
                            through: {
                                attributes: []
                            },
                        }
                    ]
                }
            ]
        });
        res.status(200).json({
            msg: 'Todos los tickets comprados',
            events,
        });

    } catch (error) {
        console.log("ERROR EN getEventsByTickets", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

const updateStockTickets = async (req, res = response) => {
    try {
        let { quantity, id } = req.body;
        let event = await Event.findByPk(id);

        if (parseInt(event.quotas) <= 0) {
            return res.status(404).send({
                msg: "No hay más tickets para el evento"
            });
        }

        await event.update({
            ...event,
            quotas: parseInt(event.quotas) - quantity,
        });
        console.log(event.quotas);
        res.status(201).send({ msg: "Se actualizó el stock de tickets para el Evento" });

    } catch (error) {
        console.log("ERROR EN updateStockTickets", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

const getStockTickets = async (req, res = response) => {
    try {
        let { id } = req.params;

        let stock = await Event.findByPk(id, {
            attributes: ['quotas']
        });
        res.status(200).json({
            msg: 'Stock de tickets',
            stock,
        });


    } catch (error) {
        console.log("ERROR EN getStockTickets", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

module.exports = { createTicket, getTicket, getTickets, getEventsByTickets, updateStockTickets, getStockTickets };