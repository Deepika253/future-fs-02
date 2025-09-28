import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function ProductModal() {
  const { state, dispatch, ACTIONS } = useStore();
  const product = state.productModal;

  const [qty, setQty] = useState(1);

  if (!product) return null;

  const closeModal = () => {
    dispatch({ type: ACTIONS.SET_PRODUCT_MODAL, payload: null });
  };

  const addToCart = () => {
    for (let i = 0; i < qty; i++) {
      dispatch({
        type: ACTIONS.ADD_TO_CART,
        payload: { productId: product.id },
      });
    }
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover rounded mb-4"
        />

        <p className="mb-4 text-gray-700">{product.description}</p>

        <div className="mb-4 font-bold text-xl">
          ₹{product.price.toFixed(2)}
        </div>

        <div className="flex items-center space-x-4">
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              max="99"
              className="ml-2 px-2 py-1 border rounded w-16"
              value={qty}
              onChange={(e) =>
                setQty(Math.max(1, Math.min(99, Number(e.target.value))))
              }
            />
          </label>
          <button
            onClick={addToCart}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
