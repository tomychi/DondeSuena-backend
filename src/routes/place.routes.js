const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

const {
    createPlace,
    getPlaces,
    getPlace,
    updatePlace,
    deletePlace,
} = require('../controllers/place.controller');

router.post(
    '/createPlace',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('address', 'La dirección es obligatoria').not().isEmpty(),
        check('city', 'La ciudad es obligatoria').not().isEmpty(),
        check('postCode', 'El código postal es obligatorio').not().isEmpty(),
        check('phone', 'El teléfono es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty(),
        check('image', 'La imagen es obligatoria').not().isEmpty(),

        validateFields,
    ],
    createPlace
);

router.get('/getPlaces', getPlaces);

router.get('/getPlace/:id', getPlace);

router.put('/updatePlace/:id', updatePlace);

router.delete('/deletePlace/:id', deletePlace);

module.exports = router;
