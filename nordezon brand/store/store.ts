// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { adsApi } from './api/v1/ads';
import { authApi } from './api/v1/auth';
import { cartApi } from './api/v1/cart';
import { categoriesApi } from './api/v1/categories';
import { citiesApi } from './api/v1/cites';
import { commentsApi } from './api/v1/comments';
import { dashboardApi } from './api/v1/dashboard';
import { fileApi } from './api/v1/files';
import { likesApi } from './api/v1/likes';
import { ordersApi } from './api/v1/orders';
import { originalsApi } from './api/v1/originals';
import { postApi } from './api/v1/post';
import { reviewsApi } from './api/v1/reviews';
import { userApi } from './api/v1/user';
import adsSlice from './slices/ads';
import cartSlice from './slices/cart';
import chatSlice from './slices/chat';
import citySlice from './slices/cities';
import orderSlice from './slices/orders';
import originalsSlice from './slices/originals';
import postSlice from './slices/post';
import reviewsSlice from './slices/reviews';
import uiSlice from './slices/ui';
import userSlice from './slices/user';
export const store = configureStore({
    reducer: {
        user: userSlice,
        cart: cartSlice,
        reviews: reviewsSlice,
        ui: uiSlice,
        chat: chatSlice,
        ads: adsSlice,
        order: orderSlice,
        post: postSlice,
        city: citySlice,
        originals: originalsSlice,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [adsApi.reducerPath]: adsApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [ordersApi.reducerPath]: ordersApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
        [citiesApi.reducerPath]: citiesApi.reducer,
        [likesApi.reducerPath]: likesApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [fileApi.reducerPath]: fileApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [reviewsApi.reducerPath]: reviewsApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [originalsApi.reducerPath]: originalsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            fileApi.middleware,
            categoriesApi.middleware,
            postApi.middleware,
            likesApi.middleware,
            commentsApi.middleware,
            ordersApi.middleware,
            userApi.middleware,
            dashboardApi.middleware,
            citiesApi.middleware,
            adsApi.middleware,
            reviewsApi.middleware,
            cartApi.middleware,
            originalsApi.middleware,
        ),

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
