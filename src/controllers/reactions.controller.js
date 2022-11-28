const { response } = require("express");
const { Like, Comment, User, Artist, Post } = require("../db");

const createLikeUser = async (req, res = response) => {
  try {
    const { like, user, date, postId } = req.body;

    const newLike = await Like.create({
      like,
      date
    });

    const userDB = await User.findAll({
      where: { firstName: user },
    });

    const postDB = await Post.findAll({
      where: { id: postId },
    });

    newLike.addUser(userDB);
    newLike.addPost(postDB);

    res.status(201).json({
      msg: "¡Me gusta!",
      newLike,
    });

  } catch (error) {
    console.log("ERROR EN createLikeUser", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const createCommentUser = async (req, res = response) => {
  try {
    const { comment, date, user, postId } = req.body;

    const newComment = await Comment.create({
      comment,
      date
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
      msg: "¡Acabas de comentar!",
      newComment,
    });

  } catch (error) {
    console.log("ERROR EN createCommentArtist", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const createLikeArtist = async (req, res = response) => {
  try {
    const { like, user, date, postId } = req.body;

    const newLike = await Like.create({
      like,
      date
    });

    const artistDB = await Artist.findAll({
      where: { nickname: user },
    });

    const postDB = await Post.findAll({
      where: { id: postId },
    });

    newLike.addArtist(artistDB);
    newLike.addPost(postDB);

    res.status(201).json({
      msg: "¡Me gusta!",
      newLike,
    });

  } catch (error) {
    console.log("ERROR EN createLikeArtist", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const createCommentArtist = async (req, res = response) => {
  try {
    const { comment, date, user, postId } = req.body;

    const newComment = await Comment.create({
      comment,
      date
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
      msg: "¡Acabas de comentar!",
      newComment,
    });

  } catch (error) {
    console.log("ERROR EN createCommentUser", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};






const addComment = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { comment, user, artist, date } = req.body;
    const commentDB = await Comment.findByPk(id);

    const add = await Comment.create({
      comment,
      date,
    });

    // Usuario
    const userDB = await User.findAll({
      where: { firstName: user },
    });

    // o Artista
    const artistDB = await Artist.findAll({
      where: { firstName: artist },
    });

    // parent comentario al que se comenta
    // const commentDB = await Comment.findByPk(id)




    res.status(201).json({
      msg: "Comentario agregado",
      add,
    });

  } catch (error) {
    console.log("ERROR EN addComment", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const deleteLike = async (req, res = response) => {
  try {
    const { id } = req.params;

    await Like.destroy({ where: { id: id } });
    res.status(201).send({ msg: "Ya no te gusta" });

  } catch (error) {
    console.log("ERROR EN deleteLike", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

// Borrado lógico
const deleteComment = async (req, res = response) => {
  try {
    const { id } = req.params;
    let comment = await Comment.findByPk(id);

    await comment.update({ enabled: false });
    res.status(201).send({ msg: "Comentario eliminado" });

  } catch (error) {
    console.log("ERROR EN deleteComment", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const editComment = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const edit = await Comment.findByPk(id);

    if (!edit) {
      return res.status(404).send({
        msg: "No se encontró tu comentario",
      });
    }

    await edit.update({ comment });
    res.status(201).json({
      msg: "Comentario editado",
      edit,
    });

  } catch (error) {
    console.log("ERROR EN editComment", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const getComments = async (req, res = response) => {
  try {
    const { id } = req.params;

    let allComments = await Post.findByPk(id, {
      include: [
        {
          model: Comment,
          through: {
            attributes: []
          },
          include: [
            {
              model: User,
              attributes: ['firstName', 'image'],
              through: {
                attributes: []
              },
            },
            {
              model: Artist,
              attributes: ['nickname', 'image'],
              through: {
                attributes: []
              },
            }

          ]
        }
      ]
    });
    res.status(200).json({
      msg: 'Comentarios del post',
      allComments,
    });

  } catch (error) {
    console.log("ERROR EN getComments", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

module.exports = {
  createLikeUser,
  createCommentUser,
  createLikeArtist,
  createCommentArtist,
  deleteLike,
  deleteComment,
  editComment,
  getComments
};
