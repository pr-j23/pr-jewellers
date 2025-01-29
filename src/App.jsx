import classNames from "classnames";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import PopupModal from "./components/shared/PopupModal";
import { useGlobalValue } from "./context/GlobalContext";
import About from "./pages/About";
import AddProduct from "./pages/AddProduct";
import Category from "./pages/Category";
import CategoryProducts from "./pages/CategoryProducts";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import { updatePrices } from "./redux/reducers/metalPricesSlice";
import { fetchProductsRequest } from "./redux/reducers/productsSlice";

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
        gold: Number(parsedData?.gold_price),
        silver: Number(parsedData?.silver_price),
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
        myWebSocket(callback); // Try to reconnect
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
    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close(); // Close the WebSocket connection
      }
    };
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
