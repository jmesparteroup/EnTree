import { useState } from "react";
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

function debounce(callback, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback.apply(this, args);
    }, delay);
  };
}

const levenshteinDistance = (str1 = "", str2 = "") => {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return track[str2.length][str1.length];
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
  const setSelectedLocation = useSearchStore(
    (state) => state.setSelectedLocation
  );
  const setData = useSearchStore((state) => state.setData);

  const dummy_search = async (query) => {
    // check if query is empty
    if (!query) return;

    const sortedBasedOnLevenshteinDistance = locationList.sort((a, b) => {
      if (a === b) return 0;

      const levenshteinWeight = 0.3;
      const isInWordWeight = 0.7;

      const aIsInWordScore = a.toLowerCase().includes(query.toLowerCase())
        ? -3
        : 3;
      const bIsInWordScore = b.toLowerCase().includes(query.toLowerCase())
        ? -3
        : 3;

      const aDistance = levenshteinDistance(a, query);
      const bDistance = levenshteinDistance(b, query);

      const aScore =
        aDistance * levenshteinWeight + aIsInWordScore * isInWordWeight;
      const bScore =
        bDistance * levenshteinWeight + bIsInWordScore * isInWordWeight;

      return aScore - bScore;
    });

    // return top 5 results
    return sortedBasedOnLevenshteinDistance.slice(0, 5);
  };



  const searchLocations = async (e) => {
    // implement debounce time of 500ms
    const query = e.target.value;
    console.log(query)
    // if query is empty return
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      // search locations
      const locations = await dummy_search(query);
      setSearchResults(locations);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = debounce(searchLocations, 200);

  const handleOnEnter = (e) => {
    if (e.key === "Enter") {
      handleSelectLocation(searchResults[0]);
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
              placeholder="Search Barangays"
              className="w-full h-10 px-4 focus:outline-none"
              autoComplete="off"
              onKeyDown={handleOnEnter}
              onChange={debouncedSearch}
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
