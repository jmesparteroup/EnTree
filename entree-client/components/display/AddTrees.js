// import plus-circle icon from heroicons
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Container from "../layout/Container";

import { CSVLink } from "react-csv";
import { useState } from "react";
import { MinusIcon } from "@heroicons/react/24/solid";

export default function AddTrees({
  className,
  useNewTreesStore,
  TreeService,
  useOpenAddTreesStore,
  useUserStore,
}) {
  const newTrees = useNewTreesStore((state) => state.newTrees);
  const addNewTree = useNewTreesStore((state) => state.addNewTree);
  const removeNewTree = useNewTreesStore((state) => state.removeNewTree);
  const clearNewTrees = useNewTreesStore((state) => state.clearNewTrees);
  const highlightedIndex = useNewTreesStore((state) => state.highlightedIndex);

  const openAddTrees = useOpenAddTreesStore((state) => state.openAddTrees);
  const setOpenAddTrees = useOpenAddTreesStore(
    (state) => state.setOpenAddTrees
  );

  const [userTrees, setUserTrees] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([
    "User ID", "Latitude", "Longitude",
  ]);

  const loggedInUser = useUserStore((state) => state.userState.user);

  const requestUserTrees = async () => {
    try {
      const response = await TreeService.getTreesByUser();
      if (response?.trees?.length > 0) {
        const formattedTrees = response.trees.map((tree) => {
          return [
            loggedInUser.userId,
            tree[0],
            tree[1],
          ];
        });
        setUserTrees(formattedTrees);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const downloadUserTrees = async () => {
    // wait 3 secs for userTrees to finish downloading
    setTimeout(() => {
      setUserTrees([]);
    }
    , 3000);

  };

  // handler
  const parseCSV = (csv) => {
    const lines = csv.split("\n");
    const parsedData = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");

      parsedData.push(currentLine);
    }
    return parsedData;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event) => {
      const csv = event.target.result;
      const parsedData = parseCSV(csv);
      console.log(parsedData);
      parsedData.forEach((tree) => {
        if (tree[0].length === 0) return;
        addNewTree({
          latitude: +tree[1],
          // longitude should cut the \r at the end using regex
          longitude: +tree[2].replace(/\r$/, ""),
        });
      });
    };
  };

  const addTreesClickHandler = () => {
    setOpenAddTrees((prevState) => !prevState);
  };

  const submitNewTreesClickHandler = async () => {
    // process new trees
    try {
      const userId = loggedInUser.userId;

      if (!userId) return;

      let formattedNewTrees = newTrees.map((tree) => {
        return {
          location: `${tree.latitude} ${tree.longitude}`,
        };
      });
      const response = await TreeService.addTrees(formattedNewTrees);
      if (response.status === 201) {
        // clear new trees
        clearNewTrees();
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-transparent">
      <Container
        className={`w-[65px] h-[65px] rounded-full flex items-center bg-lime-300 text-gray-800 shadow-2xl cursor-pointer  ${className}`}
        onClick={addTreesClickHandler}
      >
        <div className="w-full h-full flex justify-center items-center shadow-none">
          <button className="w-full h-full rounded-md flex justify-center items-center shadow-none">
            {!openAddTrees ? (
              <PlusCircleIcon className="w-8 h-8" />
            ) : (
              <MinusCircleIcon className="w-8 h-8" />
            )}
          </button>
        </div>
      </Container>
      {openAddTrees ? (
        <Container
          className={`w-[max(30vh,300px)] h-[50vh] absolute left-2 top-[20%] bottom-0 rounded-lg bg-white opacity-90 flex flex-col p-4 items-center text-gray-800 shadow-2xl`}
        >
          {/* scrollable div that shows clicked items */}
          <div className="text-lg border-b-[1px] w-full mx-4 text-center font-bold">
            Add Trees
          </div>
          <div
              onClick={() => setOpenAddTrees()}
              className="rounded-full h-7 w-7 text-center flex justify-center items-center absolute top-0 right-0 m-1 border-0 cursor-pointer"
            >
              <MinusIcon className="h-10 w-10 text text-gray-400 hover:text-gray-600 transition ease-linear"></MinusIcon>
            </div>
          <div className="flex h-8 w-full border-b-[1px]">
            <div className="w-1/12 h-full flex justify-center items-center">
              #
            </div>
            <div className="w-9/12 h-full flex justify-center items-center border-x-[1px]">
              Location 📌
            </div>
            <div className="w-2/12 h-full flex justify-center items-center"></div>
          </div>
          <div className="w-full h-full flex-col items-center bg-transparent rounded-lg overflow-x-hidden scroll-smooth">
            {newTrees.map((tree, index) => (
              <div
                className={`flex h-8 w-full ${
                  highlightedIndex === index && "bg-gray-100 border-b-[1px]"
                }`}
                key={`${index}${tree.latitude}${tree.longitude}`}
              >
                {/* index */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  {index + 1}
                </div>
                {/* long lat */}
                <div className="w-9/12 h-full flex justify-center items-center">
                  {tree.latitude}, {tree.longitude}
                </div>

                {/* remove button */}
                <div className="w-1/12 h-full flex justify-center items-center">
                  <XMarkIcon
                    className="w-4 h-4 hover:scale-125 cursor-pointer transition duration-150"
                    onClick={() => removeNewTree(tree)}
                  />
                </div>
              </div>
            ))}
            <></>
          </div>
          <div className="text-lg border-t-[1px] w-full mx-4 text-center font-bold">
            {/* submit trees */}
            <button
              className="w-full h-full rounded-md shadow-hover flex justify-center items-center shadow-sm active:shadow-inner"
              onClick={submitNewTreesClickHandler}
            >
              Submit
            </button>
          </div>
          <div className="text-lg  w-full mx-4 mt-1 text-center font-bold relative ">
            {/* submit trees */}
            <input
              type="file"
              className="w-full h-full z-10 opacity-0 absolute cursor-pointer inset-0"
              onChange={handleFileUpload}
            />
            <button
              className="w-full h-full rounded-md shadow-hover flex justify-center items-center shadow-sm active:shadow-inner z-0 cursor-pointer"
              onClick={submitNewTreesClickHandler}
            >
              Upload CSV
            </button>
          </div>
          <div className="text-lg border-t-[1px] w-full mx-4 mt-1 text-center font-bold">
            {/* submit trees */}
            {userTrees?.length > 0 ? (
              <button className="bg-lime-100 w-full h-full rounded-md shadow-hover flex justify-center items-center shadow-sm active:shadow-inner">
                <CSVLink onClick={downloadUserTrees} data={userTrees} headers={csvHeaders} filename={`${Date.now()}_${loggedInUser.username}`}>Download CSV</CSVLink>
              </button>
            ) : (
              <button
                className="w-full h-full rounded-md shadow-hover flex justify-center items-center shadow-sm active:shadow-inner"
                onClick={requestUserTrees}
              >
                Request Uploaded Trees
              </button>
            )}
          </div>
        </Container>
      ) : (
        <></>
      )}
    </div>
  );
}
