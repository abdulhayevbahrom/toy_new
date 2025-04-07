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
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
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
      // userInfo localStorage'ga saqlanmaydi, agar kerak bo'lsa qo'shish mumkin
    },
    // incrementQuantity: (state, action) => {
    //   const { productId, inBox, inPackage, inStock, inTheBox } = action.payload;
    //   const item = state.items.find((item) => item.id === productId);
    //   if (!item) return;

    //   const maxQuantity = inStock * (Number(inTheBox) / Number(inBox));
    //   if (item.quantity >= maxQuantity) return;

    //   const boxQuantity = Number(item.quantity) * Number(inBox);
    //   let incrementAmount = 1;
    //   if (Number(inBox) > boxQuantity) {
    //     incrementAmount = 1 / (Number(inBox) / Number(inPackage));
    //   }

    //   item.quantity = Number((item.quantity + incrementAmount).toFixed(2));
    //   saveCartToStorage(state.items); // Har bir o'zgarishdan keyin saqlash
    // },

    incrementQuantity: (state, action) => {
      const { productId, inBox, inPackage, inStock, inTheBox } = action.payload;
      const item = state.items.find((item) => item.id === productId);
      if (!item) return;

      // Nolga bo‘lishni oldini olish
      if (Number(inBox) === 0 || Number(inPackage) === 0) return;

      const maxQuantity = inStock * (Number(inTheBox) / Number(inBox));
      if (item.quantity >= maxQuantity) return;

      const boxQuantity = Number(item.quantity) * Number(inBox);
      let incrementAmount = 1;
      if (Number(inBox) > boxQuantity) {
        incrementAmount = Number(inPackage) / Number(inBox); // Paket bo‘yicha oshirish
      }

      const newQuantity = item.quantity + incrementAmount;
      if (newQuantity <= maxQuantity) {
        item.quantity = Number(newQuantity.toFixed(2));
        saveCartToStorage(state.items);
      }
    },

    decrementQuantity: (state, action) => {
      const { product } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === product.id);
      if (itemIndex === -1) return; // Mahsulot topilmasa, hech narsa qilmaymiz

      const inCart = state.items[itemIndex];

      // Ekrandagi hisoblash logikasini qo‘llaymiz
      const displayedQty =
        parseInt(inCart.quantity * inCart.inBox) % inCart.inPackage !== 0
          ? Math.ceil(inCart.quantity * inCart.inBox)
          : parseInt(inCart.quantity * inCart.inBox);

      // Agar ekrandagi quantity nolga teng bo‘lsa, mahsulotni o‘chiramiz
      if (displayedQty <= 0) {
        state.items.splice(itemIndex, 1);
        return;
      }

      let minusAmount = 1; // Standart kamaytirish miqdori
      if (
        parseInt(product.inBox) >= parseInt(inCart.quantity * product.inBox)
      ) {
        minusAmount =
          1 / (parseInt(product.inBox) / parseInt(product.inPackage));
      } else if (
        parseInt(product.inBox) + parseInt(product.inTheBox) <=
        parseInt(inCart.quantity * product.inBox)
      ) {
        minusAmount = parseInt(product.inTheBox) / parseInt(product.inBox);
      }

      const totalPieces = inCart.quantity * product.inBox; // Jami dona
      const minusPieces = minusAmount * product.inBox; // Kamaytiriladigan dona
      const newTotalPieces = totalPieces - minusPieces; // Yangi jami dona

      // Yangi miqdor nolga teng yoki undan kichik bo‘lsa, o‘chiramiz
      if (newTotalPieces <= 0) {
        state.items.splice(itemIndex, 1);
      } else {
        const newQuantity = newTotalPieces / product.inBox; // Yangi miqdor
        state.items[itemIndex].quantity = parseFloat(newQuantity.toFixed(4)); // Yangi miqdorni saqlaymiz

        // Yangi quantity bo‘yicha ekrandagi ko‘rinishni tekshiramiz
        const newDisplayedQty =
          parseInt(newQuantity * inCart.inBox) % inCart.inPackage !== 0
            ? Math.ceil(newQuantity * inCart.inBox)
            : parseInt(newQuantity * inCart.inBox);

        // Agar yangi ekrandagi quantity nolga teng bo‘lsa, o‘chiramiz
        if (newDisplayedQty <= 0) {
          state.items.splice(itemIndex, 1);
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCart,
  setUserInfo,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
