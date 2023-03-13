import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import useNotificationStore from "../../stores/notificationStore";
import Container from "../layout/Container";

const COLOR_CODES = {
  success: "border-green-500",
  error: "border-rose-500",
  info: "border-cyan-500",
  loading: "border-yellow-500",
};

export default function Notification({ className }) {
  const message = useNotificationStore((state) => state.message);
  const status = useNotificationStore((state) => state.status);

  const isOpen = useNotificationStore((state) => state.isOpen);
  const setIsOpen = useNotificationStore((state) => state.setIsOpen);

  const setOpenHandler = () => {
    console.log("clicked");
    setIsOpen();
  };

  return (
    <>
      {isOpen ? (
        <Container
          className={`w-[250px] h-[100px] rounded-md flex items-center justify-center px-2 pb-2 bg-[var(--primary-bg-color)] border-t-[5px] ${className} ${COLOR_CODES[status]} transition-opacity ease-in duration-700 opacity-100`}
        >
          <div className="h-full w-full">
            <div className="w-full flex justify-end">
              <MinusCircleIcon
                className="h-4 w-4 shadow-none cursor-pointer"
                onClick={setIsOpen}
              ></MinusCircleIcon>
            </div>
            <h1 className="text-xl font-bold">Notification</h1>
            {/* button to hide */}
            <p className="text-sm">{message ? message : "No notification"}</p>
          </div>
        </Container>
      ) : (
        // circular button to show with border equal to status
        <PlusCircleIcon
          onClick={setIsOpen}
          className={`text-gray-600 rounded-full border-[5px] ${COLOR_CODES[status]} h-10 w-10 ${className} flex items-center justify-center cursor-pointer transition-opacity ease-in duration-700 opacity-100`}
        ></PlusCircleIcon>
      )}
    </>
  );
}
