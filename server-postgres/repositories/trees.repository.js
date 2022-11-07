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
      const result = await conn.query(`CALL create_tree($1, $2, $3, $4)`, [
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
      const result = await conn.query("SELECT * from trees");
      conn.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async getTree(id) {
    try {
      const conn = await this.pool.connect();
      const result = await conn.query("CALL get_tree($1)", [id]);
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

  async getTreeByProximity(location, radius) {
    try {
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TreesRepository;
