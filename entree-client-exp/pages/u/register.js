import Login from "../../components/users/Login";
import Register from "../../components/users/Register";

import useUserStore from "../../stores/userStore";
import userService from "../../services/userService";
import cookieService from "../../services/cookieService";
import { useRouter } from "next/router";

export default function Users() {
  const userState = useUserStore((state) => state.userState);
  const setUserState = useUserStore((state) => state.setUserState);
  const router = useRouter();

  return (
    <>
      <div className="w-full h-[calc(100vh-4rem)] flex justify-center items-center">
        <Login
          router={router}
          cookieService={cookieService}
          userService={userService}
          setUserState={setUserState}
          className="mr-5"
        ></Login>
        <Register
          router={router}
          cookieService={cookieService}
          userService={userService}
          setUserState={setUserState}
        ></Register>
      </div>
    </>
  );
}
