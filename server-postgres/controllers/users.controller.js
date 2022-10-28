class UsersController {
    constructor(UsersRepository, UserModel, UserErrorRepository) {
        this.UsersRepository = UsersRepository;
        this.UserModel = UserModel;
        this.UserErrorRepository = UserErrorRepository;
    }

    async createUser(req, res) {
        try {
            
            const user = new this.UserModel(req.body);
            const result = await this.UsersRepository.createUser(user.getNewUserData());
            res.status(200).json(user);
        } catch (error) {
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
            const user = await this.UsersRepository.getUser(req.params.id);
            res.status(200).json(user);
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



}