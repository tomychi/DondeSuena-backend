const { response } = require('express');
const { Post, Artist, Like, Comment } = require('../db');

const createPosts = async (req, res = response) => {
    try {
        const { description, image, date, artists } = req.body;

        const post = await Post.create({
            description,
            image,
            date
        });

        const artistsDB = await Artist.findAll({
            where: { nickname: artists }
        });

        post.addArtist(artistsDB);

        res.status(201).json({
            msg: '¡Tu post ha sido creado!',
            post,
        });

    } catch (error) {
        console.log("ERROR EN createPosts", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

const getAllPosts = async (req, res = response) => {
    try {
        const { name } = req.query;

        if (name) {
            const findPosts = await Artist.findOne({
                where: { nickname: name },
                attributes: ["nickname"],
                include: [
                    {
                        model: Post,
                        //where: { enabled: true },
                        through: {
                            attributes: []
                        },
                        include: [
                            {
                                model: Like,
                                through: {
                                    attributes: []
                                },
                            },
                            {
                                model: Comment,
                                through: {
                                    attributes: []
                                },
                            }
                        ]
                    }
                ]
            });
            return res.status(200).json({
                msg: `Estos son los posteos de ${name}`,
                findPosts
            })
        }

        else {
            const allPosts = await Post.findAll(
                //{ where: { status: true } },
                {
                    include: [
                        {
                            model: Like,
                            through: {
                                attributes: []
                            },
                            model: Comment,
                            through: {
                                attributes: []
                            },
                            model: Artist,
                            attributes: ['nickname', 'image'],
                            through: {
                                attributes: [],
                            },
                        }
                    ]
                });
            return res.status(200).json({
                msg: 'Todos los post de los artistas',
                allPosts,
            });
        }

    } catch (error) {
        console.log("ERROR EN getAllPosts", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

const getPostById = async (req, res = response) => {
    try {
        const { id } = req.params;

        let postId = await Artist.findByPk(id, {
            attributes: ["nickname", "image"],
            include: [
                {
                    model: Post,
                    //where: { enabled: true },
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Like,
                            through: {
                                attributes: []
                            },
                        },
                        {
                            model: Comment,
                            through: {
                                attributes: []
                            },
                        }
                    ]
                }
            ]
        });
        res.status(200).json({
            msg: 'Tus posteos',
            postId,
        });

    } catch (error) {
        console.log("ERROR EN getPostById", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

const editPost = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { description, image, date } = req.body;

        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).send({
                msg: 'No se encontró tu post',
            });
        }

        await post.update({
            description,
            image,
            date
        });

        res.status(201).json({
            msg: 'Post actualizado',
            post,
        });

    } catch (error) {
        console.log("ERROR EN editPost", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

// Borrado lógico
const deletePost = async (req, res = response) => {
    try {
        const { id } = req.params;
        const post = await Post.findByPk(id);

        if (!post) {
            return res.status(404).send({
                msg: 'No se encontró tu post',
            });
        }

        await post.update({ enabled: false });
        res.status(201).send({ msg: 'Post eliminado' });

    } catch (error) {
        console.log("ERROR EN deletePost", error);
        res.status(500).send({ msg: "Hable con el administrador" });
    }
};

module.exports = { createPosts, getAllPosts, getPostById, editPost, deletePost };