
const TreeService = {
    getAllTrees: async () => {
        return await fetch(`localhost:5000/trees/`)
    }
};

export default TreeService;