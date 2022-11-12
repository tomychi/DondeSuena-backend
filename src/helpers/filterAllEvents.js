const { Op } = require('sequelize');
const { Event, Artist, Place } = require('../db');

const filterAllEvents = async (
    { name, description, beginDate, endDate },
    { limit, offset }
) => {
    let where = {};
    if (name) {
        where.name = {
            [Op.iLike]: `%${name}%`,
        };
        where.state = true;
    }
    if (description) {
        where.description = {
            [Op.iLike]: `%${description}%`,
        };
        where.state = true;
    }

    if (beginDate && !endDate) {
        where.date = {
            [Op.gte]: beginDate,
        };
        where.state = true;
    }

    if (beginDate && endDate) {
        where.date = {
            [Op.between]: [beginDate, endDate],
        };
        where.state = true;
    }

    if (!beginDate && endDate) {
        where.date = {
            [Op.lte]: endDate,
        };
        where.state = true;
    }

    // si no viene ningun filtro, se devuelve todos los eventos
    if (!name && !description && !beginDate && !endDate) {
        where = { state: true };
    }

    // si no viene ningun limite, se deja el default
    if (!limit) {
        limit = 10;
    }
    // si no viene ningun offset, se deja el default
    if (!offset) {
        offset = 0;
    }

    const events = await Event.findAll({
        where,
        limit,
        offset,
    });

    return events;
};

module.exports = {
    filterAllEvents,
};
