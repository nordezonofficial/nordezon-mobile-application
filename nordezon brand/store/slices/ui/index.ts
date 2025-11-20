// store/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showFilteration: false
}

const uiSlice = createSlice({
    name: 'uiSlice',
    initialState,
    reducers: {
        setShowFilteration: (state, action) => {
            state.showFilteration = action.payload;
        }

    },
})

export const { setShowFilteration } = uiSlice.actions
export default uiSlice.reducer
