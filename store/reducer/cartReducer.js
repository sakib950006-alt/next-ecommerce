import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  Products: [],
};

export const cartReducer = createSlice({
  name: "cartStore",
  initialState,
  reducers: {
    addInToCart: (state, action) => {
      const payload = action.payload;
      const index = state.Products.findIndex(
        (product) =>
          product.productId === payload.productId &&
          product.variantId === payload.variantId
      );

      if (index < 0) {
        state.Products.push(payload);
        state.count = state.Products.length;
      }
    },

    increaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const index = state.Products.findIndex(
        (product) =>
          product.productId === productId &&
          product.variantId === variantId
      );
      if (index >= 0) {
        state.Products[index].qty += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId, variantId } = action.payload;
      const index = state.Products.findIndex(
        (product) =>
          product.productId === productId &&
          product.variantId === variantId
      );
      if (index >= 0 && state.Products[index].qty > 1) {
        state.Products[index].qty -= 1;
      }
    },

    removeFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.Products = state.Products.filter(
        (product) =>
          !(product.productId === productId && product.variantId === variantId)
      );
      state.count = state.Products.length;
    },

    clearCart: (state) => {
      state.Products = [];
      state.count = 0;
    },
  },
});

export const {
  addInToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartReducer.actions;

export default cartReducer.reducer;
