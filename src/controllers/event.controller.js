const { response } = require('express');
const { Event, Place, Artist } = require('../db');
const { Op } = require('sequelize');

const createEvent = async (req, res = response) => {
    const {
        name,
        description,
        date,
        start,
        end,
        price,
        quantity,
        placeId,
        artistName,
        image,
    } = req.body;

    try {
        let eventExis = await Event.findOne({ where: { name } });

        if (eventExis) {
            return res.status(400).json({
                ok: false,
                msg: 'El evento ya existe con ese nombre',
            });
        }

        const event = await Event.create({
            name,
            description,
            date,
            start,
            end,
            price,
            quantity,
            image,
        });

        const place = await Place.findByPk(placeId);
        const artist = await Artist.findOne({
            where: { nickname: artistName },
        });

        if (!place) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro lugar con ese nombre',
            });
        }

        if (!artist) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro artista con ese nombre',
            });
        }

        await event.addPlace(place);
        await event.addArtist(artist);

        res.status(201).json({
            ok: true,
            msg: 'Evento creado',
            event,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const getEvents = async (req, res = response) => {
    const search = req.query.search || '';
    const limit = Number(req.query.limit);
    const date = req.query.date || '';
    try {
        if (search) {
            // buscar por nombre del evento
            const events = await Event.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${search}%`,
                    },
                },
            });

            return res.status(200).json({
                ok: true,
                msg: 'Eventos encontrados',
                events,
            });
        }

        if (limit) {
            const events = await Event.findAll({
                limit,
            });

            return res.status(200).json({
                ok: true,
                msg: 'Eventos encontrados',
                events,
            });
        }

        if (date) {
            const events = await Event.findAll({
                where: {
                    date: {
                        [Op.iLike]: `%${date}%`,
                    },
                },
            });

            return res.status(200).json({
                ok: true,
                msg: 'Eventos encontrados',
                events,
            });
        }

        const events = await Event.findAll({
            where: { state: true },
        });

        if (!events) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron eventos',
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Lista de eventos',
            events,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const deleteEvent = async (req, res = response) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);

        if (!event || !event.state) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro evento con ese Id',
            });
        }

        await event.update({ state: false });

        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const getEvent = async (req, res = response) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);

        if (!event || !event.state) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro evento con ese Id',
            });
        }

        res.status(200).json({
            ok: true,
            msg: 'Evento encontrado',
            event,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
        });
    }
};

const updateEvent = async (req, res = response) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);

        if (!event || !event.state) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro evento con ese Id',
            });
        }

        await event.update(req.body);

        res.status(200).json({
            ok: true,
            msg: 'Evento actualizado',
            event,
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
    createEvent,
    getEvents,
    deleteEvent,
    updateEvent,
    getEvent,
};
