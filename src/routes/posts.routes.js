const { Router } = require('express');
const { Post, Reaction } = require('../db');
const { createPosts } = require('../controllers/posts.controller');

const router = Router();

// RUTA POST -> crear los posteos
router.post('/createPost', async (req, res) => {
    try {
        const data = req.body;
        await createPosts(data);
        res.status(200).send({ msg: '¡Tu post ha sido creado!'})

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA POST A /posts'}, error);
    }
});

// RUTA GET -> Traer todos los posts creados
router.get('/getPosts', async (req, res) => {
    try {
        const allPosts = await Post.findAll({ include: Reaction });
        res.status(200).send(allPosts);
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA GET A /posts'}, error);
    }
});

// RUTA GET -> Traer un post específico
router.get('/getPost/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        let postId = await Post.findByPk(id);
        res.status(200).send(postId)
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA GET A /post/:id'}, error);
    }
});

// RUTA PUT -> Actualizar post
router.put('/updatePost/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataPost = req.body;

        await Post.update(dataPost, {
            where: { id: id }
        });
        res.send('Post actualizado');
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA PUT A /post/:id'}, error);
    }
});

// RUTA DELETE -> Eliminar post 
router.delete('/deletePost/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Post.destroy({
            where: { id: id }
        });
        res.send('Post borrado');
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /post/:id'}, error);
    }
});

module.exports = router;