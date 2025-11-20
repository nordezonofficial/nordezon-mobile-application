// store/userSlice.ts
import { dashboard } from '@/constants/common';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboard: dashboard,
    user: {},
    accessToken: null,
    categories: [],
    notifications: [],
    unReadNotificationCount: 0,
    brandList: [],
    brandListMeta: [],
    brandListNotIn: [],
    brandListNotIntMeta: [],



}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /* --- user Data --- */
        setUser: (state, action) => {
            state.user = action.payload.user;

            state.accessToken = action.payload.accessToken;
        },
        setCategoriesList: (state, action) => {
            state.categories = action.payload;
        },

        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        },

        setOnAuthstateChangedUser: (state, action) => {

            state.user = action.payload;
            state.categories = action.payload.categories;

        },
        setNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        setUnReadNotificationCount: (state, action) => {
            state.unReadNotificationCount = action.payload;
        },

        setBrandList: (state, action) => {
            state.brandList = action.payload
        },
        setBrandListNotInIds: (state, action) => {
            state.brandListNotIn = action.payload
        },

        setBrandListMetaData: (state, action) => {
            state.brandListMeta = action.payload
        },
        setBrandListNotInMetaData: (state, action) => {
            state.brandListNotIntMeta = action.payload
        },
        setUserAdditionalFields: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload
            };
        }
    },
})

export const {
    setUserAdditionalFields,
    setUser,
    setCategoriesList,
    setDashboard,
    setOnAuthstateChangedUser,
    setNotifications,
    setUnReadNotificationCount,
    setBrandList,
    setBrandListNotInIds,
    setBrandListMetaData,
    setBrandListNotInMetaData



} = userSlice.actions
export default userSlice.reducer
