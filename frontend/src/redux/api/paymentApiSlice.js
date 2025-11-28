import { apiSlice } from "./apiSlice";
import { BASE_URL } from "../constants";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRazorpayKey: builder.query({
      query: () => ({
        url: `${BASE_URL}/api/payment/razorpay-key`,
      }),
    }),
    createRazorpayOrder: builder.mutation({
      query: (body) => ({
        url: `${BASE_URL}/api/payment/create-razorpay-order`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetRazorpayKeyQuery, useCreateRazorpayOrderMutation } =
  paymentApiSlice;


