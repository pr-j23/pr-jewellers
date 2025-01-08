import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import classNames from "classnames";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Category from "./pages/Category";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CategoryProducts from "./pages/CategoryProducts";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import { useGlobalValue } from "./context/GlobalContext";
import { fetchProductsRequest } from "./redux/reducers/productsSlice";
import { updatePrices } from "./redux/reducers/metalPricesSlice";
import PopupModal from "./components/shared/PopupModal";

let ws;
let reconnectInterval = 30000; // 30 seconds for reconnection
let isReconnecting = false; // Prevent multiple reconnection attempts

const myWebSocket = (callback) => {
  // Create a WebSocket connection
  ws = new WebSocket("wss://pj-scrapper-fgst.onrender.com");

  // Handle the connection opening
  ws.onopen = () => {
    console.log("WebSocket connection established.");
    isReconnecting = false; // Reset reconnection flag
  };

  // Handle incoming messages from the server
  ws.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event?.data);
      callback({
        gold: Math.floor(Number(parsedData?.gold_price)),
        silver: Math.floor(Number(parsedData?.silver_price) / 1000), // the silver price is in kg, so converting that to grams
      });
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  // Handle errors
  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  // Handle the connection closing
  ws.onclose = () => {
    console.log("WebSocket connection closed.");
    if (!isReconnecting) {
      isReconnecting = true;
      console.log(`Reconnecting in ${reconnectInterval / 1000} seconds...`);
      setTimeout(() => {
        myWebSocket(); // Try to reconnect
      }, reconnectInterval);
    }
  };
};

function App() {
  const { renderMetalPrices } = useGlobalValue();
  const dispatch = useDispatch();
  const getMetalPrices = (metalPrices) => {
    dispatch(updatePrices(metalPrices));
  };

  useEffect(() => {
    myWebSocket(getMetalPrices);
    dispatch(fetchProductsRequest());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main
        className={classNames(
          "flex-grow",
          renderMetalPrices ? "pt-[7.5rem]" : "pt-16"
        )}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Category />} />
          <Route
            path="/products/:categorySlug"
            element={<CategoryProducts />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PopupModal />
      <Footer />
    </div>
  );
}

export default App;
