import React from "react";
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

function App() {
  const { renderMetalPrices } = useGlobalValue();
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
      <Footer />
    </div>
  );
}

export default App;
