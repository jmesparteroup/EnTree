class TreesController {
    constructor(TreesRepository, TreeModel, TreeErrorRepository) {
        this.TreesRepository = TreesRepository;
        this.TreeModel = TreeModel;
        this.TreeErrorRepository = TreeErrorRepository;
    };

    async createTree(req, res) {
        try {
            
            let trees = req.body.map(tree => {
                return new this.TreeModel(tree);
            });

            console.log(trees);

            const result = await this.TreesRepository.createTree(trees);
            // const result = {error:"none"};
            console.log("End Repo Call: ", result);
            res.status(200).json(result);
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
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async getTreeByCity(req, res) {
        try {
            console.log("getTreeByCity", req.query.city)
            const city = req.query.city;
            if (!city) {
                res.status(400).json({error:"City not found"}); 
                return;
            }
            const trees = await this.TreesRepository.getTreeByCity(city);
            const city_data = await this.TreesRepository.getCity(city);
            let processed_polygon_array = [];
            for (let p of city_data) {
                let polygon = p.polygon;
                console.log(p);
                const polygon_raw = polygon.slice(9,-2);
                const point_array = polygon_raw.split(',');
                let processed_polygon = [];
                for (let coord of point_array) {
                    const x = parseFloat(coord.split(' ')[0]);
                    const y = parseFloat(coord.split(' ')[1]);
                    processed_polygon.push([x,y])
                }
                processed_polygon_array.push(processed_polygon)
            }
            let result = {
                city: city_data.cityName,
                polygons: processed_polygon_array,
                trees: parseInt(trees.c)
            };
            res.status(200).json(result);
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

    async getTreeByHex(req, res) {
        try {
            const zoomLevel = req.query.zoomlevel;
            if (!zoomLevel) {
                res.status(404).json({error:"City not found"}); 
                return;
            }
            let result;
            if (zoomLevel >= 17) {
                result = await this.TreesRepository.getTreeByHex(50);
            } else if (zoomLevel == 16) {
                result = await this.TreesRepository.getTreeByHex(150);
            } else if (zoomLevel == 15) {
                result = await this.TreesRepository.getTreeByHex(300);
            } else if (zoomLevel == 14) {
                result = await this.TreesRepository.getTreeByHex(500);
            } else if (zoomLevel == 13) {
                result = await this.TreesRepository.getTreeByHex(500);
            } else {
                result = await this.TreesRepository.getTreeByHex(600);
            }
            let return_processed = [];
            for (let row of result) {
                let hexagon_processed = [];
                const hexagons_raw = row.geom.slice(9,-2);
                const hexagons_array = hexagons_raw.split(',');
                for (let coord of hexagons_array){
                    const x = parseFloat(coord.split(' ')[0]);
                    const y = parseFloat(coord.split(' ')[1]);
                    hexagon_processed.push([x,y])
                }
                return_processed.push({
                    hexagon: hexagon_processed,
                    count: parseInt(row.c)
                })
            }
            res.status(200).json(return_processed);
        } catch (error) {
            res.status(500).json(error);
        }
    }


}

module.exports = TreesController;