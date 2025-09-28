import React from "react";
import { useStore } from "../context/StoreContext";

export default function OrderHistory() {
  const { state } = useStore();
  const { orders, user } = state;

  if (!user)
    return <p className="p-4">Please login to view your order history.</p>;

  const userOrders = orders.filter((order) => order.user.email === user.email);

  if (userOrders.length === 0) {
    return <p className="p-4">No orders found.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <ul className="space-y-6">
        {userOrders.map((order) => (
          <li
            key={order.id}
            className="border rounded p-4 shadow-sm bg-white"
            aria-label={`Order placed on ${new Date(
              order.date
            ).toLocaleString()} with total $${order.total.toFixed(2)}`}
          >
            <div className="mb-2 font-semibold">
              Order placed: {new Date(order.date).toLocaleString()}
            </div>
            <div className="mb-2">
              Shipping Address:{" "}
              <span className="font-normal">{order.shippingAddress}</span>
            </div>
            <ul className="mb-2">
              {order.items.map(({ product, qty }) => (
                <li key={product.id} className="flex justify-between">
                  <span>
                    {product.title} x {qty}
                  </span>
                  <span>${(product.price * qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold">
              Total: ${order.total.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
