import create from "zustand";

const useUserStore = create((set) => ({
  userState: {
    isLoggedIn: true,
    user: "Camille",
  },
  setUserState: (userState) => set({ userState }),
}));
  

export default useUserStore;