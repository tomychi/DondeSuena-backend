const { response } = require("express");
const { Genre } = require("../db");

const getGenres = async (req, res = response) => {
  try {
    const genres = await Genre.findAll();

    if (!genres) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron generos",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Lista de generos",
      genres,
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
  getGenres,
};
