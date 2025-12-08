import { categorySlugLookup, subCategoryMap, whatAppNumber } from '../mockData';

export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isMobile = /android|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(userAgent);

  const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

  // Consider it a mobile device if either the user agent matches or the screen size is small
  return isMobile || isSmallScreen;
};

export const constructWhatsAppURL = product => {
  const greetingMessage = `Hello! I'd like to inquire about your services.\nHere are the product details:\n*Product ID: ${product?.product_id}*\n*Product Name: ${product?.name}*\n*Weight: ${product?.weight}*`;

  const encodedMessage = encodeURIComponent(greetingMessage);

  const isMobile = isMobileDevice();
  const baseURL = isMobile
    ? `https://wa.me/${whatAppNumber}?`
    : `https://web.whatsapp.com/send/?phone=${whatAppNumber}&`;

  return `${baseURL}text=${encodedMessage}`;
};

export const matchesCategorySlug = (product = {}, slug) => {
  if (!slug || slug === 'all') return true;
  if (!product) return false;

  const meta = categorySlugLookup[slug];
  const productParent = product.category;
  const productChild = product.sub_category;

  if (!meta) {
    return productParent === slug || productChild === slug;
  }

  if (meta.type === 'all') {
    return true;
  }

  if (meta.type === 'child') {
    return productChild === meta.value || productParent === meta.value;
  }

  const parentSlug = meta.value;
  if (productParent === parentSlug) {
    return true;
  }

  const childSlugs = subCategoryMap[parentSlug]?.map(child => child.slug) || [];
  if (productChild && childSlugs.includes(productChild)) {
    return true;
  }

  // Legacy support when products stored child slug in category
  if (!productChild && childSlugs.includes(productParent)) {
    return true;
  }

  return false;
};

export const useProducts = (productCategory, products = []) => {
  const list = Array.isArray(products) ? products : [];
  if (productCategory && productCategory !== 'all') {
    return list.filter(product => matchesCategorySlug(product, productCategory));
  }

  return list;
};

export const sortProducts = (products, sortType) => {
  if (!Array.isArray(products)) {
    return []; // Return an empty array if products is not iterable
  }

  const sortedProducts = [...products];

  switch (sortType) {
    case 'price-low-high':
      return sortedProducts?.sort((a, b) => a.price - b.price);
    case 'price-high-low':
      return sortedProducts?.sort((a, b) => b.price - a.price);
    case 'name-a-z':
      return sortedProducts?.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-z-a':
      return sortedProducts?.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedProducts;
  }
};

export const toSentenceCase = str => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Input: "hello world" ->  Output: "Hello World"
export const toTitleCase = str => {
  if (!str) return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formInputclassN = {
  common:
    'shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline',
  active: 'text-gray-700',
  inactive: 'bg-gray-200 text-gray-500 cursor-not-allowed',
};
