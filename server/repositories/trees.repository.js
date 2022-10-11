class TreesRepository {
  constructor(TreeDB) {
    this.TreeDB = TreeDB;
  }

  async createTree(data) {
    try {
      const tree = new this.TreeDB(data);
      return await tree.save();
    } catch (error) {
      throw error;
    }
  }

    async getTrees() {
        try {
            return await this.TreeDB.find();
        } catch (error) {
            throw error;
        }
    }

    async getTree(id) {
        try {
            return await this.TreeDB.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async updateTree(id, data) {
        try {
            return await this.TreeDB.findByIdAndUpdate(id, data);
        } catch (error) {
            throw error;
        }
    }

    async deleteTree(id) {
        try {
            return await this.TreeDB.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async getTreeByProximity(location, radius) {
        try {
            return await this.TreeDB.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: location,
                        },
                        $maxDistance: radius,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }


  
}

module.exports = TreesRepository;
