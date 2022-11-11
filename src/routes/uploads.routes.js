const { Router } = require('express');
const { check } = require('express-validator');

const {
    validateFields,
    validateFileUp,
} = require('../middlewares/validate-fields');

const { uploadFile } = require('../controllers/uploads.controller');

const router = Router();

router.post('/', validateFileUp, uploadFile);
