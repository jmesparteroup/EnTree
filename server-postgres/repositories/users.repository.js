class UsersRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async createUser(data) {
    try {
      const conn = await this.pool.connect();
    //   pass in 10 arguments
      const result = await conn.query(`SELECT create_user($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, [
        data.userId,
        data.username,
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.age,
        data.mobileNumber,
        data.role,
        data.createdAt,
        data.updatedAt,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

    async getUsers() {
        try {
            const conn = await this.pool.connect();
            const result = await conn.query(`SELECT get_all_users()`);
            conn.release();
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const conn = await this.pool.connect();
            const result = await conn.query(`SELECT get_user_by_id($1)`, [id]);
            conn.release();
            return result.rows[0]['get_user_by_id'][0];
        } catch (error) {
            throw error;
        }
    }

    async getUserByUsername(username) {
        try {
            const conn = await this.pool.connect();
            const result = await conn.query(`SELECT get_user_by_username($1)`, [username]);
            conn.release();
            return result.rows[0]['get_user_by_username'][0];
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email){
        try {
            const conn = await this.pool.connect();
            const result = await conn.query(`SELECT get_user_by_email($1)`, [email]);
            conn.release();
            return result.rows[0]['get_user_by_email'][0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UsersRepository;