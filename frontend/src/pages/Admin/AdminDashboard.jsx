import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FaDollarSign, FaUsers, FaShoppingBag } from "react-icons/fa";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },

        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center">
              <FaDollarSign className="text-xl" />
            </div>

            <p className="mt-5 text-gray-600">Sales</p>
            <h1 className="text-xl font-bold text-gray-900">
              ₹ {isLoading ? <Loader /> : sales?.totalSales?.toLocaleString() || 0}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center">
              <FaUsers className="text-xl" />
            </div>

            <p className="mt-5 text-gray-600">Customers</p>
            <h1 className="text-xl font-bold text-gray-900">
              {loading ? <Loader /> : customers?.filter(user => !user.isAdmin).length || 0}
            </h1>
          </div>
          <div className="rounded-lg bg-white p-5 w-[20rem] mt-5 shadow-md">
            <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center">
              <FaShoppingBag className="text-xl" />
            </div>

            <p className="mt-5 text-gray-600">All Orders</p>
            <h1 className="text-xl font-bold text-gray-900">
              {loadingTwo ? <Loader /> : orders?.totalOrders || 0}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
