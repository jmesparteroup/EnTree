import Login from "../../components/users/Login";
import Register from "../../components/users/Register";

import useUserStore from "../../stores/userStore";
import userService from "../../services/userService";
import cookieService from "../../services/cookieService";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Users() {
  const userState = useUserStore((state) => state.userState);
  const setUserState = useUserStore((state) => state.setUserState);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Entree | Register</title>
      </Head>
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] ">
        <div className="w-[80] px-auto h-full grid md:grid-cols-2 grid-cols-1 gap-5 place-items-center   overflow-scrollable">
          <Register
            router={router}
            cookieService={cookieService}
            userService={userService}
            setUserState={setUserState}
            className=" min-h-[600px] max-h-[600px] sm:my-2"
          ></Register>
          <Login
            router={router}
            cookieService={cookieService}
            userService={userService}
            setUserState={setUserState}
            className="min-h-[280px] max-h-[600px] hidden md:block"
          ></Login>
        </div>
      </div>
    </>
  );
}
