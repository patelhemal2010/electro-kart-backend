import { apiSlice } from './apiSlice';

const VISUAL_SEARCH_URL = '/api/visual-search';

export const visualSearchApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    visualSearch: builder.mutation({
      query: (formData) => ({
        url: `${VISUAL_SEARCH_URL}/search`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['VisualSearch'],
    }),
    getVisualSearchSuggestions: builder.query({
      query: () => `${VISUAL_SEARCH_URL}/suggestions`,
      providesTags: ['VisualSearch'],
    }),
    updateProductFeatures: builder.mutation({
      query: (productId) => ({
        url: `${VISUAL_SEARCH_URL}/update-features/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['VisualSearch'],
    }),
  }),
});

export const {
  useVisualSearchMutation,
  useGetVisualSearchSuggestionsQuery,
  useUpdateProductFeaturesMutation,
} = visualSearchApiSlice;
