const nanoid = require('nanoid');
class TreesController {
    constructor(TreesRepository, TreeModel, TreeErrorRepository) {
        this.TreesRepository = TreesRepository;
        this.TreeModel = TreeModel;
        this.TreeErrorRepository = TreeErrorRepository;
    };

    async createTree(req, res) {
        try {            
            if (!req.user.userId) {
                throw Error("Invalid user");
            }
            let newTrees = req.body.map(tree => {
                if (!tree.location) throw Error("Empty location data");
                let newTree = new this.TreeModel(tree);
                newTree.userId = req.user.userId;
                return newTree;
            })
            await this.TreesRepository.createTree(newTrees);
            res.status(201).json(req.body);
        } catch (error) {
            console.log(error);
            res.status(400).json({error: error.message});
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
            res.status(200).json(req.body);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async deleteTree(req, res) {
        try {
            // access currently logged in user
            const user = req.user;
            
            // query for tree
            console.log("QUERYING FOR TREE:", req.params.id)
            const tree = await this.TreesRepository.getTree(req.params.id);
            
            if (!tree) {
                throw this.TreeErrorRepository.TreeNotFoundError();
            }

            console.log("TREE USER ID:", tree.userId)
            console.log("USER USER ID:", user.userId)
            if (tree.userId !== user.userId) {
                throw this.TreeErrorRepository.Unauthorized("You are not authorized to delete this tree");
            }

            await this.TreesRepository.deleteTree(req.params.id);
            // await this.TreesRepository.deleteAllFlagsOfTree(req.params.id);
            res.status(200).json({DELETE: "Tree deleted successfully"});
        } catch (error) {

            res.status(error.code || 500).json({error: error.message || "Something went wrong"});
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
            const {lat, long} = req.query;
            const latitude = parseFloat(lat);
            const longitude = parseFloat(long);
            if (!zoomLevel) {
                throw new Error("Undefined Latitude or Longitude");
            }
            // console.log("Checking lat long", lat);
            // if (lat) {console.log("NULL", lat)};
            // else {console.log("Not null", lat)};
            if ((lat == null) || (long == null)) {
                console.log("Undefined latitude or longitude")
                throw new Error("Undefined latitude or longitude");
            }
            let result;
            if (zoomLevel >= 17) {
                result = await this.TreesRepository.getTreeByHex(100, latitude, longitude);
            } else if (zoomLevel == 16) {
                result = await this.TreesRepository.getTreeByHex(150, latitude, longitude);
            } else if (zoomLevel == 15) {
                result = await this.TreesRepository.getTreeByHex(300, latitude, longitude);
            } else if (zoomLevel == 14) {
                result = await this.TreesRepository.getTreeByHex(500, latitude, longitude);
            } else if (zoomLevel == 13) {
                result = await this.TreesRepository.getTreeByHex(500, latitude, longitude);
            } else {
                result = await this.TreesRepository.getTreeByHex(500, latitude, longitude);
            }
            let return_processed = [];
            for (let row of result) {
                // Comment/uncomment to disable/enable zero-tree hexagons
                if (row.treecount == 0) {
                    continue;
                }

                let cities = row.cities.replace(/,*$/, '')
                let hexagon_processed = [];
                const hexagons_raw = row.geom.slice(9,-2);
                const hexagons_array = hexagons_raw.split(',');
                for (let coord of hexagons_array){
                    const x = parseFloat(coord.split(' ')[0]);
                    const y = parseFloat(coord.split(' ')[1]);
                    hexagon_processed.push([x,y])
                }
                return_processed.push({
                    hexId: row.hexid,
                    hexagon: hexagon_processed,
                    count: parseInt(row.treecount),
                    cities: cities.split(',')
                })
            }
            res.status(200).json(return_processed);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async flagTree(req, res) {
        try {
            if (!req.user.userId) throw Error("Invalid user");
            if (!req.params.id) throw Error("Empty tree parameter");
            if (req.query.unflag == 'true') {
                console.log(`User {req.user.userId} UNflagging ${req.params.id}`);
                await this.TreesRepository.unFlagTree(req.params.id, req.user.userId);
                res.status(202).json({userId: req.user.userId, treeId: req.params.id});
                return;
            }            
            console.log(`User ${req.user.userId} flagging ${req.params.id}`);
            await this.TreesRepository.flagTree(nanoid(16), req.params.id, req.user.userId);
            res.status(201).json({userId: req.user.userId, treeId: req.params.id});
        } catch(err) {
            res.status(500).json(err);
        }
    }

    async getTreeByUser(req, res) {
        try {
            if (!req.user.userId) throw Error("Invalid user");
            console.log(req.user.userId);
            console.log(`Querying all trees posted by user {req.user.userId}`);
            let result = await this.TreesRepository.getTreeByUser(req.user.userId);
            // Uncomment to directly return result if user needs all the metadata
            let coordinates = result.map(function(x) {
                    return x.st_astext
                }).map(function(x){
                    let points = x.slice(6, -1);
                    return points.split(" ").map(function(point) {
                        return parseFloat(point)
                    });
                }).map(function (x) {
                    return [x[1], x[0]]
                })
            res.status(200).json({userId: req.user.userId, trees: coordinates});
            // Otherwise, clean the data to get an array of coordinates only
        } catch (err) {
            res.status(500).json(err);
        }
    }


    async getBarangay(req, res) {
        try {
            const barangay = req.query.brgy;
            if (!barangay) {
                res.status(400).json({error:"City not found"}); 
                return;
            }
            console.log("Getting brgy data")
            const brgy_data = await this.TreesRepository.getBarangay(barangay);
            const centroid = brgy_data[0].centroid;
            let processed_polygon_array = [];
            for (let p of brgy_data) {
                let polygons = p.polygon.slice(16,-3).split(")),((");
                for (let polygon_raw of polygons) {
                    const point_array = polygon_raw.split(',');
                    let processed_polygon = [];
                    for (let coord of point_array) {
                        const x = parseFloat(coord.split(' ')[0]);
                        const y = parseFloat(coord.split(' ')[1]);
                        processed_polygon.push([x,y])
                    }
                    processed_polygon_array.push(processed_polygon);
                }
            }
            const centroid_x = parseFloat(centroid.split(' ')[0]);
            const centroid_y = parseFloat(centroid.split(' ')[1]);
            // let processed_polygon_array = [];
            // for (let p of city_data) {
            //     let polygon = p.polygon;
            //     const polygon_raw = polygon.slice(9,-2);
            //     const point_array = polygon_raw.split(',');
            //     let processed_polygon = [];
            //     for (let coord of point_array) {
            //         const x = parseFloat(coord.split(' ')[0]);
            //         const y = parseFloat(coord.split(' ')[1]);
            //         processed_polygon.push([x,y])
            //     }
            //     processed_polygon_array.push(processed_polygon)
            // }
            // let result = {
            //     city: city_data.cityName,
            //     polygons: processed_polygon_array,
            //     trees: parseInt(trees.c)
            // };
            console.log("Got brgy data")
            res.status(200).json({
                barangayName: barangay,
                polygons: processed_polygon_array,
                centroid: [centroid_x, centroid_y]
            });
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }
    }

}

module.exports = TreesController;