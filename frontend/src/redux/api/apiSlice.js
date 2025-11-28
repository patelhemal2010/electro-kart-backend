import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ 
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const userInfo = state.auth?.userInfo;
    
    if (userInfo?.token) {
      headers.set('authorization', `Bearer ${userInfo.token}`);
    }
    
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category", "Chatbot", "VisualSearch"],
  endpoints: () => ({}),
});
