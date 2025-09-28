import React from "react";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const { dispatch, ACTIONS } = useStore();

  const openModal = () => {
    dispatch({ type: ACTIONS.SET_PRODUCT_MODAL, payload: product });
  };

  return (
    <div
      className="border rounded shadow hover:shadow-lg cursor-pointer flex flex-col"
      onClick={openModal}
    >
      <img
        src={product.image}
        alt={product.title}
        className="h-48 w-full object-cover rounded-t"
      />
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="flex-1 text-sm mt-1 text-gray-600">
          {product.description}
        </p>
        <div className="mt-2 font-bold">₹{product.price.toFixed(2)}</div>
      </div>
    </div>
  );
}
