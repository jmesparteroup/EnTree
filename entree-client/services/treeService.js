const TreeService = {
  getAllTrees: async () => {
    const res =  await fetch(`http://localhost:5000/trees/`, {
      method: "GET",
    });
    return await res.json();
  },
  addTree: async (tree) => {
    return await fetch(`http://localhost:5000/trees/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tree),
    });
  },
  getTreesByCity: async (city) => {
    try {
      const res = await fetch(`http://localhost:5000/trees/bycity?city=${city}`, {
        method: "GET",
      });
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  },
  getTreesAllCities: async () => {
    return await fetch(`http://localhost:5000/trees/cities`, {
      method: "GET",
    });
  },
};

export default TreeService;
