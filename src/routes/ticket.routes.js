const { Router } = require('express');
const { Ticket, Event } = require('../db');
const { createTicket } = require('../controllers/ticket.controller');

const router = Router();

// Ruta modularizada -> /ticket

// RUTA POST -> Ticket para el Usuario
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        await createTicket(data);
        res.status(200).send({ msg: `Ténes ${data.quantity} tickets para ir a ${data.event}` });

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA POST A /ticket' }, error);
    }
});

// RUTA GET -> Traer todos los tickets para los Eventos donde irá
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

// RUTA PUT -> Actualizar compra 
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataTicket = req.body;

        await Ticket.update(dataTicket, {
            where: { id: id }
        });
        res.send({ msg: `Ahora tenés ${dataTicket.quantity} de tickets` });
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA PUT A /reaction/:id' }, error);
    }
});

module.exports = router;