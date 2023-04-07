import { useState } from "react";
import Container from "../layout/Container";
import Logo from "../layout/Logo";

export default function Login({
  userService,
  setUserState,
  cookieService,
  className,
  router,
}) {
  const [formDetails, setFormDetails] = useState({
    identifier: "",
    password: "",
  });
  const onEdit = (e, field) => {
    setFormDetails({ ...formDetails, [field]: e.target.value });
  };

  const [error, setError] = useState({
    message: "",
    code: "",
  });

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
    <Container
      className={`max-w-[450px] min-w-[400px] p-5 lg:w-1/2 border-2 border-gray-100 bg-[color:var(--primary-bg-color)] flex justify-center items-center ${className}`}
    >
      {/* LOGIN */}
      <form className="flex flex-col items-center justify-center w-full h-full">
        {/* Entree Logo with Entree */}
        <div className="w-full flex justify-center">
          <Logo size="25px" className="mr-1" />
          <h2 className="text-2xl text-gray 400 font-bold">Login</h2>
        </div>
        <div className="flex flex-col items-center mt-3 w-[80%]">
          <input
            className={`border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full ${
              error.code === 1001 ||
              (error.code === 1004 && "border-red-300 shadow-red-300 shadow")
            }`}
            type="text"
            placeholder="email or username"
            value={formDetails.identifier}
            onChange={(e) => onEdit(e, "identifier")}
          />
          <input
            className={`border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full ${
              error.code === 1005 && "border-red-300 shadow-red-300 shadow"
            }`}
            type="password"
            placeholder="Password"
            value={formDetails.password}
            onChange={(e) => onEdit(e, "password")}
          />
                    {error.code && (
            <p className="text-red-400 text-sm w-full">{error.message}</p>
          )}
          <button
            className="bg-lime-100 p-2 m-2 w-full text-gray-500 shadow-hover active:shadow-none"
            onClick={submitHandler}
          >
            Login
          </button>

        </div>
      </form>
    </Container>
  );
}
