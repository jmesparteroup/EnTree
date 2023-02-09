import useNotificationStore from "../../stores/notificationStore";
import Container from "../layout/Container";

const COLOR_CODES = {
    success: "border-t-[5px] border-green-500",
    error: "border-t-[5px] border-rose-500",
    info: "border-t-[5px] border-cyan-500",
    loading: "border-t-[5px] border-yellow-500",
}
export default function Notification({ className }) {
  const message = useNotificationStore((state) => state.message);
  const status = useNotificationStore((state) => state.status);

  return (
   <Container className={`w-[250px] h-[100px] rounded-md flex items-center justify-center p-4 bg-[var(--primary-bg-color)] ${className} ${COLOR_CODES[status]} transition-opacity ease-in duration-700 opacity-100` }>
        <div className="h-full w-full">
          <h1 className="text-xl font-bold">Notification</h1>
          <p className="text-sm">{
            message ? message : "No notification"
          }</p>
        </div>
      </Container>
  );
}