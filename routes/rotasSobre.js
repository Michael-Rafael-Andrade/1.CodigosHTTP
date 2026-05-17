var express = require('express');
var router = express.Router();

const controllerSobre = require('../controller/controllerSobre.js');

// Rota Sobre - GET
router.get('/', controllerSobre.cria_sobre);

module.exports = router;

