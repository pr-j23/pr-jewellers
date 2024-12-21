import { whatAppNumber } from "../mockData";

export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isMobile =
    /android|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(userAgent);

  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

  // Consider it a mobile device if either the user agent matches or the screen size is small
  return isMobile || isSmallScreen;
};

export const constructWhatsAppURL = () => {
  const greetingMessage = "Hello! I'd like to inquire about your services.";
  const encodedMessage = encodeURIComponent(greetingMessage);

  const isMobile = isMobileDevice();
  const baseURL = isMobile
    ? `https://wa.me/${whatAppNumber}?`
    : `https://web.whatsapp.com/send/?phone=${whatAppNumber}&`;

  return `${baseURL}text=${encodedMessage}`;
};

export const useProducts = (productCategory, products) => {
  // If a product category is provided
  if (productCategory) {
    // Filter the products array to return only those products that match the specified category
    return products.filter((product) => product.category === productCategory);
  }

  // If no product category is provided, return the full list of products
  return products;
};

export const sortProducts = (products, sortType) => {
  const sortedProducts = [...products];

  switch (sortType) {
    case "price-low-high":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "price-high-low":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "name-a-z":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "name-z-a":
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedProducts;
  }
};
