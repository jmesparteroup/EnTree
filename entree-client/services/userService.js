const userService = {
    getUserById: async (id) => {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw errorData.message;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    loginUser: async (user) => {
        try {
            const response = await fetch(`${process.env.SERVER_URL}/users/login`, {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },

    registerUser: async (user) => {
        const response = await fetch(`${process.env.SERVER_URL}/users/`, {
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