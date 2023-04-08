import { useState } from "react";
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

const debounce = (fn, ms) => {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
    }, ms);
    if (!timer) {
      fn.apply(this, arguments);
    }
  };
};

export default function SelectLocations({
  className,
  iconClassName,
  locationList,
  TreeService,
  useSearchStore,
}) {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const setSelectedLocation = useSearchStore((state) => state.setSelectedLocation);
  const setData = useSearchStore((state) => state.setData);

  const dummy_search = async (query) => {
    // check if query is empty
    if (!query) return;

    // filter locations based on query
    const filteredLocations = locationList.filter((location) => {
      return location.toLowerCase().includes(query.toLowerCase());
    });
    return filteredLocations.slice(0, 8);
  };

  const searchLocations = async (e) => {
    // implement debounce time of 500ms
    const query = e.target.value;
    // if query is empty return
    if (!query) return;

    try {
      // search locations
      const locations = await dummy_search(query);
      setSearchResults(locations);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectLocation = async (location) => {
    // get trees in location
    try {
      const barangayData = await TreeService.getBarangayByName(location);
      setData(barangayData);
      setSelectedLocation(location);
      setSearchResults([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {openSearchBar && (
        <div className={`${className} min-w-[300px] max-w-[500px] w-2/5`}>
          <div className="flex flex-row items-center justify-between w-full h-10 rounded-full border overflow-hidden border-gray-300 focus:outline-none">
            <input
              type="text"
              placeholder="Search Locations"
              className="w-full h-10 px-4 focus:outline-none"
              autoComplete="off"
              onChange={searchLocations}
            />
            <div className="w-10 h-10 bg-[var(--primary-bg-color)] py-2 flex justify-center align-center">
              <MagnifyingGlassIcon className="h-6 w-6 flex justify-center align-center text-gray-500" />
            </div>
          </div>
          {searchResults.length > 0 && (
            <div className="flex flex-col h-fit w-4/5 mt-1 ml-2 rounded-md overflow-hidden">
              {searchResults.map((location, index) => {
                return (
                  <div
                    onClick={() => handleSelectLocation(location)}
                    key={index}
                    className="flex flex-row h-9 bg-white search-result-shadow hover:bg-gray-200 transition ease-in-out select-none"
                  >
                    <div className="w-full h-full flex items-center pl-4 py-1 text-gray-800">
                      {location}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div
        className={`rounded-full bg-[var(--primary-bg-color)] h-12 w-12 text-center flex justify-center items-center ${iconClassName} border-2 border-gray-400 cursor-pointer`}
        onClick={() => setOpenSearchBar((prev) => !prev)}
      >
        {" "}
        {!openSearchBar ? (
          <MagnifyingGlassIcon className="h-8 w-8 text-gray-500"></MagnifyingGlassIcon>
        ) : (
          <MinusCircleIcon className="h-8 w-8 text-gray-500"></MinusCircleIcon>
        )}
      </div>
    </>
  );
}
