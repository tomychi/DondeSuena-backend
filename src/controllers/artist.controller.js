const { response } = require('express');
const { Artist, Genre, Event } = require('../db');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const nodemailer = require('nodemailer');

// CREAR ARTISTA ----------------------------------------------------------------------
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
        twitter,
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
            twitter,
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

        // generar el JWT
        const token = await generateJWT(newArtist.id, newArtist.email);

        // Enviar email de confirmación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
            port: 465,
            host: 'smtp.gmail.com',
            secure: true,
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Confirmación de registro',
            html: `<h1>Gracias por registrarte en DondeSuena</h1>
            <p>Para confirmar tu registro haz click en el siguiente enlace</p>
            <a href="${
                process.env.FRONT_URL || 'http://localhost:3000'
            }/confirm/${token}">Confirmar registro</a>`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado');
            }
        });

        res.status(201).json({
            ok: true,
            msg: 'Artista creado',
            uid: newArtist.id,
            name: newArtist.firstName,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

// VER ARTISTAS ----------------------------------------------------------------------
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

// VER ARTISTA POR ID ----------------------------------------------------------------------
const getArtistById = async (req, res = response) => {
    try {
        const { id } = req.params;

        if (id) {
            const artistID = await Artist.findOne({
                where: { id: id },
            });

            if (!artistID || !artistID.state) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No se encontró el usuario',
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Usuario encontrado',
                artistID,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

// ACTUALIZAR INFORMACION ARTISTAS ----------------------------------------------------------------------
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

const patchArtist = async (req, res = response) => {
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

// BORRAR ARTISTA ----------------------------------------------------------------------
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

// TOKEN ----------------------------------------------------------------------
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
    getArtists,
    updateArtist,
    patchArtist,
    deleteArtist,
    renewToken,
    getArtistById,
};
