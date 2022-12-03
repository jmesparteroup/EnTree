    const TreeService = {
    getAllTrees: async () => {
        return await fetch(`http://localhost:5000/trees/`, {
            method: "GET",
        })
    },
    addTree: async (tree) => {
        return await fetch(`http://localhost:5000/trees/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tree),
        })
    },
    getTreesByCity: async (data) => {
        return await fetch(`http://localhost:5000/trees/bycity `, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
    },
    getTreesAllCities: async () => {
        return await fetch(`http://localhost:5000/trees/cities`, {
            method: "GET",
        })
    }
};

export default TreeService;