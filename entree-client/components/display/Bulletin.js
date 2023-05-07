import { InformationCircleIcon, MinusIcon } from "@heroicons/react/24/outline";
import useBulletinStore from "../../stores/bulletinStore";

const updates = [
  {
    title: "New Feature",
    body: "You can now add a new feature to the map by clicking on the map and filling out the form that appears.",
  },
  { title: "Up Time", body: "The map is now up and running 24/7." },
  {
    title: "Survey",
    body: "Please answer our survey! It is located at the bottom left of the map.",
  },
];

export default function Bulletin({ className }) {
  const setOpenBulletin = useBulletinStore((state) => state.setOpenBulletin);
  const openBulletin = useBulletinStore((state) => state.openBulletin);

  return (
    <>
      <>
        {/* Bulletin */}
        {openBulletin && (
          <div
            className={`bg-[var(--primary-bg-color)] opacity-[95%] rounded-lg h-[70vh] w-[80vw] md:w-[50vw] text-center flex flex-col justify-start items-center absolute top-[15%] left-[10%] md:left-[25%] border-1 border-gray-400 cursor-pointer z-50 shadow-lg`}
          >
            {/* minimize button */}
            <div
              onClick={() => setOpenBulletin()}
              className="rounded-full h-7 w-7 text-center flex justify-center items-center absolute top-0 right-0 m-1 border-0 cursor-pointer"
            >
              <MinusIcon className="h-10 w-10 text text-gray-400 hover:text-gray-600 transition ease-linear"></MinusIcon>
            </div>
            {/* Title */}
            <div
              id="title"
              className="h-12 flex justify-center items-center my-3 w-[90%] border-b select-none"
            >
              <div className="text-2xl font-bold select-none">Updates</div>
            </div>

            {/* items for updates sheet*/}

            <div className="w-full flex items-center justify-center">
              <div className="overflow-x-auto flex-col justify-start lg:justify-center mx-10 touch-auto mt-5">
                {/* display title: body in this format */}
                {updates.map((update, index) => (
                  <div key={index} className="flex flex-col items-start my-2">
                    <div className="">
                      <span className="text-xl font-bold">
                        {update.title}
                      </span>: {" "}
                      {update.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}
