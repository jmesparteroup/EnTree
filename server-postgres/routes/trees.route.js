const express = require('express');
const router = express.Router();

const pool = require('../config/database');

const Trees = require('../models/trees.model');

const TreesController = require("../controllers/trees.controller");
const TreesRepository = require("../repositories/trees.repository");
const TreeErrorRepository = require("../errors/trees.error");

const treesRepository = new TreesRepository(pool);
const treesController = new TreesController(treesRepository, Trees, TreeErrorRepository);

router.get("/", treesController.getAllTrees.bind(treesController));
router.get("/:id", treesController.getTreeById.bind(treesController));
router.get("/proximity/:location/:radius", treesController.getTreeByProximity.bind(treesController));

router.post("/", treesController.createTree.bind(treesController));
router.put("/:id", treesController.updateTree.bind(treesController));
router.delete("/:id", treesController.deleteTree.bind(treesController));

module.exports = router;
