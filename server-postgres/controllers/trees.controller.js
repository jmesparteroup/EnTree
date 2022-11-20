class TreesController {
    constructor(TreesRepository, TreeModel, TreeErrorRepository) {
        this.TreesRepository = TreesRepository;
        this.TreeModel = TreeModel;
        this.TreeErrorRepository = TreeErrorRepository;
    };

    async createTree(req, res) {
        try {
            console.log(req.body);
            const treeData = new this.TreeModel(req.body);
            const tree = await this.TreesRepository.createTree(treeData);
            res.status(200).json(tree);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async getAllTrees(req, res) {
        try {
            console.log("Getting all trees.");
            const trees = await this.TreesRepository.getTrees();
            res.status(200).json(trees);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    async getTreeById(req, res) {
        try {
            const tree = await this.TreesRepository.getTree(req.params.id);
            res.status(200).json(tree);
        } catch (error) {
            res.status(500).json(error);
        }
    }



    async updateTree(req, res) {
        try {
            const tree = await this.TreesRepository.updateTree(req.params.id, req.body);
            res.status(200).json(tree);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteTree(req, res) {
        try {
            const tree = await this.TreesRepository.deleteTree(req.params.id);
            res.status(200).json(tree);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getTreeByProximity(req, res) {
        try {
            const trees = await this.TreesRepository.getTreeByProximity(req.params.location, req.params.radius);
            res.status(200).json(trees);
        } catch (error) {
            res.status(500).json(error);
        }
    }


}

module.exports = TreesController;