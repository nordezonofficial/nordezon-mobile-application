// store/citySlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    ads: []
}

const adsSlice = createSlice({
    name: 'adsSlice',
    initialState,
    reducers: {
        setAdsList: (state, action) => {
            state.ads = action.payload;
        }

    },
})

export const {
    setAdsList
} = adsSlice.actions
export default adsSlice.reducer
