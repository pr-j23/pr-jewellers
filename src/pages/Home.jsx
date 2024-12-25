import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Carousel from "../components/home/Carousel";
import ProductGrid from "../components/products/ProductGrid";
import { fetchProductsRequest } from "../redux/reducers/productsSlice";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsRequest());
  }, []);

  return (
    <>
      <Carousel />
      <ProductGrid />
    </>
  );
}
