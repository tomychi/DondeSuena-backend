const { response } = require('express');
const { User } = require('../db');
const bcrypt = require('bcryptjs');

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

module.exports = {
    createUser,
};
