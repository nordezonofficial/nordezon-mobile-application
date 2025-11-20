import { API_URL, APP_API_KEY } from '@/constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const originalsApi = createApi({
    reducerPath: 'originalsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/originals`,

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
        getOriginalsList: builder.query({
            query: (credential) => ({
                url: `/get-originals-list?page=${credential.page}`,
                method: 'GET',
            }),
        }),
        getOriginalsById: builder.query({
            query: (credential) => ({
                url: `/get-originals-by-id?id=${credential.id}`,
                method: 'GET',
            }),
        }),


    }),
});

export const {
    useGetOriginalsListQuery, /* ---- getOrignalsList (endPoint: /get-originals-list) ---*/
    useGetOriginalsByIdQuery, /* ---- getOriginalsById (endPoint: /get-originals-by-id) ---*/
} = originalsApi;

