import { create } from 'zustand';

const useAppStore = create((set) => ({
  modal: {
    show: false,
    children: null,
    onClick: null,
  },
  setModal: (modal) => set({ modal }),
}));

export default useAppStore;
