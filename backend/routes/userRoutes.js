const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const userCtrl = require('../controllers/userController');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;