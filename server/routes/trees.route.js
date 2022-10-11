const express = require('express');
const router = express.Router();

const {Tree, Trees} = require("../models/trees.model");

const db = require('../config/database');

const TreesController = require("../controllers/trees.controller");
const TreesRepository = require("../repositories/trees.repository");
const TreeErrorRepository = require("../errors/trees.error");

const treesRepository = new TreesRepository(db);
const treesController = new TreesController(treesRepository, Tree, TreeErrorRepository);




module.exports = router;
