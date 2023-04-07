import { useState } from "react";
import Container from "../layout/Container";

const BASEMAPTEXT = {
  Streets: "Street View",
  Satellite: "Satellite View",
};

export default function BaseMapSelect({
  BASEMAPS,
  baseMapKey,
  setBaseMapKey,
  className,
}) {
  const [openChangeView, setOpenChangeView] = useState(false);

  const changeViewClickHandler = () => {
    setOpenChangeView((prevState) => !prevState);
  };

  return (
    <>
      <Container
        className={`w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-md opacity-90 bg-white flex items-center text-gray-800 shadow-2xl cursor-pointer ${className}`}
        onClick={changeViewClickHandler}
      >
        <div className="w-full h-full flex justify-center items-center">
          <button className="w-full h-full rounded-md border font-bold">
            {baseMapKey}
          </button>
        </div>
      </Container>
      {openChangeView ? (
        <Container
          className={`w-[160px] h-[75px] md:w-[210px] md:h-[100px] ${className} left-[85px] md:left-[112px] rounded-md absolute flex items-center text-gray-800 bg-transparent shadow-2xl cursor-pointer`}
        >
          {/* Buttons for normal, heatmap, hexagons */}
          <div className="w-full h-full flex justify-center items-center bg-transparent">
            {Object.keys(BASEMAPS).map((key) => (
              <button
                key={key}
                className="w-2/3 h-full rounded-md border bg-white border-gray-400 select-none"
                onClick={() => setBaseMapKey(key)}
              >
                <span className="h-full w-1/2 overflow-wrap select-none">
                  {BASEMAPTEXT[key]}
                </span>
              </button>
            ))}
          </div>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}
