import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import CookieService from "../services/cookieService";
import UserService from "../services/userService";
import useUserStore from "../stores/userStore";
import jwt_decode from "jwt-decode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  // on first load, check for cookie if user is logged in
  const setUserState = useUserStore((state) => state.setUserState);

  useEffect(() => {
    window.addEventListener(
      "touchmove",
      function (event) {
        // Prevent scrolling on this element
        event.preventDefault();
      },
      { passive: false }
    );

    const checkUserCookie = async () => {
      const user = CookieService.getUserCookie();
      if (user) {
        const decoded = jwt_decode(user);
        // get current user
        const response = await UserService.getUserById(decoded.userId);
        if (response?.data) {
          setUserState({
            isLoggedIn: true,
            user: response.data,
          });
        }
      }
    };

    checkUserCookie();
  }, []);

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
