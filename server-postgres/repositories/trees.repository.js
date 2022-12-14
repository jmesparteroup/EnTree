class TreesRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async _poolQuery(query, params) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query(query, params);
      conn.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async createTree(data) {
    try {
      const conn = await this.pool.connect();
      await conn.query('BEGIN');
      console.log("Starting loop");
      for (let tree of data) {
        console.log("Inserting", tree)
        const result = await conn.query(`CALL create_tree($1, $2, $3, $4, $5)`, [
          tree.treeId,
          tree.description,
          tree.createdAt,
          tree.location,
          tree.userId,
        ]);
      }
      console.log("Ending loop");
      await conn.query('COMMIT');
      conn.release();
      return "success";
    } catch (error) {
      await conn.query('ROLLBACK');
      console.log("Error:", error);
      conn.release();
      throw error;
    }
  }

  async getTrees() {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT get_all_trees()");
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getTree(id) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT get_tree($1)", [id]);
      conn.release();
      return result.rows[0];
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

  async getTreeByProximity(longitude, latitude, radius) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT * FROM get_trees_by_proximity($1, $2, $3)", [longitude, latitude, radius]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getTreeByCity(city) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT * FROM get_trees_by_city($1)", [city]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getCity(city) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("SELECT * FROM get_city($1)", [city]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getTreeByHex(hexLevel) {
    try {
      const conn = await this.pool.connect();
      let query = `SELECT * FROM get_trees_on_hex_${hexLevel}()`;
      console.log("query:", query);
      const result = await conn.query(query);
      conn.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}



module.exports = TreesRepository;
