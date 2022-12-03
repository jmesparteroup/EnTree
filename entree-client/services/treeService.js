
const TreeService = {
    getAllTrees: async () => {
        return await fetch(`http://localhost:5000/trees/`, {
            method: "GET",
        })
    }
};

export default TreeService;