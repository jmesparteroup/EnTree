import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function InfoDialogue({className}) {
  return (
    <div
      className={`rounded-full bg-[var(--primary-bg-color)] h-12 w-12 text-center flex justify-center items-center ${className} border-2 border-gray-400 cursor-pointer`}
    >
        <InformationCircleIcon className="h-10 w-10 text-gray-500"></InformationCircleIcon>
    </div>
  );
}
