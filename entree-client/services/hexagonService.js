
const HexagonService = {
    getHexagons: async (zoomlevel, lat, long) => {
        const res = await fetch(`http://localhost:5000/trees/hex?zoomlevel=${zoomlevel}&lat=${lat}&long=${long}`, {
            method: "GET",
        });
        return await res.json();
    }
}

export default HexagonService;