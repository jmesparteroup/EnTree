
const HexagonService = {
    getHexagons: async (zoomlevel) => {
        const res = await fetch(`http://localhost:5000/trees/hex?zoomlevel=${zoomlevel}`, {
            method: "GET",
        });
        return await res.json();
    }
}

export default HexagonService;