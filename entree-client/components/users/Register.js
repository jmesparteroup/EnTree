import { useState } from "react";
import Container from "../layout/Container";
import Logo from "../layout/Logo";

// example form

// {
//     "email": "test@gmail.com",
//     "username": "test",
//     "password": "password",
//     "firstName": "Joshua",
//     "lastName": "Espartero",
//     "mobileNumber": "09278633233",
//     "age": 22
// }
const REGISTER_FIELDS = [
  {
    name: "email",
    placeholder: "Email",
    type: "text",
  },
  {
    name: "username",
    placeholder: "Username",
    type: "text",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
  },
  {
    name: "firstName",
    placeholder: "First Name",
    type: "text",
  },
  {
    name: "lastName",
    placeholder: "Last Name",
    type: "text",
  },
  {
    name: "mobileNumber",
    placeholder: "Mobile Number",
    type: "text",
  },
  {
    name: "age",
    placeholder: "Age",
    type: "number",
  },
];

export default function Register({
  userService,
  setUserState,
  cookieService,
  className,
  router,
}) {
  const [formDetails, setFormDetails] = useState({});
  const onEdit = (e, field) => {
    setFormDetails({ ...formDetails, [field]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await userService.registerUser(formDetails);

    if (response?.data?.token) {
      cookieService.setUserCookie(response?.data?.token);
      // get user details
      const userResponse = await userService.getUserById(
        response?.data?.userId
      );
      setUserState({ isLoggedIn: true, user: userResponse?.data });
      router.push("/maps");
    }
  };

  return (
    <Container
      className={`min-h-[480px] max-w-[450px] min-w-[400px] p-5 lg:w-1/2 border-2 border-gray-100 bg-[color:var(--primary-bg-color)] flex justify-center items-center ${className}`}
    >
      {/* LOGIN */}
      <div className="flex flex-col items-center w-full">
        {/* Entree Logo with Entree */}
        <div className="w-full flex justify-center">
          <Logo size="25px" className="mr-1" />
          <h2 className="text-2xl text-gray 400 font-bold">Register</h2>
        </div>
        <div className="flex flex-col items-center mt-3 w-[80%]">
          {REGISTER_FIELDS.map((field) => (
            <input
              className="border-gray-200 p-2 m-2 focus:outline-none border-[1px] bg-[color:var(--secondary-bg-color)] w-full"
              type={field.type}
              placeholder={field.placeholder}
              value={formDetails[field.name]}
              onChange={(e) => onEdit(e, field.name)}
            />
          ))}
          <button
            className="bg-lime-100 p-2 m-2 w-full text-gray-500"
            onClick={submitHandler}
          >
            Register
          </button>
        </div>
      </div>
    </Container>
  );
}
