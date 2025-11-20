// store/citySlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    reviews: [],
    reviewMetaData:{},
}

const reviewsSlice = createSlice({
    name: 'reviewsSlice',
    initialState,
    reducers: {
        setReviewsList: (state, action) => {
            state.reviews = action.payload;
        },
        setReviewsMetaData: (state, action) => {
            state.reviewMetaData = action.payload;
        },

    },
})

export const {
    setReviewsList,
    setReviewsMetaData,
} = reviewsSlice.actions
export default reviewsSlice.reducer
