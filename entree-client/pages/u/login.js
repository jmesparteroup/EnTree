import Container from "../../components/layout/Container";

export default function Login() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full md:flex-row">
        <Container className="w-1/2 mx-5 mt-5 md:">
          <h1 className="text-center text-3xl my-2 font-bold bg-white">Login</h1>
        </Container>
        <Container className="w-1/2 mx-5 mt-5">
          <div className="p-5 bg-white rounded-md">
            <form className="bg-white">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 bg-white"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
                  id="username"
                  type="text"
                  placeholder="Username"
                />

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="******************"
                />
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}
