import { API_URL } from '@/constants/keys';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/auth`,
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


      

    }),
});

export const {
    useResentOTPMutation,
    useVerifyOTPMutation,
    useCreateUserMutation,
    useUserLoginMutation,
} = authApi;
