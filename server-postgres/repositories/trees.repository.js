class TreesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createTree(data) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query(`CALL create_tree($1, $2, $3, $4, $5)`, [
        data.name,
        data.description,
        data.createdAt,
        data.location,
        data.userId,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getTrees() {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT * FROM trees");
      conn.release();
      return result.rows;
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
