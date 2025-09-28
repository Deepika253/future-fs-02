import React, { useState } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";

import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Cart from "./components/Cart";
import CheckoutForm from "./components/CheckoutForm";
import OrderHistory from "./components/OrderHistory";
import LoginForm from "./components/LoginForm";

function MainApp() {
  const { state, dispatch, ACTIONS } = useStore();
  const { products, search, filterCategory, user, productModal } = state;

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // Apply search and category filter
  const displayedProducts = products.filter((product) => {
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onShowCart={setShowCart} onShowLogin={setShowLogin} />

      <header className="bg-white py-2 px-4 shadow flex flex-wrap justify-center space-x-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded ${
              filterCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() =>
              dispatch({ type: ACTIONS.SET_FILTER_CATEGORY, payload: cat })
            }
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
        {user && (
          <button
            onClick={() => setShowOrders((flag) => !flag)}
            className="ml-auto bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            {showOrders ? "Hide Orders" : "My Orders"}
          </button>
        )}
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto">
        {showOrders && <OrderHistory />}

        {!showOrders && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No products found.
              </p>
            )}
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      {productModal && <ProductModal />}

      {showCart && (
        <Cart
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
            setOrderPlaced(null);
          }}
        />
      )}

      {showCheckout && !orderPlaced && (
        <CheckoutForm
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={(order) => {
            setOrderPlaced(order);
          }}
        />
      )}

      {orderPlaced && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 p-6"
          onClick={() => setOrderPlaced(null)}
          role="alertdialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded p-6 max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
            <p className="mb-4">
              Thank you for your purchase,{" "}
              <strong>{orderPlaced.user.name}</strong>.
            </p>
            <p className="mb-4">Order ID: {orderPlaced.id}</p>
            <p className="mb-4">
              Total Amount Paid: ${orderPlaced.total.toFixed(2)}
            </p>
            <button
              onClick={() => setOrderPlaced(null)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
