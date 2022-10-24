const { connect } = require("../app");

class TreesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  // Use pg pool query

  // -- TABLE FOR TREES
  // CREATE TABLE IF NOT EXISTS "trees" (
  //     "treeId" SERIAL PRIMARY KEY,
  //     "name" VARCHAR(255) NOT NULL,
  //     "description" VARCHAR(255) NOT NULL,
  //     "createdAt" INT NOT NULL,
  //     --   LOCATION POSTGIS POINT
  //     "location" POINT,
  //     "userId" VARCHAR(32) NOT NULL
  // );
  async createTree(data) {
    try {
      const conn = await this.pool.connect();
      const query = `INSERT INTO trees (name, description, "createdAt", location, "userId") VALUES ($1, $2, $3, ST_GeomFromGeoJSON($4), $5) RETURNING *`;
      const values = [
        data.name,
        data.description,
      ];
      const result = await conn.query(query, values);
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
