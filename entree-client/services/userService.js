const userService = {
    getUserById: async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    loginUser: async (user) => {
        try {
            const response = await fetch('http://localhost:5000/users/login', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    registerUser: async (user) => {
        const response = await fetch(`http://localhost:5000/users/`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        return await response.json();
    }
};

export default userService;