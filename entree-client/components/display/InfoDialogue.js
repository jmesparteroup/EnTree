import {
  InformationCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";

const appInfo = {
  title: "Entree",
  description:
    "A web-service that visualizes urban vegetation in the National Capital Region of the Philippines",
  version: "0.1.0",
  guides: {
    title: "How to use the map",
    description:
      "The map is a tool that allows you to visualize the urban vegetation in the National Capital Region of the Philippines. You can use the map to explore the vegetation in the region and to find out more about the vegetation in a specific area.",
    steps: {
      Zooming: {
        title: "Zooming in and out",
        description:
          "You can zoom in and out of the map by using the zoom buttons on the top left of the map. You can also zoom in and out by using the scroll wheel on your mouse.",
      },
      Panning: {
        title: "Moving around the map",
        description:
          "You can move around the map by clicking and dragging the map. You can also move around the map by using the arrow keys on your keyboard.",
      },
      "Base Maps": {
        title: "Changing the base map",
        description:
          "You can change the map type by clicking on the map type button on the top left of the map. You can choose between a satellite map and a street map.",
      },
      "Adding Trees": {
        title: "Adding Trees",
        description:
          "You first need to login to the application. Once you are, an add tree button with the plus symbol will appear on the bottom left of the map.\n With this opened, you will now be able to click on the map to add trees.",
      },
      Visualization: {
        title: "Visualization",
        description:
          "Visualization of the urban vegetation depends on the zoom level of the current map. The more you zoom in, the more detailed the visualization will be. It will start with City level visualization and will go down to tree or street level visualization.",
      },
    },
  },
};

import useAppInfoStore from "../../stores/appInfoStore";

export default function InfoDialogue({ className }) {
  const openAppInfo = useAppInfoStore((state) => state.openAppInfo);
  const setOpenAppInfo = useAppInfoStore((state) => state.setOpenAppInfo);
  const selectedStep = useAppInfoStore((state) => state.selectedStep);
  const setSelectedStep = useAppInfoStore((state) => state.setSelectedStep);
  return (
    <>
      {!openAppInfo ? (
        <div
          className={`rounded-full bg-[var(--primary-bg-color)] h-12 w-12 text-center flex justify-center items-center ${className} border-2 border-gray-400 cursor-pointer`}
          onClick={() => setOpenAppInfo()}
        >
          <InformationCircleIcon className="h-10 w-10 text-gray-500"></InformationCircleIcon>
        </div>
      ) : (
        <>
          {/* Info Dialogue */}
          <div
            className={`bg-[var(--primary-bg-color)] opacity-90 rounded-lg h-[70vh] w-[80vw] text-center flex flex-col justify-start items-center absolute top-[15%] left-[10%] border-1 border-gray-400 cursor-pointer`}
          >
            {/* minimize button */}
            <div
              onClick={() => setOpenAppInfo()}
              className="rounded-full  h-7 w-7 text-center flex justify-center items-center absolute top-0 right-0 m-1 border-0 cursor-pointer"
            >
              <MinusCircleIcon className="h-10 w-10 text"></MinusCircleIcon>
            </div>
            {/* Title */}
            <div
              id="title"
              className="h-12 flex justify-center items-center my-3 w-4/5 border-b"
            >
              <div className="text-2xl font-bold">{appInfo.guides.title}</div>
            </div>
            {/* items for info sheet*/}
            {/* Display a grid of buttons for the different keys of appInfo.guides.steps */}
            <div className="grid md:grid-cols-4 sm: grid-cols-3 gap-3 w-4/5">
              {Object.keys(appInfo.guides.steps).map((key) => (
                <div
                  key={key}
                  className={`${
                    selectedStep === key ? "border-2" : ""
                  } hover:scale-105 shadow-hover transition ease-in-out rounded-md bg-[var(--primary-bg-color)] py-2 opacity-90 text-center flex justify-center items-center border-gray-400 cursor-pointer`}
                  onClick={() => setSelectedStep(key)}
                >
                  <div className="md:text-lg text-md font-bold">{key}</div>
                </div>
              ))}
            </div>
            {/* Display the selected step */}
            <div className="my-3 h-1/2 w-4/5 flex flex-col justify-start items-center border-t py-3">
              <div className="text-2xl font-bold">
                {appInfo.guides?.steps[selectedStep]?.title}
              </div>
              <div className="text-md font-semibold mt-3">
                {appInfo.guides?.steps[selectedStep]?.description}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
