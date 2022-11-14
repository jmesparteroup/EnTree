import dynamic from "next/dynamic";

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/ArcGISMap"),
  {
    ssr: false,
  }
);

export default function Maps() {
  return (
    <div className="h-screen">
      <div className="h-1/11 w-full">
        <h1 className="text-center text-3xl my-2 font-bold">Map</h1>
      </div>
      <div className="h-5/6 w-full">
        <EntreeMapWithNoSSR />
      </div>
    </div>
  );
}
