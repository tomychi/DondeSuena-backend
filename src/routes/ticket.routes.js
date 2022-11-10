const { Router } = require('express');
const { Ticket, Event } = require('../db');
const { createTicket } = require('../controllers/ticket.controller');

const router = Router();

// Ruta modularizada -> /ticket

// RUTA POST -> Crear los tickets
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        await createTicket(data);
        res.status(200).send({ msg: 'Tickets creados' });

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA POST A /ticket' }, error);
    }
});

// RUTA GET -> Traer todos los tickets
router.get('/', async (req, res) => {
    try {
        const allTickets = await Ticket.findAll({
            include: {
                model: Event,
                attibutes: ['name'],
                through: {
                    attibutes: [],
                },
            }
        });
        res.status(200).send(allTickets);

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA GET A /ticket' }, error);
    }
});

module.exports = router;