const { response } = require("express");
const { Team } = require("../db");

const getTeam = async (req, res = response) => {
  try {
    const allTeam = await Team.findAll();

    if (!allTeam) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el team",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Integrantes del equipo",
      allTeam,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  getTeam,
};
