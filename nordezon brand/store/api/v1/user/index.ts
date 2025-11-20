import { API_URL, APP_API_KEY } from '@/constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/user`,

        prepareHeaders: async (headers) => {
            const token = await AsyncStorage.getItem('@access_token');
            const country = await AsyncStorage.getItem('country');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            if (country) {
                headers.set('X-Country', country);
            }

            headers.set('X-App-Key', APP_API_KEY);
            headers.set('Accept', 'application/json');
            headers.set('Content-Type', 'application/json');

            return headers;
        },
    }),

    endpoints: (builder) => ({
        createUser: builder.mutation({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        userLogin: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        verifyOTP: builder.mutation({
            query: (credentials) => ({
                url: '/verified-email',
                method: 'POST',
                body: credentials,
            }),
        }),
        resentOTP: builder.mutation({
            query: (credentials) => ({
                url: '/resent-otp',
                method: 'POST',
                body: credentials,
            }),
        }),
        changePassword: builder.mutation({
            query: (credentials) => ({
                url: '/change-password',
                method: 'POST',
                body: credentials,
            }),
        }),

        getCategoriestList: builder.query({
            query: (credentials) => ({
                url: '/get-categoriest-list',
                method: 'GET',
            })
        }),
        setUpUserProfile: builder.mutation({
            query: (credentials) => ({
                url: '/update-personal-info',
                method: 'POST',
                body: credentials
            }),
        }),
        onAuthStateChanged: builder.mutation({
            query: (credentials) => ({
                url: '/on-auth-state-change',
                method: 'POST',
                body: credentials
            }),
        }),

        getNotificationList: builder.query({
            query: (credentials) => ({
                url: `/get-notification-list?page=${credentials.page}`,
                method: 'GET',
            }),
        }),

        /* =-=-=-=-=- GET USER/BRAND BY CATEGORIEST ====-=-=-=-=*/
        getBrandListByUserCategories: builder.query({
            query: (credentials) => ({
                url: `/get-user-by-categories?page=${credentials.page}`,
                method: 'GET',
            }),
        }),
        /* =-=-=-=-=- GET USER/BRAND BY CATEGORIEST ====-=-=-=-=*/
        getBrandListNotInIdsByUserCategories: builder.query({
            query: (credentials) => ({
                url: `/get-user-by-categories?page=${credentials.page}${credentials.notIn?.map((id: number) => `&notIn=${id}`).join('') || ''}`,
                method: 'GET',
            }),
        }),


        /* ==== Update User Address =====*/
        updateUserAddress: builder.mutation({
            query: (credentials) => ({
                url: `/update-user-address`,
                method: 'POST',
                body: credentials,
            }),
        })


    }),
});

export const {
    useGetNotificationListQuery,
    useResentOTPMutation,
    useOnAuthStateChangedMutation,
    useVerifyOTPMutation,
    useCreateUserMutation,
    useUserLoginMutation,
    useChangePasswordMutation,
    useGetCategoriestListQuery,
    useSetUpUserProfileMutation,
    useGetBrandListByUserCategoriesQuery,
    useGetBrandListNotInIdsByUserCategoriesQuery,
    useUpdateUserAddressMutation,   /* ---updateUserAddress (endPoint: /update-user-address) ----*/


} = userApi;
