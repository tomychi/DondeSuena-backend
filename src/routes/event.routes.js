const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

const {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent,
} = require('../controllers/event.controller');

router.post(
    '/createEvent',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),
        check('date', 'La fecha es obligatoria').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').not().isEmpty(),
        check('end', 'La fecha de finalización es obligatoria').not().isEmpty(),
        check('price', 'El precio es obligatorio').not().isEmpty(),
        check('quantity', 'La cantidad es obligatoria').not().isEmpty(),
        validateFields,
    ],
    createEvent
);

router.get('/getEvents', getEvents);

router.delete('/deleteEvent/:id', deleteEvent);

router.put('/updateEvent/:id', updateEvent);

module.exports = router;
