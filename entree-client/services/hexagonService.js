const HexagonService = {
  getHexagons: async (zoomlevel, lat, long) => {
    try {
      const res = await fetch(
        `http://localhost:4999/trees/hex?zoomlevel=${zoomlevel}&lat=${lat}&long=${long}`,
        {
          method: "GET",
        }
      );

      const data = await res.json();
      //   if data is an array, return it
      //  if not, return an empty array

      return Array.isArray(data) ? data : [];
      
    } catch (err) {
      console.log(err);
      return [];
    }
  },
};

export default HexagonService;
