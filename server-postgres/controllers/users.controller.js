class UsersController {
  constructor(UsersRepository, UserModel, UserErrorRepository) {
    this.UsersRepository = UsersRepository;
    this.UserModel = UserModel;
    this.UserErrorRepository = UserErrorRepository;
  }

  async createUser(req, res) {
    try {
      const user = new this.UserModel(req.body);
      const result = await this.UsersRepository.createUser(
        await user.getNewUserData()
      );
      const loginDetails = await this.UserModel.loginUser(
        "email",
        user.email,
        user.password,
        this.UsersRepository,
        this.UserErrorRepository
      );
      res.status(200).json(loginDetails);
    } catch (error) {
      // handle SQL error
      let errorResponse;

      console.log(`Error: ${error.code} ${error.column} ${error.table}`)

    
      if (error.table) {

        switch (error.code) {
          case "23505":
            if (error.constraint === "users_email_key") {
              errorResponse = this.UserErrorRepository.EmailAlreadyExists();
            }
            if (error.constraint === "users_username_key") {
              errorResponse = this.UserErrorRepository.UserAlreadyExists();
            }
            break;
          default:
            errorResponse = this.UserErrorRepository.SQLQueryError();
        }
      } else {
        errorResponse = this.UserErrorRepository.SQLQueryError();
      }

      console.log(errorResponse);
      res.status(500).json(errorResponse);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.UsersRepository.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.UsersRepository.getUserById(req.params.id);

      res.status(200).json({
        message: "User found",
        data: user,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async updateUser(req, res) {
    try {
      // validate request body
      const data = await this.UsersRepository.updateUser(
        req.params.id,
        req.body
      );
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await this.UsersRepository.deleteUser(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async loginUser(req, res) {
    try {
      const { identifier, password, type } = req.body;
      const data = await this.UserModel.loginUser(
        type,
        identifier,
        password,
        this.UsersRepository,
        this.UserErrorRepository
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(error.code || 500).json(error);
    }
  }
}

module.exports = UsersController;
