const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate, isFormatValid } = require('../helpers/isDate');
const router = Router();

const {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/event.controller');

const { updateStockTickets } = require('../controllers/ticket.controller');

router.post(
    '/createEvent',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        check('date', 'La fecha debe ser mayor a la fecha actual').custom(
            isDate
        ),
        check('date', 'El formato de la fecha es incorrecto').custom(
            isFormatValid
        ),
        check('genres', 'Los generos son obligatorios').not().isEmpty(),
        check('start', 'La hora de inicio es obligatoria').not().isEmpty(),
        check('price', 'El precio es obligatorio').not().isEmpty(),
        check('quotas', 'La cantidad es obligatoria').not().isEmpty(),
        check('artistName', 'El nombre del artista es obligatorio')
            .not()
            .isEmpty(),
        validateFields,
    ],
    createEvent
);

router.get('/getEvents', getEvents);

router.get('/getEvent/:id', getEvent);

router.delete('/deleteEvent/:id', deleteEvent);

router.put('/updateEvent/:id', updateEvent);

// Actualizar cantidad de tickets del Evento
router.put('/updateStock/:id', updateStockTickets);

module.exports = router;
