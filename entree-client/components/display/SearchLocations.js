import { useState } from "react";
import { MagnifyingGlassIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

const DUMMY_LOCATIONS = [
  // generate me 10 locations
  {
    name: "San Juan Capistrano",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Loyola Heights",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Area 2",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Gaging Iloilo",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Brgy. Sup Cuh",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Location 6",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Location 7",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Location 8",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Location 9",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    name: "Location 10",
    center: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
];

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

const dummy_search = async (query) => {
  // check if query is empty
  if (!query) return;

  // filter locations based on query
  const filteredLocations = DUMMY_LOCATIONS.filter((location) => {
    return location.name.toLowerCase().includes(query.toLowerCase());
  });
  return filteredLocations.slice(0, 8);
};

export default function SelectLocations({ className, iconClassName }) {
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
                    key={index}
                    className="flex flex-row h-9 bg-white search-result-shadow hover:bg-gray-200 transition ease-in-out select-none"
                  >
                    <div className="w-full h-full flex items-center pl-4 py-1 text-gray-800">
                      {location.name}
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
        onClick={() => setOpenSearchBar((prev => !prev))}
      > {
        !openSearchBar ? <MagnifyingGlassIcon className="h-8 w-8 text-gray-500"></MagnifyingGlassIcon> : <MinusCircleIcon className="h-8 w-8 text-gray-500"></MinusCircleIcon>
      }
        
      </div>
      
    </>
  );
}
