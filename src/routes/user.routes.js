const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const {
  createUser,
  loginUser,
  renewToken,
  googleSignIn,
} = require("../controllers/user.controller");

const { validateJWT } = require("../middlewares/validate-jwt");

const { Like, Comment } = require('../db');
const { createLike, createComment } = require('../controllers/reactions.controller');

router.post(
  "/registerUser",
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
    check("birthday", "La fecha de nacimiento es obligatoria").not().isEmpty(),
    check("dni", "El dni es obligatorio").not().isEmpty(),

    validateFields,
  ],

  createUser
);

router.post(
  "/loginUser",
  [
    check("email", "Agrega un email válido").isEmail(),
    check("password", "El password debe ser de al menos 6 caracteres").isLength(
      {
        min: 6,
      }
    ),
    validateFields,
  ],
  loginUser
);

router.post(
  "/google",
  [
    check("token", "El token de Google es obligatorio").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

router.get("/renew", validateJWT, renewToken);


// RUTAS POST -> Crear likes y comentarios
router.post('/user/createLike', async (req, res) => {
  try {
    const data = req.body;
    await createLike(data);
    res.status(200).send({ msg: '¡Me gusta!' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA POST A /user/createLike' }, error);
  }
});

router.post('/user/createComment', async (req, res) => {
  try {
    const data = req.body;
    await createComment(data);
    res.status(200).send({ msg: '¡Acabas de comentar!' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA POST A /user/createComment' }, error);
  }
});

// RUTAS DELETE -> Eliminar like y comentarios
router.delete('/user/deleteLike/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Like.destroy({
      where: { id: id }
    });
    res.send({ msg: 'No me gusta' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /user/deleteLike/:id' }, error);
  }
});

router.delete('/user/deleteComment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Comment.destroy({
      where: { id: id }
    });
    res.send({ msg: 'Comentario eliminado' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /user/deleteComment/:id' }, error);
  }
});

// RUTA PUT -> Actualizar comentario
router.put('/user/editComment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const edit = req.body;

    await Comment.update(edit, {
      where: { id: id }
    });
    res.send({ msg: 'Comentario editado' });

  } catch (error) {
    res.status(400).send({ msg: 'ERROR EN RUTA PUT A /user/editComment/:id' }, error);
  }
});

module.exports = router;
