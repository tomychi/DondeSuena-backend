const { Router } = require("express");

const router = Router();

const { crearOrden } = require("../controllers/mercadoPago.controller");

router.post("/crear-orden", crearOrden);

module.exports = router;
