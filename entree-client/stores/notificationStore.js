import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useNotificationStore = create(
  subscribeWithSelector((set) => ({
    message: "",
    setMessage: (message) => set({ message: message }),
    clearMessage: () => set({ message: "" }),
    status: "success",
    setStatus: (status) => set({ status: status }),
    clearStatus: () => set({ status: "success" }),
    isOpen: true,
    setIsOpen: () =>
      set((state) => ({
        isOpen: !state.isOpen,
      })),
  }))
);

export default useNotificationStore;
