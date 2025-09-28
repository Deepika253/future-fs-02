import React, { useState } from "react";
import { useStore } from "../context/StoreContext";

export default function LoginForm({ onClose }) {
  const { dispatch, ACTIONS } = useStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);

  const login = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (isRegister && !name.trim()) {
      setError("Name is required");
      return;
    }
    // Simulated login/register
    dispatch({
      type: ACTIONS.SET_USER,
      payload: {
        id: email,
        name: isRegister ? name : email.split("@")[0],
        email,
      },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-sm w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginTitle"
      >
        <h2 id="loginTitle" className="text-xl font-bold">
          {isRegister ? "Register" : "Login"}
        </h2>
        {error && <p className="text-red-600">{error}</p>}

        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <button
            onClick={login}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            onClick={() => {
              setIsRegister((flag) => !flag);
              setError(null);
            }}
            className="text-indigo-700 underline"
          >
            {isRegister ? "Back to Login" : "Create Account"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-2 w-full border rounded py-1 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
