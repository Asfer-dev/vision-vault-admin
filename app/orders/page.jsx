"use client";

import PageLayout from "@app/PageLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

export default function Orders() {
  const { data: session } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/order");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (!session) {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, []);
  return (
    <PageLayout>
      <h1 className="page-heading">Orders</h1>
      {loading ? (
        <div className="my-8 flex flex-col gap-4 items-center">
          <MoonLoader color="#404040" />
          <p className="text-neutral-700 font-medium">Loading Orders</p>
        </div>
      ) : (
        <table className="basic">
          <thead>
            <tr>
              <td>Date</td>
              <td>Paid</td>
              <td>Recipient</td>
              <td>Products</td>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  {order.paid ? (
                    <span className="text-green-500">YES</span>
                  ) : (
                    <span className="text-red-500">NO</span>
                  )}
                </td>
                <td>
                  {order.name} {order.email}
                  <br />
                  {order.city} {order.postal} {order.country}
                  <br />
                  {order.address}
                </td>
                <td>
                  {order.line_items.map((item) => (
                    <div>
                      {item.price_data.product_data.name +
                        " X " +
                        item.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageLayout>
  );
}
