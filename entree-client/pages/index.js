import Image from "next/image";
import { useState } from "react";
import Container from "../components/layout/Container";
import Logo from "../components/layout/Logo";

export default function Home() {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onEdit = (e, field) => {
    setFormDetails({ ...formDetails, [field]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(`Form submitted: ${formDetails.email} ${formDetails.password}`);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {/* HALF LOGO WITH TEXT */}
      <div className="w-1/3 lg:w-[250px] hidden md:flex min-h-[480px] md:justify-end" >
        <div className="relative w-full">
          <Image
            src="/home-page-img.png"
            className="mr-3 object-contain"
            alt="Phone with map image"
            fill
          />
        </div>
      </div>
      {/* Other Half */}
      <div className="w-content md:ml-5">
        <Container className="min-h-[480px] max-w-[450px] min-w-[400px] p-5 lg:w-1/2 border-2 border-gray-100 bg-[color:var(--primary-bg-color)] flex justify-center items-center">
          {/* LOGIN */}
          <div className="flex flex-col items-center w-full">
            {/* Entree Logo with Entree */}
            <div className="w-full flex justify-center">
              <Logo size="25px" className="mr-1" />
              <h2 className="text-2xl text-gray 400 font-bold">EnTree</h2>
            </div>
            <div className="flex flex-col items-center mt-3 w-[80%]">
              <input
                className="border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full"
                type="text"
                placeholder="Username"
                value={formDetails.email}
                onChange={(e) => onEdit(e, "email")}
              />
              <input
                className="border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full"
                type="password"
                placeholder="Password"
                value={formDetails.password}
                onChange={(e) => onEdit(e, "password")}
              />
              <button
                className="bg-lime-100 p-2 m-2 w-full text-gray-500"
                onClick={submitHandler}
              >
                Login
              </button>
              {/* --- or --- */}
              <div className="flex flex-row items-center justify-center mt-3 w-full">
                <hr className="w-1/2 bg-gray-500" />
                <p className="mx-4 text-md text-gray-500">or</p>
                <hr className="w-1/2 bg-gray-500" />
              </div>
              {/* don't have an account? join us*/}
              <div className="flex flex-row items-center justify-center mt-3 w-full">
                <p className="text-md text-gray-500">Don't have an account?</p>
                <p className="mx-2 text-md text-gray-500 font-bold cursor-pointer hover:translate-y-[-5px]">
                  Join us
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
