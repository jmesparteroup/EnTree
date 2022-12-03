import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import CookieService from "../services/cookieService";
import UserService from "../services/userService";
import useUserStore from "../stores/userStore";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  
  // on first load, check for cookie if user is logged in
  useEffect(() => {
    const checkUserCookie = async () => {
      const user = CookieService.getUserCookie();
      if (user) {
        useUserStore.setState({
          isLoggedIn: true,
          user: await UserService.getUser(user.id),
        });
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
