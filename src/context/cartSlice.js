import { createSlice } from "@reduxjs/toolkit";

const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

const initialState = {
    items: loadCartFromStorage(),
    userInfo: {
        name: "",
        phone: "",
        address: "",
        companyName: "",
        inn: "",
    },
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find((item) => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            saveCartToStorage(state.items);
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            saveCartToStorage(state.items);
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find((item) => item.id === id);
            if (item && quantity > 0) {
                item.quantity = quantity;
            }
            saveCartToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            saveCartToStorage(state.items);
        },
        setCart: (state, action) => {
            state.items = action.payload;
            saveCartToStorage(state.items);
        },
        setUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart, setUserInfo } = cartSlice.actions;
export default cartSlice.reducer;


