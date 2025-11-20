// store/citySlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartList: [],
}

const cartSlice = createSlice({
    name: 'cartSlice',
    initialState,
    reducers: {
        setCartList: (state, action) => {
            state.cartList = action.payload;
        },

        removeCartItem: (state, action) => {
            state.cartList = state.cartList.filter((item: any) => item.id !== action.payload);
        },
        updateCartQuantity: (state, action) => {
            const { id, quantity } = action.payload;

            let item: any = state.cartList.find((i: any) => i.id == id);
            if (item) {
                item.quantity = quantity;   // update quantity directly
            }
        }

    },
})

export const {
    updateCartQuantity,
    setCartList,
    removeCartItem,
} = cartSlice.actions
export default cartSlice.reducer
