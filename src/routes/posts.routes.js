const { Router } = require('express');
const { Post } = require('../db');
const { createPosts, getPostDB } = require('../controllers/posts.controller');

const router = Router();

// Ruta modularizada -> /post

// RUTA POST -> crear los posteos
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        await createPosts(data);
        res.status(200).send({ msg: '¡Tu post ha sido creado!' })

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA POST A /posts' }, error);
    }
});

// RUTA GET -> Traer todos los posts creados & por query 
router.get('/', async (req, res) => {
    try {
        const { name } = req.query;
        let allPosts = await getPostDB();

        if (name) {
            let filterPost = allPosts.filter(p => p.title.toLowerCase() === name.toLowerCase());
            filterPost.lenght
                ? res.status(200).send(filterPost)
                : res.status(404).send('Post Not Found')
        } else {
            res.status(200).send(allPosts);
        }

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA GET A /posts' }, error);
    }
});

// RUTA GET -> Traer un post específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let allPosts = await getPostDB();

        if(id){
            let postId = allPosts.find(p => p.id == id);
            postId
            ? res.status(200).send(postId)
            : res.status(404).send('Post Not Found')
        }
        // let postId = await Post.findByPk(id, {
        //     include: {
        //         model: Reaction,
        //         attibutes: ['nickname'],
        //         through: {
        //             attibutes: [],
        //         },
        //     }
        // });
        //res.status(200).send(postId)

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA GET A /post/:id' }, error);
    }
});

// RUTA PUT -> Actualizar post
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataPost = req.body;

        await Post.update(dataPost, {
            where: { id: id }
        });
        res.send('Post actualizado');

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA PUT A /post/:id' }, error);
    }
});

// RUTA DELETE -> Eliminar post 
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Post.destroy({
            where: { id: id }
        });
        res.send('Post borrado');

    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /post/:id' }, error);
    }
});

module.exports = router;