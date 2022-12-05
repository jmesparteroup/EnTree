import create from "zustand";

const useUserStore = create((set) => ({
  userState: {
    isLoggedIn: false,
    user: null
  
  },
  setUserState: (userState) => set({ userState: userState }),
}));
  

export default useUserStore;