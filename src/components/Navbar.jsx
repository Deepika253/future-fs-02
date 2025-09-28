import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function Navbar({ onShowCart, onShowLogin }) {
  const { state, dispatch, ACTIONS } = useStore();
  const { cart, user, search } = state;

  const totalQty = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleSearchChange = (e) => {
    dispatch({ type: ACTIONS.SET_SEARCH, payload: e.target.value });
  };

  const handleLogout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
  };

  return (
    <nav className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
      <div className="text-lg font-bold cursor-pointer select-none">
        MiniStore
      </div>

      <div className="flex-1 mx-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full rounded px-2 py-1 text-black"
        />
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div>Hello, {user.name}</div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => onShowLogin(true)}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
          >
            Login
          </button>
        )}

        <button onClick={() => onShowCart(true)} className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 3h2l.4 2M7 13h14l-1.35 6.25a1 1 0 01-.98.75H7a1 1 0 01-1-1v-7z" />
            <circle cx="7" cy="21" r="1" />
            <circle cx="17" cy="21" r="1" />
          </svg>
          {totalQty > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 rounded-full text-xs px-1">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
