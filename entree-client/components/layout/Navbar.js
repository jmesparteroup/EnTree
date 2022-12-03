// React Component for the Navbar

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Logo from "./Logo";
import {HomeIcon} from "@heroicons/react/24/solid";

export default function Navbar() {
  const [NAVBAR_ITEMS, _] = useState([
    { name: "Home", link: "/" },
    { name: "Map", link: "/maps" },
    { name: "Contact", link: "/contact" },
  ]);
  const router = useRouter();

  return (
    <>
      {router.pathname === "/" ? (
        <></>
      ) : (
        <>
          <nav className="bg-gray-800 p-3 w-full h-14">
            <div className="flex items-center max-w-7xl flex-wrap mx-auto">
              <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Logo size="25px" color="#DCFCE7" />
                <span className="font-semibold text-xl tracking-tight text-green-100 ml-2">
                  entree
                </span>
              </div>
              <div className="">
                <HomeIcon className="h-8 w-8 text-gray-200 hover:text-gray-500 pr-4" />
                
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
