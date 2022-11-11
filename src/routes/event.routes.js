const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { Ticket, Event } = require('../db');

const router = Router();

const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/event.controller');

router.post(
    '/createEvent',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria')
            .not()
            .isEmpty()
            .custom((value) => {
                const date = new Date(value);
                if (date < new Date()) {
                    throw new Error('La fecha debe ser mayor a la actual');
                }
                return true;
            }),
        check('start', 'La hora de inicio es obligatoria').not().isEmpty(),
        check('price', 'El precio es obligatorio').not().isEmpty(),
        check('quotas', 'La cantidad es obligatoria').not().isEmpty(),
        validateFields,
    ],
    createEvent
);

router.get('/getEvents', getEvents);

router.get('/getEvent/:id', getEvent);

router.delete('/deleteEvent/:id', deleteEvent);

router.put('/updateEvent/:id', updateEvent);

// RUTA PUT -> Actualizar cantidad de tickets del Evento
router.put("/quitTickets/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let event = await Event.findByPk(id);

        if (event.quotas <= 0) {
            res.status(404).send("No hay más tickets");
        }
        else {
            await event.update(data, { // Arreglar esto
                ...event,
                quotas: event.quotas - data,
            });
            res.send("Update");
        }

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA PUT A /event/quitTickets/:id' }, error);
    }
});

module.exports = router;
