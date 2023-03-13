import { Cog6ToothIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import useMapOptionsStore from "../../stores/mapOptionsStore";
import useOpenMapOptionsStore from "../../stores/openMapOptionsStore";
import Container from "../layout/Container";


import MAP_CONFIG from "../../constants/map";

const MAP_SELECTIONS = [
  { name: "Show Number of Trees", value: "showLabels" },
  { name: "Show All Cities", value: "showAll" },
  { name: "Show Select Cities", value: "showSelect" },
];

export default function MapOptions({ className }) {
  const openMapOptions = useOpenMapOptionsStore(
    (state) => state.openMapOptions
  );
  const setOpenMapOptions = useOpenMapOptionsStore(
    (state) => state.setOpenMapOptions
  );

  const showLabels = useMapOptionsStore((state) => state.showLabels);
  const setShowLabels = useMapOptionsStore((state) => state.setShowLabels);

  const mapOptions = useMapOptionsStore((state) => state.mapOptions);
  const setMapOptions = useMapOptionsStore((state) => state.setMapOptions);
  const selectCities = useMapOptionsStore((state) => state.selectCities);
  const addSelectCity = useMapOptionsStore((state) => state.addSelectCity);
  const removeSelectCity = useMapOptionsStore((state) => state.removeSelectCity);

  // checkbox handler
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    if (name === "showAll") {
      setMapOptions({
        showAll: checked,
        showSelect: !checked,
      });
    } else if (name === "showSelect") {
      setMapOptions({
        showAll: !checked,
        showSelect: checked,
      });
    } else if (name === "showLabels") {
      setShowLabels(checked);
    }
    // log mapOptions
    console.log(mapOptions);
  };
  const handleCheckCity = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      addSelectCity(name);
    } else {
      removeSelectCity(name);
    }
    // log selectCities
    console.log(selectCities);
  };

  return (
    <>
      <Container
        className={`w-[65px] h-[65px] rounded-full flex items-center bg-lime-300 text-gray-800 shadow-2xl cursor-pointer border-0 ${className}`}
        onClick={setOpenMapOptions}
      >
        <div className="w-full h-full flex justify-center items-center shadow-none">
          <button className="w-full h-full rounded-md flex justify-center items-center shadow-none">
            {!openMapOptions ? (
              <Cog6ToothIcon className="w-8 h-8" />
            ) : (
              <MinusCircleIcon className="w-8 h-8" />
            )}
          </button>
        </div>
      </Container>
      {openMapOptions ? (
        <Container
          className={`w-[258px] h-[25vh] absolute right-2 bottom-[25%] rounded-lg bg-white opacity-90 flex flex-col p-4 items-center text-gray-800 shadow-2xl`}
        >
          {/* scrollable div that shows clicked items */}
          <div className="text-lg border-b-[1px] w-full mx-4 text-center font-bold">
            Map Options
          </div>
          {/* choices */}
          <div className="w-full h-full flex-col items-center bg-transparent rounded-lg overflow-x-hidden scroll-smooth">
            {/* Map through Map Options and display a checkbox that corresponds to them */}
            {MAP_SELECTIONS.map((option, index) => (
              <div
                className="flex h-8 w-full"
                key={`${index}${option.name}${option.value}`}
              >
                {/* index */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  {index + 1}
                </div>
                <div className="w-9/12 h-full flex justify-center items-center">
                  {option.name}
                </div>
                {/* check box */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 hover:scale-125 cursor-pointer transition duration-150"
                    name={option.value}
                    checked={option.value === "showLabels" ? showLabels : mapOptions[option.value]}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            ))}
            {/* Map through MAP_CONFIG.DEFAULT_CITIES AND DISPLAY THEM WITH A CHECKBOX */}
            {mapOptions.showSelect && MAP_CONFIG.DEFAULT_CITIES.map((city, index) => (
              <div
                className="flex h-8 w-full"
                key={`${index}${city.name}${city.value}`}
              >
                {/* index */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  
                </div>
                <div className="w-9/12 h-full flex justify-center items-center">
                  {city}
                </div>
                {/* check box */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 hover:scale-125 cursor-pointer transition duration-150"
                    name={city}
                    onChange={handleCheckCity}
                  />
                </div>
              </div>
            ))}
            
          </div>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}
