const { response } = require('express');
const { Artist, Genre } = require('../db');
const bcrypt = require('bcryptjs');

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
        facebook,
        instagram,
        spotify,
        image,
        genres,
    } = req.body;

    try {
        let artistFind = await Artist.findOne({ where: { email } });

        if (artistFind) {
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

        const newArtist = await Artist.create({
            firstName,
            lastName,
            nickname,
            email,
            password,
            phone,
            description,
            location,
            facebook,
            instagram,
            spotify,
            image,
        });

        const genresDB = await Genre.findAll({
            where: { name: genres },
        });

        newArtist.addGenre(genresDB);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        newArtist.password = bcrypt.hashSync(password, salt); // me genera un hash

        await newArtist.save();

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado',
            uid: newArtist.id,
            name: newArtist.firstName,
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
        const validPassword = bcrypt.compareSync(password, artist.password); // me compara el password que me llega con el hash que tengo en la base de datos

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Login',
            uid: artist.id,
            name: artist.firstName,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const getArtists = async (req, res = response) => {
    try {
        const artists = await Artist.findAll({
            where: { state: true },
        });

        if (!artists) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron usuarios',
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Lista de artistas',
            artists,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const updateArtist = async (req, res = response) => {
    try {
        const { id } = req.params;
        const artist = await Artist.findByPk(id);

        if (!artist) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el usuario',
            });
        }

        await artist.update(req.body);

        res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado',
            artist,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const deleteArtist = async (req, res = response) => {
    const { id } = req.params;
    try {
        const artist = await Artist.findByPk(id);

        if (!artist || !artist.state) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro el usuario con ese Id',
            });
        }

        await artist.update({ state: false });

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const renewToken = async (req, res = response) => {
    const { uid, name } = req;

    // Generar un nuevo JWT
    const token = await generateJWT(uid, name);
    res.status(201).json({
        ok: true,
        msg: 'Renew',
        uid,
        name,
        token,
    });
};

module.exports = {
    createArtist,
    loginArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    renewToken,
};
