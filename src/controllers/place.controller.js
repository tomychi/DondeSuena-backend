const { response } = require('express');
const { Place } = require('../db');

const createPlace = async (req, res = response) => {
    const { name, address, city, postCode, phone, email, image } = req.body;
    try {
        let placeExis = await Place.findOne({ where: { name } });

        if (placeExis) {
            return res.status(400).json({
                ok: false,
                msg: 'El lugar ya existe con ese nombre',
            });
        }

        const place = await Place.create({
            name,
            address,
            city,
            postCode,
            phone,
            email,
            image,
        });

        res.status(201).json({
            ok: true,
            place,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const getPlaces = async (req, res = response) => {
    const places = await Place.findAll({ where: { state: true } });
    res.json({
        ok: true,
        places,
    });
};

const getPlace = async (req, res = response) => {
    const { id } = req.params;

    try {
        const place = await Place.findByPk(id);

        if (!place) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro lugar con ese id',
            });
        }

        res.json({
            ok: true,
            place,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const updatePlace = async (req, res = response) => {
    const { id } = req.params;
    const { name, address, city, postCode, phone, email, image } = req.body;

    try {
        const place = await Place.findByPk(id);

        if (!place) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro lugar con ese id',
            });
        }

        const placeExis = await Place.findOne({ where: { name } });

        if (placeExis && placeExis.id !== id) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un lugar con ese nombre',
            });
        }

        await place.update({
            name,
            address,
            city,
            postCode,
            phone,
            email,
            image,
        });

        res.json({
            ok: true,
            place,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
};

const deletePlace = async (req, res = response) => {
    const { id } = req.params;

    try {
        const place = await Place.findByPk(id);
        if (!place) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro lugar con ese id',
            });
        }

        await place.update({ state: false });

        res.json({
            ok: true,
            place,
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
    createPlace,
    getPlaces,
    getPlace,
    updatePlace,
    deletePlace,
};
