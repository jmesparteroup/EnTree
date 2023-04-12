import {
  InformationCircleIcon,
  MinusIcon,
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
      "Filter by City": {
        title: "Filtering Search",
        description:
          "Filter search by city. Click the settings button on the bottom left of the map. Then, click 'Show Select Cities' and check/uncheck the relevant cities.",
      },
      "Filter by Barangay": {
        title: "Filtering Search",
        description:
          "Filter search by barangay. This highlights on the map the selected barangay. To use this feature, use the Search button on the right of the map. This feature is intended to be an aid for data-gathering purposes.",
      },
      "Get my trees": {
        title: "Get trees uploaded by the user",
        description:
          "This feature allows a user to download all the trees they have submitted so far. It returns your datapoints as a csv. To use this feature, make sure you are logged in first. Click the '+' symbol that appears on the bottom left of the map once logged in. Click the 'Request Uploaded Trees' option. Wait a few seconds; when it is ready you should be able to click the 'Download CSV' option.",
      },
      Survey: {
        title: "Answer our Thesis Survey!",
        description:
          "Good day! This survey is intended to be answered by NSTP students from UP Diliman. Hopefully, you can answer this survey before the third week of April. Thank you for participating and using our application!",
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

  const openLinkInNewTab = ( url ) => {
    const newTab = window.open(url, '_blank', 'noopener, noreferrer');
    if ( newTab ) newTab.opener = null;
  }
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
              className="rounded-full h-7 w-7 text-center flex justify-center items-center absolute top-0 right-0 m-1 border-0 cursor-pointer"
            >
              <MinusIcon className="h-10 w-10 text text-gray-400 hover:text-gray-600 transition ease-linear"></MinusIcon>
            </div>
            {/* Title */}
            <div
              id="title"
              className="h-12 flex justify-center items-center my-3 w-[90%] border-b select-none"
            >
              <div className="text-2xl font-bold select-none">{appInfo.guides.title}</div>
            </div>
            {/* items for info sheet*/}
            {/* Display a grid of buttons for the different keys of appInfo.guides.steps */}
            {/* <div className="grid md:grid-cols-4 grid-cols-3 gap-3 w-[10]"> */}
            <div className="w-full flex justify-start lg:justify-center">
              <div
                className="overflow-x-auto flex justify-start lg:justify-center mx-10 touch-auto"
                id="allowedScroll"
              >
                {Object.keys(appInfo.guides.steps).map((key) => (
                  <div
                    key={key}
                    id="allowedScroll"
                    className={`${
                      selectedStep === key ? "border-2" : ""
                    } select-none hover:scale-105 shadow-hover transition ease-linear px-5 rounded-md bg-[var(--primary-bg-color)] mx-2 my-2 py-2 opacity-90 text-center flex justify-center items-center border-gray-400 cursor-pointer w-[100px]`}
                    onClick={() => setSelectedStep(key)}
                  >
                    <div
                      id="allowedScroll"
                      className="md:text-lg text-md font-bold"
                    >
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Display the selected step */}
            <div className="my-3 h-[60%] w-[90%] flex flex-col justify-start items-center border-t py-3">
              <div className="text-2xl font-bold select-none">
                {appInfo.guides?.steps[selectedStep]?.title}
              </div>
              <div
                className="text-md font-semibold mt-3 overflow-y-auto touch-auto lg:w-3/4 h-6/10 w-9/10"
                id="allowedScroll"
              >
                {appInfo.guides?.steps[selectedStep]?.description ||
                  "Select an item to see its description."}
                {selectedStep === "Survey" && (
                  <button
                    className="bg-lime-100 p-2 m-2 w-4/5 text-gray-500 shadow-hover active:shadow-none"
                    onClick={() => openLinkInNewTab("https://docs.google.com/forms/d/e/1FAIpQLSeOHuHu6CFkV9qF-R6vES2IL0X2TxA4EamYb4g8jRVxFGe3Iw/viewform")}
                  >
                    Survey Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
