import { categorySlugLookup, subCategoryMap } from '../mockData';

const DEFAULT_CATEGORY_LABEL = 'Select Category';

export const getCategoryMeta = slug => {
  if (!slug) return null;
  return categorySlugLookup[slug] || null;
};

export const formatCategoryLabel = slug => {
  if (!slug) return DEFAULT_CATEGORY_LABEL;

  const meta = getCategoryMeta(slug);
  if (!meta) return slug;

  if (meta.type === 'child') {
    return `${meta.parentName} › ${meta.rawLabel}`;
  }

  return meta.label || slug;
};

export const requiresSubCategory = parentSlug =>
  Boolean(parentSlug && (subCategoryMap[parentSlug]?.length || 0) > 0);

export const normalizeCategorySelection = option => {
  const meta = option?.meta;
  const value = option?.value;

  if (!option || meta?.type === 'all' || value === 'all') {
    return { category: '', sub_category: '' };
  }

  if (meta?.type === 'child') {
    return { category: meta.parentSlug, sub_category: meta.value };
  }

  const nextCategory = meta?.value || value || '';

  return {
    category: nextCategory,
    sub_category: '',
  };
};

export const matchesCategorySlug = (product = {}, slug) => {
  if (!slug || slug === 'all') return true;
  if (!product) return false;

  const meta = getCategoryMeta(slug);
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

export const getSelectedCategoryValue = product =>
  product?.sub_category || product?.category || '';

export const getCategoryDropdownConfig = (product, overrides = {}) => {
  const selectedValue = getSelectedCategoryValue(product);

  return {
    selectedValue: selectedValue || null,
    initialOption: formatCategoryLabel(selectedValue),
    ...overrides,
  };
};

export const normalizeNumeric = value => {
  if (value === '' || value === null || value === undefined) return 0;
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? 0 : numericValue;
};
