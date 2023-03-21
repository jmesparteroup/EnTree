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
    title: "EnTree Guide",
    description:
      "The map is a tool that allows you to visualize the urban vegetation in the National Capital Region of the Philippines. You can use the map to explore the vegetation in the region and to find out more about the vegetation in a specific area.",
    steps: {
      EnTree: {
        title: "What is EnTree?",
        description:
          "EnTree is a web application that aims to let users visualize trees in the National Capital Region, and also allows users to contribute to the dataset by providing their own points. The goal of this application is to eventually be able to make a comprehensive set of data about the trees in the National Capital Region, with the help of Philippine citizens, which in turn could help with forming government policies and planning.",
      },
      Features: {
        title: "Basic usage",
        description:
          "Move around the map by clicking and dragging the map. The map can also be moved around by using the keyboard. EnTree shows the location and number of trees using diffent techniques. When zooming out to the city level, the number of datapoints inside the city is shown. Zooming in a little bit further shows the number of trees by tiling the areas as hexagons. Zooming in on a specific area shows the exact location of trees reported in that area.",
      },
      "Base Maps": {
        title: "Base maps",
        description:
          "Change the map type by clicking on the button on the upper left corner of the map. Choose between a street map and a satellite map.",
      },
      "Add Trees": {
        title: "Adding Trees",
        description:
          "User needs to be logged in to use this feature. Click the '+' symbol that appears on the bottom left of the map once logged in. Then, click anywhere on the map to pinpoint which point (tree) on the map will be submitted to the database. Click submit to the submit the data to the database. Refresh or zoom in or out to see the changes applied.",
      },
      "Flag trees": {
        title: "Flagging Trees",
        description:
          "Users logged in may flag trees they deem to be incorrect (e.g., a point on the map does not represent a tree and is therefore incorrect). Application administrators will verify flagged data manually. Click on a point to see the interface to flag (or unflag) it. Note: to hide the details interface, please click the point again.",
      },
      Filter: {
        title: "Filtering Search",
        description:
          "Filter search by city. Click the settings button on the bottom left of the map. Then, click 'Show Select Cities' and check/uncheck the relevant cities."
      },
      "Get my trees": {
        title: "Get trees uploaded by the user",
        description:
          "This upcoming feature is intended for NSTP students from UP Diliman. This is to allow students to get all the points they have submitted so far."
      }
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
