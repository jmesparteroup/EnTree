class TreesController {
    constructor(TreesRepository, TreeModel, TreeErrorRepository) {
        this.TreesRepository = TreesRepository;
        this.TreeModel = TreeModel;
        this.TreeErrorRepository = TreeErrorRepository;
    };

    async createTree(req, res) {
        try {
            const treeData = new this.TreeModel(req.body);
            const tree = await this.TreesRepository.createTree(treeData);
            res.status(200).json(tree);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getAllTrees(req, res) {
        try {
            const trees = await this.TreesRepository.getTrees();
            const result = trees.get_all_trees;
            res.status(200).json(result);
        } catch (error) {
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
            const trees = await this.TreesRepository.getTreeByProximity(+req.query.long, +req.query.lat, +req.query.radius);
            const result = trees.j;
            console.log("Returning", result.length, "results.");
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getTreeByCity(req, res) {
        try {
            const city = req.query.city;
            if (!city) {
                res.status(400).json({error:"City not found"}); 
            }
            const trees = await this.TreesRepository.getTreeByCity(city);
            const city_data = await this.TreesRepository.getCity(city);
            const city_polygon_raw = city_data.polygon.slice(9,-2);
            const point_array = city_polygon_raw.split(',');
            let polygon_processed = []
            for (let coord of point_array) {
                const x = parseFloat(coord.split(' ')[0]);
                const y = parseFloat(coord.split(' ')[1]);
                polygon_processed.push([x,y])
            }
            let result = {
                city: city_data.cityName,
                polygon: polygon_processed,
                trees: trees.j
            };
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }


}

module.exports = TreesController;