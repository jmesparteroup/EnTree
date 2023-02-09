import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";


const useNotificationStore = create(
  subscribeWithSelector((set) => ({
    message: "",
    setMessage: (message) => set({ message: message }),
    clearMessage: () => set({ message: "" }),
    status: "success",
    setStatus: (status) => set({ status: status }),
    clearStatus : () => set({ status: "success" }),
  }))
);

export default useNotificationStore;
