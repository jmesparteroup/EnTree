// React Component for the Navbar

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "./Logo";
import {HomeIcon} from "@heroicons/react/24/solid";
import useUserStore from "../../stores/userStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import cookieService from "../../services/cookieService";

export default function Navbar() {
  const router = useRouter();
  const userState = useUserStore((state) => state.userState);
  const setUserState = useUserStore((state) => state.setUserState);
  console.log("User State: ", userState);

  const logoutHandler = () => {
    cookieService.deleteUserCookie();
    setUserState({
      isLoggedIn: false,
      user: null,
    });
    router.push("/");
  };



  // On first load, check for cookie if user is logged in


  return (
    <>
      {router.pathname === "/" ? (
        <></>
      ) : (
        <>
          <nav className="bg-[var(--secondary-bg-color)] p-3 w-full h-14 sticky top">
            <div className="flex items-center max-w-7xl flex-wrap mx-auto">
              <div className="flex items-center flex-shrink-0 text-[var(--primary-text-color)] mr-6">
                <Logo size="25px" color="#121212" />
                <span className="font-semibold text-xl tracking-tight text-[var(--primary-text-color)] ml-2">
                  entree
                </span>
              </div>
              <Link href={"/"}>
                <HomeIcon className="h-8 w-8 text-gray-500 hover:text-gray-300 transition ease-in-out pr-4 cursor-pointer" />
              </Link>
              {/* User Info */}
              <div className="flex-grow flex justify-end text-[var(--primary-text-color)]">
                {/* Username or Login */}
                {/* Get only the first first name of the user */}
                {userState.isLoggedIn ? (`Hello, ${userState.user.firstName.split(" ")[0]}`) : (<></>)}
              </div>
              <div className="text-[var(--primary-text-color)] flex align-center justify-center">
                  {userState.isLoggedIn ? (
                      <div className="ml-2 inline-block text-md hover:scale-105 transition ease-inout text-[var(--primary-text-color)]" onClick={logoutHandler}>
                        <ArrowLeftIcon className="h-4 w-4 text-gray-600"/>
                      </div>
                  ) : (
                    <Link href={"/"}>
                      <div className="ml-5 inline-block text-md hover:scale-105 transition ease-in-out text-[var(--primary-text-color)] ">
                        Login
                      </div>
                    </Link>
                  )}
                </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
