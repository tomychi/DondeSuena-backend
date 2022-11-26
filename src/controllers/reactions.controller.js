const { response } = require("express");
const { Like, Comment, User, Artist, Post } = require("../db");

const createLike = async (req, res = response) => {
  try {
    const { like, user, artist, date, post } = req.body;

    const newLike = await Like.create({
      like,
      date
    });

    // Usuario
    const userDB = await User.findAll({
      where: { firstName: user },
    });

    // o artista
    const artistDB = await Artist.findAll({
      where: { firstName: artist },
    });

    const postDB = await Post.findAll({
      where: { title: post },
    });

    newLike.addUser(userDB);
    newLike.addArtist(artistDB);
    newLike.addPost(postDB);

    res.status(201).json({
      msg: "¡Me gusta!",
      newLike,
    });

  } catch (error) {
    console.log("ERROR EN createLike", error);
    res.status(500).send({ msg: "Hable con el administrador" });
  }
};

const createComment = async (req, res = response) => {
  try {
    const { comment, date, user, artist, postId } = req.body;

    const newComment = await Comment.create({
      comment,
      date
    });

    // Usuario
    const userDB = await User.findAll({
      where: { firstName: user },
    });

    // o Artista
    const artistDB = await Artist.findAll({
      where: { firstName: artist },
    });

    const postDB = await Post.findByPk({
      where: { id: postId },
    });

    newComment.addUser(userDB);
    newComment.addArtist(artistDB);
    newComment.addPost(postDB);

    res.status(201).json({
      msg: "¡Acabas de comentar!",
      newComment,
    });

  } catch (error) {
    console.log("ERROR EN createLike", error);
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


module.exports = {
  createLike,
  createComment,
  deleteLike,
  deleteComment,
  editComment,
};
