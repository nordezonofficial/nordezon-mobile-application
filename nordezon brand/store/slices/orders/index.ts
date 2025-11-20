// store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderList: [] as any,
    orderMetaData: {},
    order: {},
    orderItems: [],
    orderId: 0,
    orderTracking: {},
}

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {

        /* ---- Order List ---*/
        setOrderList: (state, action) => {
            state.orderList = action.payload;
        },

        setOrderMetaData: (state, action) => {
            state.orderMetaData = action.payload;
        },

        setOrder: (state, action) => {
            state.order = action.payload
        },

        setOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            state.orderList = state.orderList.map((item: any) =>
                item.id === orderId ? { ...item, status } : item
            );
        },

        //* --- set Order Id for Detail ---*//
        setOrderId: (state, action) => {
            state.orderId = action.payload
        },

        /* --- set Order item --- */
        setOrderItemsList: (state, action) => {
            state.orderItems = action.payload;
        },
        /* ---- Set Order Track item ---*/
        setOrderTracking: (state, action) => {
            // let orderItemByOrderId = state.orderList.find((item: any) => item.id == action.payload);
            // state.orderTracking = orderItemByOrderId || null; // fallback in case not found
            state.orderTracking = action.payload; // fallback in case not found
        }


    },
})

export const {
    setOrderItemsList,
    setOrderTracking,
    setOrder,
    setOrderMetaData,
    setOrderList,
    setOrderStatus,
    setOrderId

} = orderSlice.actions
export default orderSlice.reducer
