import { API_URL, APP_API_KEY } from '@/constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/dashboard`,
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
        getDashboardAnalytics: builder.query({
            query: (credentials) => ({
                url: '/dashboard-analytics',
                method: 'GET',
            }),
        }),

    }),
});

export const {
    useGetDashboardAnalyticsQuery
} = dashboardApi;
