import { API_URL, APP_API_KEY } from '@/constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/v1/post`,

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
        /* --- create post by the brand ----*/
        createPost: builder.mutation({
            query: (credentials) => ({
                url: '/create',
                method: 'POST',
                body: credentials,
            }),
        }),

        /* --- update post by the brand ----*/
        updatePost: builder.mutation({
            query: (credentials) => ({
                url: `/update?id=${credentials.id}`,
                method: 'PUT',
                body: credentials,
            }),
        }),

        /* --- get post list by the brand ---- */
        getPostList: builder.query({
            query: (param) => ({
                url: `/get-all-post-by-brand?page=${param.page}&search=${param.search}&type=${param.type}`,
                method: 'GET',
            }),
        }),

        /* --- delete post by the brand ----*/
        deletePost: builder.mutation({
            query: (credentials) => ({
                url: `/delete?id=${credentials}`,
                method: 'DELETE',
            }),
        }),

        /* ==== GET all Post/stories/catalogue/product By shopper ====*/
        getAllPostList: builder.query({
            query: (param) => ({
                url: `/get-all-posts?page=${param.page}&search=${param.search}&type=${param.type}&request=${param.request}`,
                method: 'GET',
            }),
        }),


        /* ===== Get post Detail By Post/catalogue/reels/stories Id ===*/
        getPostDetailByPostId: builder.query({
            query: (param) => ({
                url: `/get-post-by-id?postId=${param.postId}&commentLikes=${param.commentLikesCount}`,
                method: 'GET',
            }),
        }),

        /* ==== GET all Post/stories/catalogue/product By shopper ====*/
        getPostListByBrandId: builder.query({
            query: (param) => ({
                url: `/get-all-post-by-brand-by-id?page=${param.page}&userId=${param.userId}`,
                method: 'GET',
            }),
        }),
        /* ==== GET all Home Feeds ====*/
        getHomeFeeds: builder.query({
            query: (param) => ({
                url: `/get-all-posts?page=${param.page}&request=${param.request}&includeReviews=${param.includeReviews}`,
                method: 'GET',
            }),
        }),


    }),
});

export const {

    useCreatePostMutation,
    useUpdatePostMutation,
    useGetPostListQuery,
    useGetAllPostListQuery,
    useDeletePostMutation,
    useGetPostDetailByPostIdQuery, /* --- getPostDetailByPostId (endpoint: get-post-by-id) ---*/
    useGetPostListByBrandIdQuery, /* ---- getPostListByBrandId (endpoint: get-all-post-by-brand-by-id) --*/
    useGetHomeFeedsQuery,  /* ---- getHomeFeeds (endpoint: get-all-posts) --*/
} = postApi;
