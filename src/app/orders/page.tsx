"use client";

import { AnimatePresence, AnimationProps, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";

interface Order {
  id: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  discountedPrice: number | null;
  couponCode: string | null;
  products: string[];
}

export default function Page() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Fetches the user's recent orders from the server and updates the state with the response data.
     * If the response is not an array, logs an error and sets the orders state to an empty array.
     * If an error occurs during the fetch, logs the error and sets the orders state to an empty array.
     * Finally, sets the isLoading state to false to indicate that the data has been fetched.
     */
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Received non-array data:", data);
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const initialAnimation: AnimationProps["initial"] = {
    opacity: 0,
    filter: "blur(5px)",
  };

  const finalAnimation: AnimationProps["animate"] = {
    opacity: 1,
    filter: "blur(0px)",
  };

  const exitAnimation: AnimationProps["exit"] = {
    opacity: 0,
    filter: "blur(5px)",
  };

  return (
    <div className="w-full min-h-dvh p-3 pt-[72px] flex flex-col gap-2">
      <h2 className="font-bold text-3xl">Recent Orders</h2>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading-orders"
            initial={initialAnimation}
            animate={finalAnimation}
            exit={exitAnimation}
            className="w-full p-3 flex justify-center items-center"
          >
            <BiLoaderCircle className="animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="orders-table"
            initial={initialAnimation}
            animate={finalAnimation}
            exit={exitAnimation}
            className="__orders_container rounded-md p-3 h-full flex-grow overflow-y-auto bg-black/5"
          >
            <table className="w-full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Discounted Price</th>
                  <th>Coupon Code</th>
                  <th>Products</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-3">{order.id}</td>
                      <td className="p-3">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">₹{String(order.totalPrice)}</td>
                      <td className="p-3">
                        {order.discountedPrice
                          ? `${order.discountedPrice.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="p-3">{order.couponCode || "N/A"}</td>
                      <td className="p-3">{order.products.join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
