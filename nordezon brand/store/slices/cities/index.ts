// store/citySlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cities: []
}

const citySlice = createSlice({
    name: 'cities',
    initialState,
    reducers: {
        setCityList: (state, action) => {
            state.cities = action.payload;
        }

    },
})

export const {
    setCityList
} = citySlice.actions
export default citySlice.reducer
