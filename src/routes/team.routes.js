const { Router } = require("express");

const router = Router();

const { getTeam } = require("../controllers/team.controller");

router.get("/getTeam", getTeam);

module.exports = router;
