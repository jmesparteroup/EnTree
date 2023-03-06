const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const pool = require('../config/database');

const Trees = require('../models/trees.model');

const TreesController = require("../controllers/trees.controller");
const TreesRepository = require("../repositories/trees.repository");
const TreeErrorRepository = require("../errors/trees.error");

const treesRepository = new TreesRepository(pool);
const treesController = new TreesController(treesRepository, Trees, TreeErrorRepository);

router.get("/", treesController.getAllTrees.bind(treesController));
router.get("/proximity", treesController.getTreeByProximity.bind(treesController));
router.get("/bycity", treesController.getTreeByCity.bind(treesController));
router.get("/hex", treesController.getTreeByHex.bind(treesController));
router.get("/:id", treesController.getTreeById.bind(treesController));

router.post("/", auth, treesController.createTree.bind(treesController));
router.patch("/:id", treesController.updateTree.bind(treesController));
router.delete("/:id", auth, treesController.deleteTree.bind(treesController));

module.exports = router;
