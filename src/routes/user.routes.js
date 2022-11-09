const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const {
  createUser,
  loginUser,
  renewToken,
} = require("../controllers/user.controller");

const { validateJWT } = require("../middlewares/validate-jwt");

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

router.get("/renew", validateJWT, renewToken);

module.exports = router;
