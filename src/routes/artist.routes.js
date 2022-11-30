const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

const { validateJWT } = require('../middlewares/validate-jwt');

const {
    createArtist,
    getArtists,
    updateArtist,
    patchArtist,
    deleteArtist,
    renewToken,
    getArtistById,
} = require('../controllers/artist.controller');

const {
    createPosts,
    getAllPosts,
    getPostById,
    editPost,
    deletePost,
} = require('../controllers/post.controller');

const { createCommentArtist, getComments, addCommentArtist } = require('../controllers/reactions.controller');

router.post(
    '/registerArtist',
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
        check('description', 'La descripcion es obligatoria').not().isEmpty(),
        check('genres', 'Los generos son obligatorios').not().isEmpty(),

        validateFields,
    ],

    createArtist
);

router.get('/getArtists', getArtists);

router.get('/getArtistById/:id', getArtistById);

router.put('/updateArtist/:id', updateArtist);

router.patch('/updateArtist/:id', patchArtist);

router.delete('/deleteArtist/:id', deleteArtist);

router.get('/renew', validateJWT, renewToken);

// Artista crea post
router.post('/artist/createPost', createPosts);

// Artista comenta
router.post('/artist/createComment', createCommentArtist);

// Responder comentarios como artista
router.post('/artist/addComment', addCommentArtist);

// Traer posteo específico y sus comentarios
router.get('/artist/getComments/:id', getComments);

// Ver todos los posteos de los Artistas
router.get('/artist/getPosts', getAllPosts);

// Artista ve sus posteos por (id)
router.get('/artist/getPost/:id', getPostById);

// Actualizar post
router.put('/artist/editPost/:id', editPost);

// Eliminar post
router.delete('/artist/deletePost/:id', deletePost);


module.exports = router;
