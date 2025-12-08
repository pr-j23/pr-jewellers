import { STORE_CONTACT } from './appConfig';
export {
  matchesCategorySlug,
  formatCategoryLabel,
  requiresSubCategory,
  normalizeCategorySelection,
  getCategoryDropdownConfig,
  getSelectedCategoryValue,
  normalizeNumeric,
} from './categoryHelpers';
import type { Product } from '../types/product';

export const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as any)?.opera || '';
  const isMobile = /android|iPhone|iPad|iPod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isSmallScreen = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;
  return isMobile || isSmallScreen;
};

export const constructWhatsAppURL = (product: Partial<Product>): string => {
  const greetingMessage = `Hello! I'd like to inquire about your services.\nHere are the product details:\n*Product ID: ${product?.product_id ?? 'N/A'}*\n*Product Name: ${product?.name ?? 'N/A'}*\n*Weight: ${product?.weight ?? 'N/A'}*`;

  const encodedMessage = encodeURIComponent(greetingMessage);
  const isMobile = isMobileDevice();
  const baseURL = isMobile
    ? `https://wa.me/${STORE_CONTACT.whatsappNumber}?`
    : `https://web.whatsapp.com/send/?phone=${STORE_CONTACT.whatsappNumber}&`;

  return `${baseURL}text=${encodedMessage}`;
};

export type SortType = 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a' | 'default';

type SortableProduct = Product & { price?: number };

export const sortProducts = (products: SortableProduct[] = [], sortType: SortType = 'default'): SortableProduct[] => {
  if (!Array.isArray(products)) {
    return [];
  }

  const sortedProducts = [...products];

  switch (sortType) {
    case 'price-low-high':
      return sortedProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    case 'price-high-low':
      return sortedProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    case 'name-a-z':
      return sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'name-z-a':
      return sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    default:
      return sortedProducts;
  }
};

export const toSentenceCase = (str?: string | null): string | null => {
  if (!str) return str ?? null;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const toTitleCase = (str?: string | null): string | null => {
  if (!str) return str ?? null;
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
} as const;
