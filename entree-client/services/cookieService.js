import { getCookie, setCookie, hasCookie, deleteCookie  } from 'cookies-next';

const cookieService = {
    // User Cookie methods
    getUserCookie: () => getCookie("user"),
    setUserCookie: (user) => setCookie("user", user),
    hasUserCookie: () => hasCookie("user"),
    deleteUserCookie: () => deleteCookie("user"),
    // City Cookie methods

}

export default cookieService

