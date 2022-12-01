const { response } = require('express');
const { User, Artist, Event, Place } = require('../db');
const { Op } = require('sequelize');

const searchAllData = async (req, res = response) => {
    const { search } = req.params;

    try {
        // promise all para que se ejecuten todas las promesas al mismo tiempo
        // buscar cualquier coincidencia en la tabla de usuarios, artistas, eventos o lugares
        const [users, artists, events, places] = await Promise.all([
            User.findAll({
                where: {
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            lastName: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                    ],
                },
            }),
            Artist.findAll({
                where: {
                    [Op.or]: [
                        {
                            firstName: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            lastName: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            nickname: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                    ],
                },
            }),
            Event.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            description: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            address: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            city: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            genre: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                    ],
                },
            }),
            Place.findAll({
                where: {
                    [Op.or]: [
                        {
                            name: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            address: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            city: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                        {
                            email: {
                                [Op.iLike]: `%${search}%`,
                            },
                        },
                    ],
                },
            }),
        ]);

        const results = {
            users: users.length === 0 ? null : users,
            artists: artists.length === 0 ? null : artists,
            events: events.length === 0 ? null : events,
            places: places.length === 0 ? null : places,
        };

        // si hay resultados
        return res.status(200).json({
            ok: true,
            results,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'por favor hable con el administrador',
        });
    }
};

module.exports = {
    searchAllData,
};
