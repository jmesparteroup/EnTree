import dynamic from "next/dynamic";

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/Map"),
  {
    ssr: false,
  }
);

export default function Maps() {
  return <EntreeMapWithNoSSR />;
}
