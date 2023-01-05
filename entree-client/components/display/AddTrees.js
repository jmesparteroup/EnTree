// import plus-circle icon from heroicons
import {
  PlusCircleIcon,
  MinusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Container from "../layout/Container";

// example tree array
const trees = [
  {
    description: "This is a tree",
    latitude: 14.555,
    longitude: 121.055,
  },
  {
    description: "This is another tree",
    latitude: 14.555,
    longitude: 121.055,
  },
  {
    description: "This is a third tree",
    latitude: 14.555,
    longitude: 121.055,
  },
];

export default function AddTrees({ className, useNewTreesStore, TreeService }) {
  const newTrees = useNewTreesStore((state) => state.newTrees);
  const removeNewTree = useNewTreesStore((state) => state.removeNewTree);
  const clearNewTrees = useNewTreesStore((state) => state.clearNewTrees);

  const [openAddTrees, setOpenAddTrees] = useState(false);

  const addTreesClickHandler = () => {
    setOpenAddTrees((prevState) => !prevState);
  };

  const submitNewTreesClickHandler = async () => {
    // process new trees
    let formattedNewTrees = newTrees.map((tree) => {
      return {
        description: tree.description,
        location: `${tree.longitude} ${tree.latitude}`,
        userId: "5f9f1b9b9c9d440000",
      };
    });
    const response = await TreeService.addTrees(formattedNewTrees);
    if (response.status === 200) {
      // clear new trees
      clearNewTrees();
    }
    console.log(response);
  };

  return (
    <div className="bg-transparent">
      <Container
        className={`w-[65px] h-[65px] rounded-full flex items-center bg-lime-300 text-gray-800 shadow-2xl cursor-pointer ${className}`}
        onClick={addTreesClickHandler}
      >
        <div className="w-full h-full flex justify-center items-center shadow-none">
          <button className="w-full h-full rounded-md border flex justify-center items-center shadow-none">
            {!openAddTrees ? (
              <PlusCircleIcon className="w-8 h-8 hover:animate-bounce" />
            ) : (
              <MinusCircleIcon className="w-8 h-8 hover:animate-bounce" />
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
          <div className="flex h-8 w-full border-b-[1px]">
            <div className="w-1/12 h-full flex justify-center items-center">
              #
            </div>
            <div className="w-9/12 h-full flex justify-center items-center border-x-[1px]">
              Location
            </div>
            <div className="w-2/12 h-full flex justify-center items-center"></div>
          </div>
          <div className="w-full h-full flex-col items-center bg-transparent rounded-lg overflow-x-hidden scroll-smooth">
            {newTrees.map((tree, index) => (
              <div
                className="flex h-8 w-full"
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
              className="w-full h-full rounded-md border flex justify-center items-center shadow-sm active:shadow-inner"
              onClick={submitNewTreesClickHandler}
            >
              Submit
            </button>
          </div>
        </Container>
      ) : (
        <></>
      )}
    </div>
  );
}
