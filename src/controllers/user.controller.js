const { response } = require('express');
const { User, Artist, Favorite, Event } = require('../db');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const createUser = async (req, res = response) => {
    const { email, password, password2 } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        let artist = await Artist.findOne({ where: { email } });

        if (user || artist) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado',
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
            <a href="${process.env.FRONT_URL || 'http://localhost:3000'
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
            msg: 'Usuario creado',
            id: user.id,
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
                    msg: 'El Artista no ha confirmado su email',
                });
            }

            if (!artist.state) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El Artista no esta activo',
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
            const token = await generateJWT(artist.id, artist.email);

            return res.status(201).json({
                ok: true,
                msg: 'Login',
                id: artist.id,
                email: artist.email,
                image: artist.image,
                spotify: artist.spotify,
                twitter: artist.twitter,
                instagram: artist.instagram,
                nickname: artist.nickname,
                description: artist.description,
                phone: artist.phone,
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

            if (!user.state) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario no esta activo',
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
                id: user.id,
                email: user.email,
                image: user.image,
                firstName: user.firstName,
                lastName: user.lastName,
                admin: user.isAdmin,
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

const patchUser = async (req, res = response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el usuario',
            });
        }

        await user.update(req.body);

        res.status(200).json({
            ok: true,
            msg: 'Usuario actualizado',
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const postFavoriteArtist = async (req, res = response) => {
    const { id } = req.params;
    const userId = req.query.userId;

    try {
        let artistFind = await Artist.findOne({ where: { id: id } });
        let userFind = await User.findOne({ where: { id: userId } });

        const newFavorite = new Favorite(artistFind.dataValues);

        await newFavorite.save();

        await userFind.addFavorite(newFavorite);

        res.status(201).json({
            ok: true,
            msg: 'Artista favorito creado',
            id: newFavorite.id,
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
        const artistsFind = await Favorite.findAll({ where: { state: true} });

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

const deleteFavoriteArtist = async (req, res = response) => {
    try {
        const { id } = req.params;
        const artist = await Favorite.findByPk(id);

        if (!artist || !artist.state) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró el artista favorito',
            });
        }

        await artist.update({ state: false });

        res.status(200).json({
            ok: true,
            msg: 'Artista favorito eliminado',
        });
        
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
        const artist = await Artist.findByPk(uid);
        const usuario = {};
        if (!user && !artist) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        if (user) {
            if (user.confirmed) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario ya confirmado',
                });
            }
            user.confirmed = true;
            await user.save();
            usuario.id = user.id;
            usuario.email = user.email;
            usuario.firstName = user.firstName;
            usuario.lastName = user.lastName;
            usuario.image = user.image;
            usuario.confirmed = user.confirmed;
            usuario.artista = false;
            usuario.token = token;
        }

        if (artist) {
            if (artist.confirmed) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Artista ya confirmado',
                });
            }
            artist.confirmed = true;
            await artist.save();
            usuario.id = artist.id;
            usuario.email = artist.email;
            usuario.firstName = artist.firstName;
            usuario.lastName = artist.lastName;
            usuario.image = artist.image;
            usuario.confirmed = artist.confirmed;
            usuario.spotify = artist.spotify;
            usuario.twitter = artist.twitter;
            usuario.instagram = artist.instagram;
            usuario.nickname = artist.nickname;
            usuario.description = artist.description;
            usuario.phone = artist.phone;
            usuario.artista = true;
            usuario.token = token;
        }

        res.status(200).json({
            ok: true,
            msg: 'Usuario confirmado',
            usuario,
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
            where: { isAdmin: false, state: true },
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

const deleteUser = async (req, res = response) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe',
            });
        }

        await user.update({ state: false });

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado',
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const sendInvoice = async (req, res = response) => {
    const {
            name,
            email,
            quantity,
            id
        } = req.body;
    try {
        const event = await Event.findByPk(id);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Confirmación de Compra',
            text: `
                Hola ${name}!,
                Estamos muy agradecidos por tu compra en DondeSuena, aquí estan los detalles de tu compra:
                Evento: ${event.name}
                Fecha: ${event.date}
                ID del Evento: ${event.id}
                Tickets: ${quantity}
                Precio: ${event.price}$
                Total: ${quantity * event.price}$
                `,
            html: `
                <h4>Hola ${name}!,</h4>
                <p>Estamos muy agradecidos por tu compra en DondeSuena, aquí estan los detalles de tu compra:</p>
                <hr/>
                <table cellspacing="1" bgcolor="#000000">
                    <tr bgcolor="#ffffff" align="center">
                        <th>Evento</th>
                        <td>${event.name}</td>
                    </tr>
                    <tr bgcolor="#ffffff" align="center">
                        <th>Fecha</th>
                        <td>${event.date}</td>
                    </tr>
                    <tr bgcolor="#ffffff" align="center">
                        <th>Cantidad de Tickets</th>
                        <td>${quantity}</td>
                    </tr>
                    <tr bgcolor="#ffffff" align="center">
                        <th>Precio Unitario</th>
                        <td>${event.price}$</td>
                    </tr>
                    <tr bgcolor="#ffffff" align="center">
                        <td></td>
                        <td></td>
                    </tr>
                    <tr bgcolor="#ffffff" align="center">
                        <th>Total</th>
                        <td>${quantity * event.price}$</td>
                    </tr>
                </table>
                <hr/>
                <p>ID del Evento: ${event.id}</p>
                <hr/>
                    `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send(error.message);
            } else {
                console.log('Email enviado');
                res.status(200).json({
                    ok: true,
                    msg: info,
                });
            }
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
            msg: 'email es requerido',
        });
    }
    let verificationLink;
    try {
        const user = await User.findOne({ where: { email } });
        const artist = await Artist.findOne({ where: { email } });

        if (!user && !artist) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }
        let token;
        if (user) {
            token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '15m',
            });
            verificationLink = process.env.FRONT_URL || 'http://localhost:3000';
        }

        if (artist) {
            token = await jwt.sign({ id: artist.id }, process.env.JWT_SECRET, {
                expiresIn: '15m',
            });
            verificationLink = process.env.FRONT_URL || 'http://localhost:3000';
        }

        verificationLink = `${verificationLink}/reset-password/${token}`;

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
            <a href=${verificationLink}>Click Here</a>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Email enviado');
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
        const artist = await Artist.findByPk(id);

        if (!user && !artist) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe',
            });
        }

        if (user) {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
            await user.save();
        }

        if (artist) {
            const salt = bcrypt.genSaltSync();
            artist.password = bcrypt.hashSync(password, salt);
            await artist.save();
        }

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
    deleteFavoriteArtist,
    getFavoritesArtists,
    getFavoritesById,
    sendInvoice,
    forgetPassword,
    createNewPassword,
    patchUser,
    deleteUser,
};
