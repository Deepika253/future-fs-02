import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

const initialForm = {
  name: "",
  email: "",
  address: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function CheckoutForm({ onClose, onOrderPlaced }) {
  const { state, dispatch, ACTIONS } = useStore();
  const { cart, products, user } = state;

  const [formData, setFormData] = useState(() => ({
    ...initialForm,
    name: user ? user.name : "",
    email: user ? user.email : "",
  }));

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const cartItems = Object.entries(cart).map(([productId, qty]) => {
    const product = products.find((p) => p.id === productId);
    return { product, qty };
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );

  if (cartItems.length === 0)
    return (
      <div className="p-6">
        <p>Your cart is empty!</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 rounded border">
          Close
        </button>
      </div>
    );

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email is invalid";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.cardNumber.trim() || !/^\d{16}$/.test(formData.cardNumber))
      errs.cardNumber = "Card number must be 16 digits";
    if (!formData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiry))
      errs.expiry = "Expiry date must be MM/YY";
    if (!formData.cvv.trim() || !/^\d{3}$/.test(formData.cvv))
      errs.cvv = "CVV must be 3 digits";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    // Simulate payment delay
    setTimeout(() => {
      const order = {
        id: Date.now().toString(),
        user: user || { name: formData.name, email: formData.email },
        items: cartItems,
        total: totalPrice,
        date: new Date().toISOString(),
        shippingAddress: formData.address,
      };

      dispatch({ type: ACTIONS.ADD_ORDER, payload: order });
      dispatch({ type: ACTIONS.CLEAR_CART });

      if (!user) {
        dispatch({
          type: ACTIONS.SET_USER,
          payload: {
            id: order.user.email,
            name: order.user.name,
            email: order.user.email,
          },
        });
      }

      setLoading(false);
      onOrderPlaced(order);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-auto"
      >
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <div className="mb-2">
          <label htmlFor="name" className="block font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="block font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="address" className="block font-semibold">
            Shipping Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            rows={3}
          />
          {errors.address && (
            <p className="text-red-600 text-sm">{errors.address}</p>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="cardNumber" className="block font-semibold">
            Card Number
          </label>
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            maxLength={16}
            value={formData.cardNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="1234123412341234"
          />
          {errors.cardNumber && (
            <p className="text-red-600 text-sm">{errors.cardNumber}</p>
          )}
        </div>

        <div className="flex space-x-4 mb-2">
          <div className="flex-1">
            <label htmlFor="expiry" className="block font-semibold">
              Expiry (MM/YY)
            </label>
            <input
              id="expiry"
              name="expiry"
              type="text"
              maxLength={5}
              value={formData.expiry}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.expiry ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="12/24"
            />
            {errors.expiry && (
              <p className="text-red-600 text-sm">{errors.expiry}</p>
            )}
          </div>

          <div className="flex-1">
            <label htmlFor="cvv" className="block font-semibold">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              maxLength={3}
              value={formData.cvv}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="123"
            />
            {errors.cvv && <p className="text-red-600 text-sm">{errors.cvv}</p>}
          </div>
        </div>

        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total: ₹{totalPrice.toFixed(2)}</span>
          <div>
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 rounded border hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
