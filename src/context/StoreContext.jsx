import React, { createContext, useReducer, useContext, useEffect } from "react";

// --- Initial state ---

const initialState = {
  products: [], // product list
  cart: {}, // { productId: quantity }
  user: null, // {id, name, email} (null if logged out)
  orders: [], // saved orders
  search: "",
  filterCategory: "all",
  productModal: null, // product object for modal or null
};

// --- Actions ---

const ACTIONS = {
  SET_PRODUCTS: "SET_PRODUCTS",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  UPDATE_CART_QTY: "UPDATE_CART_QTY",
  CLEAR_CART: "CLEAR_CART",
  SET_USER: "SET_USER",
  LOGOUT: "LOGOUT",
  ADD_ORDER: "ADD_ORDER",
  SET_SEARCH: "SET_SEARCH",
  SET_FILTER_CATEGORY: "SET_FILTER_CATEGORY",
  SET_PRODUCT_MODAL: "SET_PRODUCT_MODAL",
};

// --- Reducer ---

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PRODUCTS:
      return { ...state, products: action.payload };
    case ACTIONS.ADD_TO_CART: {
      const { productId } = action.payload;
      const currentQty = state.cart[productId] || 0;
      return { ...state, cart: { ...state.cart, [productId]: currentQty + 1 } };
    }
    case ACTIONS.REMOVE_FROM_CART: {
      const cartCopy = { ...state.cart };
      delete cartCopy[action.payload.productId];
      return { ...state, cart: cartCopy };
    }
    case ACTIONS.UPDATE_CART_QTY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        const cartCopy = { ...state.cart };
        delete cartCopy[productId];
        return { ...state, cart: cartCopy };
      }
      return { ...state, cart: { ...state.cart, [productId]: quantity } };
    }
    case ACTIONS.CLEAR_CART:
      return { ...state, cart: {} };
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.LOGOUT:
      return { ...state, user: null };
    case ACTIONS.ADD_ORDER:
      return { ...state, orders: [...state.orders, action.payload] };
    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    case ACTIONS.SET_FILTER_CATEGORY:
      return { ...state, filterCategory: action.payload };
    case ACTIONS.SET_PRODUCT_MODAL:
      return { ...state, productModal: action.payload };
    default:
      return state;
  }
}

// --- Context ---

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load products on mount (from mock data)
  useEffect(() => {
    import("../data/products").then((module) => {
      dispatch({ type: ACTIONS.SET_PRODUCTS, payload: module.products });
    });
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch, ACTIONS }}>
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook for using store
export function useStore() {
  return useContext(StoreContext);
}
