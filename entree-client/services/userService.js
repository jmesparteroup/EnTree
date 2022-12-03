
const userService = {
    getUser: async (id) => {
        return await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    },
    loginUser: async (username, password) => {
        return await fetch(`https://jsonplaceholder.typicode.com/users?username=${username}&password=${password}`)
    },
    registerUser: async (user) => {
        return await fetch(`https://jsonplaceholder.typicode.com/users`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
    }
};

export default userService;