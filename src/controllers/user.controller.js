const { response } = require('express');
const { User } = require('../db');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            msg: 'Usuario creado',
            uid: user.id,
            name: user.name,
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

        if (!user) {
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

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            msg: 'Login',
            uid: user.id,
            name: user.name,
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
        const { firstName, email, image, nickname, lastName } =
            await googleVerify(id_token);

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Crear usuario
            const data = {
                firstName,
                lastName,
                nickname,
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

        res.status(201).json({
            ok: true,
            msg: 'Google Sign In',
            uid: user.id,
            name: user.nickname,
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

module.exports = {
    createUser,
    loginUser,
    googleSignIn,
    renewToken,
};
