const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { createUser } = require('../controllers/auth.controller');

router.post(
    '/newUser',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'El password debe ser de al menos 6 caracteres'
        ).isLength({ min: 6 }),
    ],
    createUser
);

module.exports = router;
