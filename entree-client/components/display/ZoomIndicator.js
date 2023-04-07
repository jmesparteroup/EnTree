import useMapOptionsStore from "../../stores/mapOptionsStore";

export default function ZoomIndicator({ className }) {
  // show a circular div
  const zoom = useMapOptionsStore((state) => state.zoom);
  return (
    <div
      className={`rounded-full bg-[var(--primary-bg-color)] opacity-90 h-12 w-12 text-center flex justify-center items-center ${className} border-2 border-gray-400`}
    >
      <span className="font-semibold text-gray-700 select-none">{Math.round(zoom)}</span>
    </div>
  );
}
