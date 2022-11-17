const { Op } = require('sequelize');
const { Event, Artist, Genre } = require('../db');

const filterAllEvents = async ({
    name,
    description,
    beginDate,
    endDate,
    city,
    address,
    artist,
    genre,
    // search,
}) =>
    // { limit, offset }
    {
        let where = {};

        // if (search) {
        //     where = {
        //         [Op.or]: [
        //             {
        //                 name: {
        //                     [Op.iLike]: `%${search}%`,
        //                 },
        //             },
        //             {
        //                 description: {
        //                     [Op.iLike]: `%${search}%`,
        //                 },
        //             },
        //             {
        //                 city: {
        //                     [Op.iLike]: `%${search}%`,
        //                 },
        //             },
        //             {
        //                 address: {
        //                     [Op.iLike]: `%${search}%`,
        //                 },
        //             },
        //         ],
        //     };
        // }

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

        if (city) {
            where.city = {
                [Op.iLike]: `%${city}%`,
            };
            where.state = true;
        }

        if (address) {
            where.address = {
                [Op.iLike]: `%${address}%`,
            };
            where.state = true;
        }

        // buscamos el artista por su nickname en la tabla artist
        if (artist) {
            const artistFound = await Artist.findOne({
                where: { nickname: artist, state: true },
            });
            if (artistFound) {
                where.state = true;
                const events = await Event.findAll({
                    where,
                    include: [
                        {
                            model: Artist,
                            where: { id: artistFound.id },
                            attributes: ['nickname'],
                        },
                    ],
                    // limit,
                    // offset,
                });
                return events;
            }
        }

        // buscamos el genero por su nombre en la tabla genre
        if (genre) {
            const genreFound = await Genre.findOne({
                where: { name: genre, state: true },
            });
            if (genreFound) {
                where.state = true;
                const events = await Event.findAll({
                    where,
                    include: [
                        {
                            model: Genre,
                            where: { id: genreFound.id },
                            attributes: ['name'],
                        },
                    ],
                    // limit,
                    // offset,
                });
                return events;
            }
        }

        // si no viene ningun filtro, se devuelve todos los eventos
        if (
            !name &&
            !description &&
            !beginDate &&
            !endDate &&
            !city &&
            !address &&
            !genre &&
            !artist
        ) {
            where = { state: true };
        }

        // si no viene ningun limite, se deja el default
        // if (!limit) {
        //     limit = 10;
        // }
        // si no viene ningun offset, se deja el default
        // if (!offset) {
        //     offset = 0;
        // }

        const events = await Event.findAll({
            where,
            // limit,
            // offset,
        });

        return events;
    };

module.exports = {
    filterAllEvents,
};
