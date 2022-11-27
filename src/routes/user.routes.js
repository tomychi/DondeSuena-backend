const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

const {
    createUser,
    loginUser,
    renewToken,
    googleSignIn,
    confirmationToken,
    getUsers,
    getUser,
    postFavoriteArtist,
    getFavoritesArtists,
    getFavoritesById,
    sendInvoice,
    forgetPassword,
    createNewPassword,
} = require('../controllers/user.controller');

const { validateJWT } = require('../middlewares/validate-jwt');

const {
    deleteComment,
    deleteLike,
    editComment,
    createLikeUser,
    createCommentUser,
} = require('../controllers/reactions.controller');

const {
    createTicket,
    getTicket,
    getTickets,
} = require('../controllers/ticket.controller');

router.post(
    '/registerUser',
    [
        check('firstName', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'El password debe ser de al menos 6 caracteres'
        ).isLength({ min: 6 }),
        check('password2', 'El password deben ser iguales').custom(
            (value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Los passwords no son iguales');
                }
                return true;
            }
        ),
        check('phone', 'El teléfono es obligatorio').not().isEmpty(),
        check('birthday', 'La fecha de nacimiento es obligatoria')
            .not()
            .isEmpty(),
        check('dni', 'El dni es obligatorio').not().isEmpty(),

        validateFields,
    ],

    createUser
);

router.post(
    '/loginUser',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check(
            'password',
            'El password debe ser de al menos 6 caracteres'
        ).isLength({
            min: 6,
        }),
        validateFields,
    ],
    loginUser
);

router.post(
    '/google',
    [
        check('id_token', 'El token de Google es obligatorio').not().isEmpty(),
        validateFields,
    ],
    googleSignIn
);

router.post('/postFavoriteArtist/:id', postFavoriteArtist);

router.get('/getFavoritesArtists', getFavoritesArtists);

router.get('/getFavoritesById/:id', getFavoritesById);

router.get('/confirmation/:token', confirmationToken);

router.get('/getUsers', getUsers);

router.get('/getUser/:id', getUser);

router.get('/renew', validateJWT, renewToken);

// Crear likes y comentarios
router.post('/user/createLike', createLikeUser);

router.post('/user/createComment', createCommentUser);

// Eliminar like y comentario
router.delete('/user/deleteLike/:id', deleteLike);

router.delete('/user/deleteComment/:id', deleteComment);

// Actualizar comentario
router.put('/user/editComment/:id', editComment);

// Crear ticket
router.post('/user/createTicket', createTicket);

// Ver ticket específico y su evento
router.get('/user/getTicket/:id', getTicket);

// Usuario ve todos sus tickets con los eventos
router.get('/user/getTickets/:id', getTickets);

router.put('/forget-password', forgetPassword);

router.put('/new-password/:token', createNewPassword);

// Enviar correo con comprobante de compra
router.post('/user/sendInvoice', sendInvoice);

module.exports = router;
