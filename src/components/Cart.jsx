import React from "react";
import { useStore } from "../context/StoreContext";

export default function Cart({ onClose, onCheckout }) {
  const { state, dispatch, ACTIONS } = useStore();
  const { cart, products } = state;

  const cartItems = Object.entries(cart).map(([productId, qty]) => {
    const product = products.find((p) => p.id === productId);
    return { product, qty };
  });

  const updateQty = (productId, qty) => {
    dispatch({
      type: ACTIONS.UPDATE_CART_QTY,
      payload: { productId, quantity: qty },
    });
  };

  const removeItem = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: { productId } });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-lg w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          <>
            <ul>
              {cartItems.map(({ product, qty }) => (
                <li
                  key={product.id}
                  className="flex items-center mb-4 space-x-4"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.title}</h3>
                    <div className="text-sm text-gray-600">
                      ${product.price.toFixed(2)}
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={qty}
                    onChange={(e) =>
                      updateQty(
                        product.id,
                        Math.max(1, Math.min(99, Number(e.target.value)))
                      )
                    }
                    className="w-16 border rounded px-2 py-1"
                    aria-label={`Quantity for ${product.title}`}
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${product.title} from cart`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-between items-center font-bold text-lg">
              <span>Total: ${totalPrice.toFixed(2)}</span>
              <div>
                <button
                  onClick={onClose}
                  className="mr-2 px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Close
                </button>
                <button
                  onClick={onCheckout}
                  className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
