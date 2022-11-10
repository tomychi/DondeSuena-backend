const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {
    // x-token headers
    const token = req.header('x-token');

    // si no existe el token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion',
        });
    }
    try {
        // verificar el token
        const { uid, name } = jwt.verify(token, process.env.JWT_SECRET);
        // si el token es valido
        req.uid = uid;
        req.name = name;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido',
        });
    }
    next();
};

module.exports = {
    validateJWT,
};
