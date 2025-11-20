


import { FILE_URL } from '@/constants/keys';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fileApi = createApi({
    reducerPath: 'fileApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${FILE_URL}/api/v1/file`,
    }),

    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (credentials) => ({
                url: '/upload-files',
                method: 'POST',
                body: credentials,
            }),
        }),

    }),
});

export const {
    useUploadFileMutation,
} = fileApi;
