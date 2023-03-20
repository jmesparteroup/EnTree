class UsersController {
    constructor(UsersRepository, UserModel, UserErrorRepository) {
        this.UsersRepository = UsersRepository;
        this.UserModel = UserModel;
        this.UserErrorRepository = UserErrorRepository;
    }

    async createUser(req, res) {
        try {
            const user = new this.UserModel(req.body);
            const result = await this.UsersRepository.createUser(await user.getNewUserData());
            const loginDetails = await this.UserModel.loginUser('email', user.email, user.password, this.UsersRepository, this.UserErrorRepository);
            res.status(200).json(loginDetails);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
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
                message: 'User found',
                data: user
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async updateUser(req, res) {
        try {
            // validate request body
            const data = await this.UsersRepository.updateUser(req.params.id, req.body);
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
            const { email, password } = req.body;
            const data = await this.UserModel.loginUser('email', email, password, this.UsersRepository, this.UserErrorRepository);
            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(error.code || 500).json(
                error
            );
        }
    }

}

module.exports = UsersController;