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

module.exports = router;
