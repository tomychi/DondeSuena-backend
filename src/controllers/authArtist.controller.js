const { response } = require('express');
const { Artist } = require('../db');
const bcrypt = require('bcryptjs');

const createArtist = async (req, res = response) => {
    const { email, password, password2 } = req.body;

    try {
        let artist = await Artist.findOne({ where: { email } });

        if (artist) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email',
            });
        }

        if (password !== password2) {
            return res.status(400).json({
                ok: false,
                msg: 'Las contraseñas no coinciden',
            });
        }

        artist = new Artist(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt); // me genera un hash

        await artist.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado',
            uid: user.id,
            name: user.name,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
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
                msg: 'El usuario no existe con ese email',
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, user.password); // me compara el password que me llega con el hash que tengo en la base de datos

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Login',
            uid: user.id,
            name: user.name,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};
module.exports = {
    createArtist,
    loginArtist,
};
