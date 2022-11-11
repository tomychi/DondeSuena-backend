const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const { validateJWT } = require("../middlewares/validate-jwt");

const {
  createArtist,
  loginArtist,
  getArtists,
  updateArtist,
  deleteArtist,
  renewToken,
  getArtistByName,
  getArtistById,
} = require("../controllers/artist.controller");

const { Post, Like, Comment } = require('../db');
const { createPosts, getPostDB } = require('../controllers/post.controller');

router.post(
  "/registerArtist",
  [
    check("firstName", "El nombre es obligatorio").not().isEmpty(),
    check("lastName", "El apellido es obligatorio").not().isEmpty(),
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser de al menos 6 caracteres").isLength(
      { min: 6 }
    ),
    check("password2", "El password deben ser iguales").custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Los passwords no son iguales");
        }
        return true;
      }
    ),
    check("phone", "El teléfono es obligatorio").not().isEmpty(),
    check("description", "La descripcion es obligatoria").not().isEmpty(),
    check("genres", "Los generos son obligatorios").not().isEmpty(),

    validateFields,
  ],

  createArtist
);

router.post(
  "/loginArtist",
  [
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser de al menos 6 caracteres").isLength(
      {
        min: 6,
      }
    ),
    validateFields,
  ],
  loginArtist
);

router.get("/getArtists", getArtists);

router.get("/getArtistByName", getArtistByName);

router.get("/getArtistById/:id", getArtistById);

router.put("/updateArtist/:id", updateArtist);

router.delete("/deleteArtist/:id", deleteArtist);

router.get("/renew", validateJWT, renewToken);


// RUTA POST -> Crear los posteos
router.post('/artist/createPost', async (req, res) => {
  try {
    const data = req.body;
    await createPosts(data);
    res.status(200).send({ msg: '¡Tu post ha sido creado!' })

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA POST A /posts' }, error);
  }
});

// RUTA GET -> Traer todos los posts creados & por query 
router.get('/artist/getPosts', async (req, res) => {
  try {
    const { name } = req.query;

    if (name) {
      const findPost = await Post.findOne({
        where: { title: name },
        include: {
          model: Like,
          model: Comment,
          // attibutes: ['nickname'],
          // through: {
          //   attibutes: [],
          // },
        }
      });
      findPost
        ? res.status(200).send(findPost)
        : res.status(404).send({ msg: 'Ese Post no existe' })
    }

    const allPosts = await Post.findAll({
      include: [
        { model: Like },
        { model: Comment }
        // attibutes: ['nickname'],
        // through: {
        //   attibutes: [],
        // },
      ]
    });
    res.status(200).send(allPosts)

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA GET A /posts' }, error);
  }
});

// RUTA GET -> Traer un post específico
router.get('/artist/getPost/:id', async (req, res) => {
  try {
    const { id } = req.params;

    let postId = await Post.findByPk(id, {
      include: [
        { model: Like },
        { model: Comment }
        // attibutes: ['nickname'],
        // through: {
        //   attibutes: [],
        // },
      ]
    });
    res.status(200).send(postId)

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA GET A /post/:id' }, error);
  }
});

// RUTA PUT -> Actualizar post
router.put('/artist/editPost/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dataPost = req.body;

    await Post.update(dataPost, {
      where: { id: id }
    });
    res.send({ msg: 'Post actualizado' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA PUT A /post/:id' }, error);
  }
});

// RUTA DELETE -> Eliminar post 
router.delete('/artist/deletePost/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Post.destroy({
      where: { id: id }
    });
    res.send({ msg: 'Post borrado' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /post/:id' }, error);
  }
});

module.exports = router;
