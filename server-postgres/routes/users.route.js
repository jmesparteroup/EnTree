const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const UsersModel = require('../models/users.model');
const UsersRepository = require('../repositories/users.repository');
const UsersError = require('../errors/users.error');

const pool = require('../config/database');

const usersRepository = new UsersRepository(pool);
const usersController = new UsersController(usersRepository, UsersModel, UsersError);


router.get('/', usersController.getAllUsers.bind(usersController));
router.get('/:id', usersController.getUserById.bind(usersController));

router.post('/', usersController.createUser.bind(usersController));
router.put('/:id', usersController.updateUser.bind(usersController));
router.delete('/:id', usersController.deleteUser.bind(usersController));

router.post('/login', usersController.loginUser.bind(usersController));




module.exports = router;
