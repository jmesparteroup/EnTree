const HexagonService = {
  getHexagons: async (zoomlevel, lat, long) => {
    try {
      const res = await fetch(
        `http://localhost:5000/trees/hex?zoomlevel=${zoomlevel}&lat=${lat}&long=${long}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        throw new Error("Could not fetch hexagons");
      }

      const data = await res.json();

      if (!data || !Array.isArray(data)) {
        throw new Error("Could not fetch hexagons");
      }

      return data;
      
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

export default HexagonService;
