const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

const { getGenres } = require("../controllers/genre.controller");

router.get("/getGenres", getGenres);

module.exports = router;
