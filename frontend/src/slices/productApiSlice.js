import { PRODUCTS_URL, UPLOAD_URL, USERS_URL } from "../constant";
import { apiSlice } from "./apiSlice"; 

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: ({pageNumber, keyword}) => ({
                url: PRODUCTS_URL,
                params: {
                    pageNumber,
                    keyword
                }
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`
            }),
            keepUnusedDataFor: 5
        }),
        createProduct: builder.mutation({
            query: (product) => ({
                url: PRODUCTS_URL,
                method: 'POST',
                body: product
            }),
            invalidatesTags: ['Product']
        }),
        updateProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCTS_URL}/${product.productId}`,
                method: 'PUT',
                body: product
            }),
            invalidatesTags: ['Products']
        }),
        uploadProductImage: builder.mutation({
            query: (body) => ({
                url: UPLOAD_URL,
                method: 'POST',
                body
            })
        }),
        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Products']
        }),
        reviewProduct: builder.mutation({
            query: (review) => ({
                url: `${PRODUCTS_URL}/${review.productId}/reviews`,
                method: 'POST',
                body: review
            }),
            invalidatesTags: ['Product']
        })
    })
});

export const { 
    useGetProductsQuery, 
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
    useDeleteProductMutation,
    useReviewProductMutation
} = productsApiSlice;