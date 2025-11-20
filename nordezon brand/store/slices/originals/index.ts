// store/originals.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    originalsList: [],
    originalsMetaData: {},
    originals: {} as any,
    originalsId: 0,
}

const originalsSlice = createSlice({
    name: 'originalsSlice',
    initialState,
    reducers: {
        setOriginalList: (state, action) => {
            state.originalsList = action.payload;
        },
        setOriginalsMetaData: (state, action) => {
            state.originalsMetaData = action.payload;
        },

        setOriginals: (state, action) => {
            state.originals = action.payload;
        },
        setOrignalsId: (state, action) => {
            state.originalsId = action.payload;
            console.log("action", action.payload);
            
        },

        updateOriginalsQuantity: (state, action) => {
            const { id, quantity } = action.payload;

            const product = state.originals?.postOriginals.find(
                (item: any) => item.id == id
            );

            if (product) {
                product.quantity = quantity;
            }
        }


    },
})

export const {
    setOriginalList,
    setOriginalsMetaData,
    setOriginals,
    setOrignalsId,
    updateOriginalsQuantity,
} = originalsSlice.actions
export default originalsSlice.reducer
