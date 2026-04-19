import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  addItem: (product) => {
    const exists = get().items.find(i => i._id === product._id);
    if (exists) {
      set({ items: get().items.map(i => 
        i._id === product._id ? { ...i, qty: i.qty + 1 } : i
      )});
    } else {
      set({ items: [...get().items, { ...product, qty: 1 }] });
    }
  },
  removeItem: (id) => set({ items: get().items.filter(i => i._id !== id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0)
}));

export default useCartStore;