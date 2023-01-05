// React Component for the Navbar

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "./Logo";
import {HomeIcon} from "@heroicons/react/24/solid";
import useUserStore from "../../stores/userStore";

export default function Navbar() {
  const router = useRouter();
  const userState = useUserStore((state) => state.userState);
  console.log("User State: ", userState);

  // On first load, check for cookie if user is logged in


  return (
    <>
      {router.pathname === "/" ? (
        <></>
      ) : (
        <>
          <nav className="bg-[var(--secondary-bg-color)] p-3 w-full h-14">
            <div className="flex items-center max-w-7xl flex-wrap mx-auto">
              <div className="flex items-center flex-shrink-0 text-[var(--primary-text-color)] mr-6">
                <Logo size="25px" color="#121212" />
                <span className="font-semibold text-xl tracking-tight text-[var(--primary-text-color)] ml-2">
                  entree
                </span>
              </div>
              <div className="">
                <HomeIcon className="h-8 w-8 text-gray-200 hover:text-gray-500 pr-4" />
              </div>
              {/* User Info */}
              <div className="flex-grow flex justify-end text-[var(--primary-text-color)]">
                {/* Username or Login */}
                {userState.isLoggedIn ? (`Hello, ${userState.user.firstName}`) : (<></>)}
                
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
