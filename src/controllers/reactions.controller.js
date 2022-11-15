const { response } = require("express");
const { Like, Comment, User, Post } = require("../db");

const createLike = async (req, res = response) => {
  try {
    const { like, user, post } = req.body;

    const newLike = await Like.create({
      like,
    });

    const userDB = await User.findAll({
      where: { firstName: user },
    });

    const postDB = await Post.findAll({
      where: { title: post },
    });

    newLike.addUser(userDB);
    newLike.addPost(postDB);

    res.status(201).json({
      msg: "¡Me gusta!",
      newLike,
    });
  } catch (error) {
    res.status(500).send({ msg: "Hable con el administrador" }, error);
  }
};

const createComment = async (req, res = response) => {
  try {
    const { comment, user, post } = req.body;

    const newComment = await Comment.create({
      comment,
    });

    const userDB = await User.findAll({
      where: { firstName: user },
    });

    const postDB = await Post.findAll({
      where: { title: post },
    });

    newComment.addUser(userDB);
    newComment.addPost(postDB);

    res.status(201).json({
      msg: "¡Acabas de comentar!",
      newComment,
    });
  } catch (error) {
    res.status(500).send({ msg: "Hable con el administrador" }, error);
  }
};

const deleteLike = async (req, res = response) => {
  try {
    const { id } = req.params;

    await Like.destroy({
      where: { id: id },
    });
    res.status(201).send({ msg: "No me gusta" });
  } catch (error) {
    res.status(500).send({ msg: "Hable con el administrador" }, error);
  }
};

const deleteComment = async (req, res = response) => {
  try {
    const { id } = req.params;

    await Comment.update({ enabled: false });
    res.status(201).send({ msg: "Comentario eliminado" });
  } catch (error) {
    res.status(500).send({ msg: "Hable con el administrador" }, error);
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

    await edit.update({
      comment,
    });
    res.status(201).json({
      msg: "Comentario editado",
      edit,
    });
  } catch (error) {
    res.status(500).send({ msg: "Hable con el administrador" }, error);
  }
};

module.exports = {
  createLike,
  createComment,
  deleteLike,
  deleteComment,
  editComment,
};
