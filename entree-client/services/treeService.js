import cookieService from "./cookieService";


const generateAuthHeader = () => {
  const token = cookieService.getUserCookie();
  if (token) {
    return `Bearer ${token}`;
  } else {
    return ``;
  }
};


const TreeService = {
  getAllTrees: async () => {
    const res =  await fetch(`${process.env.SERVER_URL}/trees/`, {
      method: "GET",
    });
    return await res.json();
  },
  addTrees: async (trees) => {
    return await fetch(`${process.env.SERVER_URL}/trees/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': generateAuthHeader(),
      },
      body: JSON.stringify(trees)
    });
  },
  getTreesByCity: async (city) => {
    try {
      const res = await fetch(`${process.env.SERVER_URL}/trees/bycity?city=${city}`, {
        method: "GET",
      });
      return await res.json();
    } catch (err) {
      console.log(err);
    }
  },
  getTreesAllCities: async () => {
    return await fetch(`${process.env.SERVER_URL}/trees/cities`, {
      method: "GET",
    });
  },
  getTreesByProximity: async (lat, lng, radius) => {
    const data =  await fetch(
      `${process.env.SERVER_URL}/trees/proximity?lat=${lat}&long=${lng}&radius=${radius}`,
      {
        method: "GET",
      }
    );
    return await data.json();
  },
  deleteTree: async (id) => {
    return await fetch(`${process.env.SERVER_URL}/trees/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': generateAuthHeader(),
      }
    });
  },
  flagTree: async (id) => {
    return await fetch(`${process.env.SERVER_URL}/trees/flag/${id}`, {
      method: "PATCH",
      headers: {
        'Authorization': generateAuthHeader(),
      }
    });
  },
  getTreesByUser: async () => {
    const res = await fetch(`${process.env.SERVER_URL}/trees/user`, {
      method: "GET",
      headers: {
        'Authorization': generateAuthHeader(),
      }
    });
    return await res.json();
  }


};

export default TreeService;
