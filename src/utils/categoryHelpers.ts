import { categorySlugLookup, subCategoryMap } from './mockData';
import type {
  CategoryMeta,
  ChildCategoryOption,
  DropdownConfig,
  DropdownOption,
  Product,
} from '../types/product';

type ProductLike = Partial<Product> | null;

const slugLookup = categorySlugLookup as Record<string, CategoryMeta | null>;
const childLookup = subCategoryMap as Record<string, ChildCategoryOption[] | null>;

const DEFAULT_CATEGORY_LABEL = 'Select Category';

export const getCategoryMeta = (slug?: string | null): CategoryMeta | null => {
  if (!slug) return null;
  return slugLookup[slug] || null;
};

export const formatCategoryLabel = (slug?: string | null): string => {
  if (!slug) return DEFAULT_CATEGORY_LABEL;

  const meta = getCategoryMeta(slug);
  if (!meta) return slug;

  if (meta.type === 'child') {
    return `${meta.parentName} › ${meta.rawLabel}`;
  }

  return meta.label || slug || DEFAULT_CATEGORY_LABEL;
};

export const requiresSubCategory = (parentSlug?: string | null): boolean =>
  Boolean(parentSlug && (childLookup[parentSlug]?.length || 0) > 0);

export const normalizeCategorySelection = (
  option?: DropdownOption | null
): Pick<Product, 'category' | 'sub_category'> => {
  const meta = option?.meta as unknown as CategoryMeta | null;
  const value = option?.value;

  if (!option || meta?.type === 'all' || value === 'all') {
    return { category: '', sub_category: '' };
  }

  if (meta?.type === 'child') {
    return { category: meta.parentSlug ?? '', sub_category: meta.value };
  }

  const nextCategory = meta?.value || value || '';

  return {
    category: nextCategory,
    sub_category: '',
  };
};

export const matchesCategorySlug = (product: ProductLike = null, slug?: string | null): boolean => {
  if (!slug || slug === 'all') return true;
  if (!product) return false;

  const meta = getCategoryMeta(slug);
  const productParent = product?.category ?? '';
  const productChild = product?.sub_category ?? '';

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

  const childSlugs = childLookup[parentSlug]?.map(child => child.slug) || [];
  if (productChild && childSlugs.includes(productChild)) {
    return true;
  }

  // Legacy support when products stored child slug in category
  if (!productChild && childSlugs.includes(productParent)) {
    return true;
  }

  return false;
};

export const getSelectedCategoryValue = (product: ProductLike = null): string =>
  product?.sub_category || product?.category || '';

export const getCategoryDropdownConfig = (
  product: ProductLike = null,
  overrides: Partial<DropdownConfig> = {}
): DropdownConfig => {
  const selectedValue = getSelectedCategoryValue(product);

  return {
    selectedValue: selectedValue || null,
    initialOption: formatCategoryLabel(selectedValue),
    ...overrides,
  };
};

export const normalizeNumeric = (value: number | string | null): number => {
  if (value === '' || value === null) return 0;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? 0 : numericValue;
};
