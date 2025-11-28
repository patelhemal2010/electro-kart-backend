import { apiSlice } from './apiSlice';

const CHATBOT_URL = '/api/chatbot';

export const chatbotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Chat with AI bot
    chatWithBot: builder.mutation({
      query: (data) => ({
        url: `${CHATBOT_URL}/chat`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Chatbot'],
    }),

    // Get conversation history
    getChatHistory: builder.query({
      query: (userId) => `${CHATBOT_URL}/history/${userId}`,
      providesTags: ['Chatbot'],
    }),

    // Clear conversation history
    clearChatHistory: builder.mutation({
      query: (userId) => ({
        url: `${CHATBOT_URL}/history/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chatbot'],
    }),

    // Get chatbot suggestions
    getChatbotSuggestions: builder.query({
      query: () => `${CHATBOT_URL}/suggestions`,
      providesTags: ['Chatbot'],
    }),
  }),
});

export const {
  useChatWithBotMutation,
  useGetChatHistoryQuery,
  useClearChatHistoryMutation,
  useGetChatbotSuggestionsQuery,
} = chatbotApiSlice;
