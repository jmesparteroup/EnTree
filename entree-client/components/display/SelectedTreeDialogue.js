import useSelectedTreeStore from "../../stores/selectTreesStore";
import Container from "../layout/Container";

export default function SelectedTree({ className }) {
  const selectedTree = useSelectedTreeStore((state) => state.selectedTree);
  // checkbox handler

  return (
    <>
      {selectedTree ? (
        <Container
          className={`w-[258px] h-[30vh] absolute right-2 top-[5%] rounded-lg bg-white opacity-90 flex flex-col p-4 items-center text-gray-800 shadow-2xl`}
        >
          <div className="text-lg border-b-[1px] w-full mx-4 text-center font-bold">
            Selected Tree
          </div>

          {/* show treeId, uploaded by, uploaded on */}
          <div className="w-full flex flex-col justify-center items-center">
            {/* icon and detail */}
            <div className="mt-2 w-full justify-center items-center">
              <div className="w-full flex justify-center text-center font-semibold">
                ID: <span className="ml-3 text-lime-600">{selectedTree.treeId}</span>
              </div>
              <div className="w-full flex justify-center text-center font-semibold">
                Uploader : <span className="ml-3 text-lime-600">{selectedTree.userId}</span>
              </div>
              <div className="w-full flex justify-center text-center font-semibold">
                {/* lat */} Lat:
                <span className="ml-3 text-lime-600">{selectedTree.lat}</span>
              </div>
              <div className="w-full flex justify-center text-center font-semibold">
                {/* lat */} Lng:
                <span className="ml-3 text-lime-600">{selectedTree.lng}</span>
              </div>
              <div className="flex justify-between w-[70%] mx-auto">
                {/* flag button */}
                <button className="w-2/5 h-10 rounded-md bg-lime-300 text-gray-800 font-semibold hover:bg-lime-400">
                  Flag
                </button>
                {/* delete button */}
                <button className="w-2/5 h-10 rounded-md bg-lime-300 text-gray-800 font-semibold hover:bg-lime-400">
                  Delete
                </button>
              </div>
            </div>
            <div className="w-full flex"></div>
          </div>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}
