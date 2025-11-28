import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "INR",
            locale: "en_IN",
            "buyer-country": "IN",
            "enable-funding": "card",
            components: "buttons,card-fields",
            commit: true,
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
            shipping: {
              address: {
                address_line_1: order.shippingAddress.address,
                admin_area_2: order.shippingAddress.city,
                admin_area_1: order.shippingAddress.state || "",
                postal_code: order.shippingAddress.postalCode,
                country_code:
                  (order.shippingAddress.country || "")
                    .toLowerCase()
                    .includes("india")
                    ? "IN"
                    : "IN",
              },
            },
          },
        ],
        application_context: {
          shipping_preference: "SET_PROVIDED_ADDRESS",
        },
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Messsage variant="danger">{error.data.message}</Messsage>
  ) : (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Order Items</h2>
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Image</th>
                    <th className="p-3 text-left text-sm font-semibold text-gray-600">Product</th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-600">Unit Price</th>
                    <th className="p-3 text-right text-sm font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-md object-cover ring-1 ring-gray-200"
                        />
                      </td>

                      <td className="p-3">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>

                      <td className="p-3 text-center">{item.qty}</td>
                      <td className="p-3 text-right">₹ {item.price.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium">
                        ₹ {(item.qty * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!order.isPaid && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold tracking-tight mb-4">Payment</h2>
            {loadingPay && <Loader />}
            {isPending ? (
              <Loader />
            ) : (
              <div className="rounded-md overflow-hidden">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                ></PayPalButtons>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold tracking-tight">Shipping</h2>
          <p className="mt-4 mb-3 text-sm text-gray-700">
            <strong className="text-pink-500">Order:</strong> {order._id}
          </p>

          <p className="mb-3 text-sm text-gray-700">
            <strong className="text-pink-500">Name:</strong>{" "}
            {order.user.username}
          </p>

          <p className="mb-3 text-sm text-gray-700">
            <strong className="text-pink-500">Email:</strong> {order.user.email}
          </p>

          <p className="mb-3 text-sm text-gray-700">
            <strong className="text-pink-500">Address:</strong>{" "}
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} {order.shippingAddress.postalCode},{" "}
            {order.shippingAddress.country}
          </p>

          <p className="mb-4 text-sm text-gray-700">
            <strong className="text-pink-500">Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          {order.isPaid ? (
            <Messsage variant="success">Paid on {order.paidAt}</Messsage>
          ) : (
            <Messsage variant="danger">Not paid</Messsage>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Items</span>
              <span className="font-medium">₹ {order.itemsPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹ {order.shippingPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">₹ {order.taxPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">₹ {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <button
              type="button"
              className="bg-pink-500 hover:bg-pink-600 transition-colors text-white w-full py-2 rounded-md"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
