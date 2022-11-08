const { response } = require('express');
const { Event } = require('../db');

const createEvent = async (req, res = response) => {
    const { name } = req.body;

    try {
        let event = await Event.findOne({ where: { name } });

        if (event) {
            return res.status(400).json({
                ok: false,
                msg: 'El evento ya existe con ese nombre',
            });
        }

        event = new Event(req.body);

        await event.save();

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
    try {
        const events = await Event.findAll({
            where: { state: true },
        });

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

        if (!event) {
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

const updateEvent = async (req, res = response) => {
    const { id } = req.params;
    try {
        const event = await Event.findByPk(id);

        if (!event) {
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
};

/*
{
    "name": "Evento 1",
    "description": "Evento 1",
    "date": "2021-08-01",
    "start": "10:00",
    "end": "12:00",
    "price": 100,
    "quantity": 100

}

*/
