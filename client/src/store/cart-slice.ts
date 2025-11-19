import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartProduct {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
}

interface CartState {
  products: CartProduct[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  products: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<{ product: any; size: string; quantity: number }>) {
      const { product, size, quantity } = action.payload;
      const existingProduct = state.products.find(
        (p) => p._id === product._id && p.size === size
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.products.push({
          _id: product._id,
          title: product.title,
          price: product.price,
          quantity,
          size,
        });
      }

      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter((p) => p._id !== action.payload);
      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    updateProductQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const product = state.products.find((p) => p._id === action.payload.productId);
      if (product) {
        product.quantity = action.payload.quantity;
      }
      state.totalQuantity = state.products.reduce((acc, p) => acc + p.quantity, 0);
      state.totalPrice = state.products.reduce(
        (acc, p) => acc + p.price * p.quantity,
        0
      );
    },

    clearCart(state) {
      state.products = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addProduct, removeProduct, updateProductQuantity, clearCart } = cartSlice.actions;
export default cartSlice;
