const { response } = require('express');
const { Comment, Response, User, Artist, Post } = require('../db');

const createCommentUser = async (req, res = response) => {
    try {
        const { body, date, user, postId } = req.body;

        const newComment = await Comment.create({
            body,
            date,
        });

        const userDB = await User.findAll({
            where: { firstName: user },
        });

        const postDB = await Post.findAll({
            where: { id: postId },
        });

        newComment.addUser(userDB);
        newComment.addPost(postDB);

        res.status(201).json({
            msg: '¡Acabas de comentar!',
            newComment,
        });

    } catch (error) {
        console.log('ERROR EN createCommentArtist', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};


const createCommentArtist = async (req, res = response) => {
    try {
        const { body, date, user, postId } = req.body;

        const newComment = await Comment.create({
            body,
            date,
        });

        const artistDB = await Artist.findAll({
            where: { nickname: user },
        });

        const postDB = await Post.findAll({
            where: { id: postId },
        });

        newComment.addArtist(artistDB);
        newComment.addPost(postDB);

        res.status(201).json({
            msg: '¡Acabas de comentar!',
            newComment,
        });

    } catch (error) {
        console.log('ERROR EN createCommentUser', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

const addCommentUser = async (req, res = response) => {
    try {
        const { body, date, user, commentId } = req.body;

        const newResponse = await Response.create({
            body,
            date,
        });

        const userDB = await User.findAll({
            where: { firstName: user },
        });

        const commentDB = await Comment.findAll({
            where: { id: commentId },
        });

        newResponse.addUser(userDB);
        newResponse.addComment(commentDB);

        res.status(201).json({
            msg: 'Respondiste como usuario',
            newResponse,
        });

    } catch (error) {
        console.log('ERROR EN createResponseUser', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

const addCommentArtist = async (req, res = response) => {
    try {
        const { body, date, user, commentId } = req.body;

        const newResponse = await Response.create({
            body,
            date,
        });

        const userDB = await Artist.findAll({
            where: { nickname: user },
        });

        const commentDB = await Comment.findAll({
            where: { id: commentId },
        });

        newResponse.addUser(userDB);
        newResponse.addComment(commentDB);

        res.status(201).json({
            msg: 'Respondiste como artista',
            newResponse,
        });

    } catch (error) {
        console.log('ERROR EN createResponseArtista', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

// Borrado lógico
const deleteComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        let comment = await Comment.findByPk(id);

        await comment.update({ enabled: false });
        res.status(201).send({ msg: 'Comentario eliminado' });

    } catch (error) {
        console.log('ERROR EN deleteComment', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

const editComment = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { body, date } = req.body;
        const edit = await Comment.findByPk(id);

        if (!edit) {
            return res.status(404).send({
                msg: 'No se encontró tu comentario',
            });
        }

        await edit.update({ body, date });
        res.status(201).json({
            msg: 'Comentario editado',
            edit,
        });

    } catch (error) {
        console.log('ERROR EN editComment', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

const getComments = async (req, res = response) => {
    try {
        const { id } = req.params;

        let commentsId = await Post.findByPk(id, {
            include: [
                {
                    model: Artist,
                    attributes: ['nickname', 'image'],
                    through: {
                        attributes: []
                    },
                },
                {
                    model: Comment,
                    through: {
                        attributes: [],
                    },
                    include: [
                        {
                            model: Response,
                            through: {
                                attributes: [],
                            },
                        },
                        {
                            model: User,
                            attributes: ['id', 'firstName', 'image'],
                            through: {
                                attributes: []
                            },
                        },
                        {
                            model: Artist,
                            attributes: ['id', 'nickname', 'image'],
                            through: {
                                attributes: []
                            },
                        }
                    ],
                },
            ],
        });
        res.status(200).json({
            msg: 'Comentarios del post',
            commentsId,
        });

    } catch (error) {
        console.log('ERROR EN getCommentsById', error);
        res.status(500).send({ msg: 'Hable con el administrador' });
    }
};

module.exports = {
    createCommentUser,
    createCommentArtist,
    deleteComment,
    editComment,
    getComments,
    addCommentUser,
    addCommentArtist,
};
