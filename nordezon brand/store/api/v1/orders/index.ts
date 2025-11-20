import { API_URL, APP_API_KEY } from '@/constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/order`,

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
        getOrderListByBrand: builder.query({
            query: (param) => ({
                url: `/get-order-list-by-brand?page=${param.page}&status=${param.status}`,
                method: 'GET',
            }),
        }),

        updateOrderStatus: builder.mutation({
            query: (credentials) => ({
                url: '/update-order-status',
                method: 'POST',
                body: credentials,
            }),
        }),

        /* --- Place the Order ---*/
        placeOrderByUser: builder.mutation({
            query: (credentials) => ({
                url: '/place-order',
                method: 'POST',
                body: credentials,
            }),
        }),


        /* --- Get the Order group detail  ---*/
        getOrderGroupById: builder.query({
            query: (param) => ({
                url: `/get-order-group-by-id?orderId=${param.orderId}`,
                method: 'GET',
            }),
        }),


        /* --- Get the Order group List  ---*/
        getOrderGroupListByUserId: builder.query({
            query: (param) => ({
                url: `/get-order-group-list-by-user?page=${param.page}&status=${param.status}`,
                method: 'GET',
            }),
        }),



    }),
});

export const {
    useGetOrderListByBrandQuery,
    useUpdateOrderStatusMutation,
    usePlaceOrderByUserMutation, /* ---- placeOrderByUser (endPoint: /place-order) ---*/
    useGetOrderGroupByIdQuery,  /* ---- getOrderGroupById (endPoint: /get-order-group-by-id) ---*/
    useGetOrderGroupListByUserIdQuery,  /* ---- getOrderGroupListByUserId (endPoint: /get-order-group-list-by-user) ---*/

} = ordersApi;
