import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import CookieService from "../services/cookieService";
import UserService from "../services/userService";
import useUserStore from "../stores/userStore";
import jwt_decode from "jwt-decode";
import "../styles/globals.css";

// import esriConfig from "@arcgis/core/config.js";
// esriConfig.assetsPath = "./assets";

if (process.env.ENVIRONMENT !== "development")
    console.log = () => {};

function MyApp({ Component, pageProps }) {
  // on first load, check for cookie if user is logged in
  const setUserState = useUserStore((state) => state.setUserState);

  useEffect(() => {
    window.addEventListener(
      "touchmove",
      function (event) {
        // Prevent scrolling on this element
        if (event?.target?.id !== "allowedScroll") {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    const checkUserCookie = async () => {
      const user = CookieService.getUserCookie();
      try {
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
      } catch (error) {
        setUserState({
          isLoggedIn: false,
          user: null,
        });
        // remove cookie
        CookieService.deleteUserCookie();
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
