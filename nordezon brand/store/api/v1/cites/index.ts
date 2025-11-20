import { API_URL } from '@/constants/keys';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const citiesApi = createApi({
    reducerPath: 'citiesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/city`,
    }),

    endpoints: (builder) => ({
        getCitiesList: builder.query({
            query: () => ({
                url: '/get-all-cities',
                method: 'GET',
            }),
        }),


    }),
});

export const {
    useGetCitiesListQuery
} = citiesApi;
