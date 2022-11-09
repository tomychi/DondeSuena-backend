const { response } = require("express");
const { Artist, Genre } = require("../db");
const bcrypt = require("bcryptjs");

const createArtist = async (req, res = response) => {
  const {
    firstName,
    lastName,
    nickname,
    email,
    password,
    password2,
    phone,
    description,
    location,
    socialNetworks,
    image,
    genres,
  } = req.body;

  try {
    let artistFind = await Artist.findOne({ where: { email } });

    if (artistFind) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email",
      });
    }

    if (password !== password2) {
      return res.status(400).json({
        ok: false,
        msg: "Las contraseñas no coinciden",
      });
    }

    const newArtist = Artist.create({
      firstName,
      lastName,
      nickname,
      email,
      password,
      phone,
      description,
      location,
      socialNetworks,
      image,
    });

    const genresDB = Genre.findAll({
      where: { name: genres },
    });

    newArtist.addGenre(genresDB);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt); // me genera un hash

    res.status(201).json({
      ok: true,
      msg: "Usuario creado",
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginArtist = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const artist = await Artist.findOne({ where: { email } });

    if (!artist) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, user.password); // me compara el password que me llega con el hash que tengo en la base de datos

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    res.status(201).json({
      ok: true,
      msg: "Login",
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar un nuevo JWT
  const token = await generateJWT(uid, name);
  res.status(201).json({
    ok: true,
    msg: "Renew",
    uid,
    name,
    token,
  });
};

module.exports = {
  createArtist,
  loginArtist,
  renewToken,
};
