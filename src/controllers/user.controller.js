const { response } = require('express');
const { User, Artist, Favorite } = require('../db');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const createUser = async (req, res = response) => {
    const { email, password, password2 } = req.body;

    try {
        let user = await User.findOne({ where: { email } });

        if (user) {
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

        user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt); // me genera un hash

        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id, user.email);

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
            <a href="http://localhost:3000/confirm/${token}">Confirmar registro</a>`,
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
            msg: 'Usuario creado',
            uid: user.id,
            email: user.email,
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

const loginUser = async (req, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        const artist = await Artist.findOne({ where: { email } });

        if (!user && !artist) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email',
            });
        }

        if (!!artist) {
            if (!artist.confirmed) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no ha confirmado su email',
                });
            }
            const validPassword = bcrypt.compareSync(password, artist.password); // me compara el password que me llega con el hash que tengo en la base de datos

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                });
            }
            // Generar JWT
            const token = await generateJWT(user.id, artist.email);

            return res.status(201).json({
                ok: true,
                msg: 'Login',
                uid: artist.id,
                email: artist.email,
                artista: true,
                token,
            });
        }

        if (!!user) {
            if (!user.confirmed) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no ha confirmado su email',
                });
            }
            const validPassword = bcrypt.compareSync(password, user.password); // me compara el password que me llega con el hash que tengo en la base de datos

            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                });
            }

            // Generar JWT
            const token = await generateJWT(user.id, user.email);

            return res.status(201).json({
                ok: true,
                msg: 'Login',
                uid: user.id,
                email: user.email,
                artista: false,
                token,
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

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { firstName, email, image } = await googleVerify(id_token);

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Crear usuario
            const data = {
                lastName: firstName,
                birthday: '1990-01-01',
                phone: '123456789',
                dni: '12345678',
                firstName,
                email,
                password: 'xD',
                image,
                google: true,
            };

            user = new User(data);
            await user.save();
        }

        // Si el usuario en DB
        if (!user.state) {
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado',
            });
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.nickname);
        return res.status(201).json({
            ok: true,
            msg: 'Google Sign In',
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Token de Google no es válido',
        });
    }
};

const postFavoriteArtist = async (req, res = response) => {
    const { id } = req.params;

    try {
        let artistFind = await Artist.findOne({ where: { id: id } });

        const newFavorite = new Favorite(artistFind.dataValues);

        await newFavorite.save();

        res.status(201).json({
            ok: true,
            msg: 'Artista favorito creado',
            uid: newFavorite.id,
            name: newFavorite.firstName,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const getFavoritesArtists = async (req, res = response) => {
    try {
        const artistsFind = await Favorite.findAll();

        if (!artistsFind) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontroraron los artistas favoritos',
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Lista de artistas favoritos',
            artistsFind,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const getFavoritesById = async (req, res = response) => {
    try {
        const { id } = req.params;

        if (id) {
            const artistID = await Favorite.findOne({
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

const confirmationToken = async (req, res = response) => {
    const { token } = req.params;

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(uid);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
        }

        if (user.confirmed) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario ya confirmado',
            });
        }

        user.confirmed = true;

        await user.save();

        res.status(200).json({
            ok: true,
            msg: 'Usuario confirmado',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const getUsers = async (req, res = response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'image'],
        });

        res.status(200).json({
            ok: true,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const getUser = async (req, res = response) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id, {
            attributes: ['id', 'firstName', 'lastName', 'email', 'image'],
        });

        if (!user) {
            return res.status(404).json({
                ok: false,

                msg: 'Usuario no existe',
            });
        }

        res.status(200).json({
            ok: true,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const forgetPassword = async (req, res = response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            ok: false,
            msg: 'nombre del usuario es requerido',
        });
    }
    let verificationLink;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
        }

        const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        verificationLink = `http://localhost:3000/reset-password/${token}`;

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
            subject: 'Reset Password',
            html: `<h1>Click the link to reset your password</h1>
            <a href=${verificationLink}>${verificationLink}</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });

        res.status(200).json({
            ok: true,
            msg: 'Email enviado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const createNewPassword = async (req, res = response) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
        }

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        res.status(200).json({
            ok: true,
            msg: 'Contraseña actualizada',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    googleSignIn,
    renewToken,
    confirmationToken,
    getUsers,
    getUser,
    postFavoriteArtist,
    getFavoritesArtists,
    getFavoritesById,
    forgetPassword,
    createNewPassword,
};
