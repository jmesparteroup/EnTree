import Image from "next/image";
import Head from "next/head";
import { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import Logo from "../components/layout/Logo";

import userService from "../services/userService";
import cookieService from "../services/cookieService";

import useUserStore from "../stores/userStore";

import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const userState = useUserStore((state) => state.userState);
  const setUserState = useUserStore((state) => state.setUserState);

  useEffect(() => {
    // On first load, check for cookie if user is logged in
    console.log("Checking for userState", userState);

    if (userState.isLoggedIn) {
      window.location.pathname = "/maps";
    }
  }, []);

  const [formDetails, setFormDetails] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState({
    message: "",
    code: "",
  });

  const onEdit = (e, field) => {
    setFormDetails({ ...formDetails, [field]: e.target.value });
  };

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      const { identifier, password } = formDetails;
      const response = await userService.loginUser({ identifier, password });

      if (response?.data?.token) {
        cookieService.setUserCookie(response?.data?.token);
        // get user details
        const userResponse = await userService.getUserById(
          response?.data?.userId
        );
        setUserState({ isLoggedIn: true, user: userResponse?.data });
        router.push("/maps");
      }
    } catch (error) {
      switch (error.customCode) {
        case 1001:
          setError({
            message: error.message,
            code: error.customCode,
          });
          break;

        case 1004:
          setError({
            message: error.message,
            code: error.customCode,
          });
          break;

        case 1005:
          setError({
            message: error.message,
            code: error.customCode,
          });
          break;

        default:
          setError({
            message: "Something went wrong",
            code: error.customCode,
          });
      }
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Head>
        <title>Entree</title>
      </Head>
      {/* HALF LOGO WITH TEXT */}
      <div className="w-1/3 lg:w-[250px] hidden md:flex min-h-[480px] md:justify-end">
        <div className="relative w-full">
          <div className="absolute bottom-0 w-full flex justify-center">
            <h1 className="text-lg text-center font-bold text-gray-500 w-4/5">
              Find your way around. Click the map to get started.
            </h1>
          </div>
          <Image
            src="/home-page-img.png"
            className="mr-3 object-contain hover:translate-y-[-80px] transition ease-linear duration-200 cursor-pointer"
            onClick={() => {
              router.push("/maps");
            }}
            alt="Phone with map image"
            fill
          />
        </div>
      </div>
      {/* Other Half */}
      <div className="w-content md:ml-5 ">
        <Container className="min-h-[480px] max-w-[450px] min-w-[400px] p-5 lg:w-1/2 border-2 border-gray-100 bg-[color:var(--primary-bg-color)] flex justify-center items-center">
          {/* LOGIN */}
          <div className="flex flex-col items-center w-full">
            {/* Entree Logo with Entree */}
            <div className="w-full flex justify-center">
              <Logo size="25px" className="mr-1" />
              <h2 className="text-2xl text-gray 400 font-bold">EnTree</h2>
            </div>
            <form className="flex flex-col items-center mt-3 w-[80%]">
              <input
                className={`border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full ${
                  error.code === 1001 || error.code === 1004 &&
                  "border-red-300 shadow-red-300 shadow"
                }`}
                type="text"
                placeholder="email or username"
                value={formDetails.identifier}
                onChange={(e) => onEdit(e, "identifier")}
              />
              <input
                className={`border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full ${
                  error.code === 1005 &&
                  "border-red-300 shadow-red-300 shadow"
                }`}
                type="password"
                placeholder="Password"
                value={formDetails.password}
                onChange={(e) => onEdit(e, "password")}
              />
             
              <button
                className="bg-lime-100 p-2 m-2 w-full text-gray-500 shadow-hover active:shadow-none"
                onClick={submitHandler}
              >
                Login
              </button>
               {/* error message */}
               {error.code && (
                <p className="text-red-400 text-sm w-full">{error.message}</p>
              )}
              {/* --- or --- */}
              <div className="flex flex-row items-center justify-center mt-3 w-full">
                <hr className="w-1/2 bg-gray-500" />
                <p className="mx-4 text-md text-gray-500">or</p>
                <hr className="w-1/2 bg-gray-500" />
              </div>
              {/* don't have an account? join us*/}
              <div className="flex flex-row items-center justify-center mt-3 w-full">
                <p className="text-md text-gray-500">
                  Don&#39;t have an account?
                </p>
                <p
                  onClick={() => router.push("/u/register")}
                  className="mx-2 text-md text-gray-500 font-bold cursor-pointer hover:translate-y-[-5px] transition ease-linear"
                >
                  Join us
                </p>
              </div>
              <div className="md:hidden flex flex-row items-center justify-center mt-3 w-full">
                <hr className="w-1/2 bg-gray-500" />
                <p className="mx-4 text-md text-gray-500">or</p>
                <hr className="w-1/2 bg-gray-500" />
              </div>
              <div className="md:hidden w-full flex justify-center align-center text-gray-500 mt-3 cursor-pointer font-bold" onClick={() => router.push("/maps")}>
                Click here to check our map!
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}
