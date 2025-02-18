import { create } from 'zustand';

interface IUseDndStore {
  isDraggable: boolean;
  setIsDraggable: (isDraggable: boolean) => void;
}

export const useDndStore = create<IUseDndStore>((set) => ({
  isDraggable: true,
  setIsDraggable: (isDraggable: boolean) => set({ isDraggable }),
}));
