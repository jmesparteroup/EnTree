import useMapOptionsStore from "../../stores/mapOptionsStore";

export default function ZoomIndicator({ className }) {
  // show a circular div
  const zoom = useMapOptionsStore((state) => state.zoom);
  return (
    <div
      className={`rounded-full bg-[var(--primary-bg-color)] h-12 w-12 text-center flex justify-center items-center ${className} border-2 border-gray-400`}
    >
      <span className="font-semibold text-gray-700">{zoom}</span>
    </div>
  );
}
