const { Router } = require('express');
const { Reaction } = require('../db');
const { createReaction } = require('../controllers/reaction.controller');

const router = Router();

// RUTA POST -> crear las reacciones (likes y comentarios)
router.post('/reaction', async (req, res) => {
    try {
        const data = req.body;
        await createReaction(data);
        res.status(200).send({ msg: '¡Tus reacciones se subieron!'})
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA POST A /reaction'}, error);
    }
});

// RUTA PUT -> Actualizar reacciones
router.put('/reaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const dataReaction = req.body;

        await Reaction.update(dataReaction, {
            where: { id: id }
        });
        res.send('Se actualizaron tus reacciones');
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA PUT A /reaction/:id'}, error);
    }
});

// RUTA DELETE -> Eliminar post 
router.delete('/reaction/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await Reaction.destroy({
            where: { id: id }
        });
        res.send('Reacciones borradas');
        
    } catch (error) {
        res.status(400).send({ msg: 'ERROR EN RUTA DELETE A /reaction/:id'}, error);
    }
});