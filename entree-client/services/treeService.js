import cookieService from "./cookieService";

const TreeService = {
  getAllTrees: async () => {
    const res =  await fetch(`http://localhost:5000/trees/`, {
      method: "GET",
    });
    return await res.json();
  },
  addTrees: async (tree) => {
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
  getTreesByProximity: async (lat, lng, radius) => {
    const data =  await fetch(
      `http://localhost:5000/trees/proximity?lat=${lat}&long=${lng}&radius=${radius}`,
      {
        method: "GET",
      }
    );
    return await data.json();
  },
  deleteTree: async (id) => {
    return await fetch(`http://localhost:5000/trees/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${cookieService.getUserCookie()}`
      }
    });
  },
  flagTree: async (id) => {
    return await fetch(`http://localhost:5000/trees/flag/${id}`, {
      method: "PUT",
    });
  }

};

export default TreeService;
