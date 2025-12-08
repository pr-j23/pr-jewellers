import { ProductField, ProductValidationMode } from '../constants/product';
import { requiresSubCategory } from './categoryHelpers';

const REQUIRED_MESSAGES = {
  [ProductField.PRODUCT_ID]: 'Product ID is required',
  [ProductField.NAME]: 'Product name is required',
  [ProductField.DESCRIPTION]: 'Description is required',
  [ProductField.WEIGHT]: 'Weight must be greater than 0',
  [ProductField.FIXED_PRICE]: 'Fixed price must be greater than 0',
  [ProductField.CATEGORY]: 'Select a category',
  [ProductField.SUB_CATEGORY]: 'Select a subcategory',
  [ProductField.METAL_TYPE]: 'Select a metal type',
  [ProductField.IMAGES]: 'Upload at least one image',
};

export const getProductValidationErrors = (product = {}, { mode = ProductValidationMode.ADD } = {}) => {
  const errors = {};
  const category = product[ProductField.CATEGORY];
  const subCategory = product[ProductField.SUB_CATEGORY];

  if (!category) {
    errors[ProductField.CATEGORY] = REQUIRED_MESSAGES[ProductField.CATEGORY];
  }

  if (requiresSubCategory(category) && !subCategory) {
    errors[ProductField.SUB_CATEGORY] = REQUIRED_MESSAGES[ProductField.SUB_CATEGORY];
  }

  if (mode !== ProductValidationMode.ADD) {
    return errors;
  }

  if (!product[ProductField.PRODUCT_ID]?.trim()) {
    errors[ProductField.PRODUCT_ID] = REQUIRED_MESSAGES[ProductField.PRODUCT_ID];
  }

  if (!product[ProductField.NAME]?.trim()) {
    errors[ProductField.NAME] = REQUIRED_MESSAGES[ProductField.NAME];
  }

  if (!product[ProductField.DESCRIPTION]?.trim()) {
    errors[ProductField.DESCRIPTION] = REQUIRED_MESSAGES[ProductField.DESCRIPTION];
  }

  const weightValue = Number(product[ProductField.WEIGHT]);
  if (!weightValue || weightValue <= 0) {
    errors[ProductField.WEIGHT] = REQUIRED_MESSAGES[ProductField.WEIGHT];
  }

  const fixedPriceValue = Number(product[ProductField.FIXED_PRICE]);
  if (!fixedPriceValue || fixedPriceValue <= 0) {
    errors[ProductField.FIXED_PRICE] = REQUIRED_MESSAGES[ProductField.FIXED_PRICE];
  }

  if (!product[ProductField.METAL_TYPE]) {
    errors[ProductField.METAL_TYPE] = REQUIRED_MESSAGES[ProductField.METAL_TYPE];
  }

  if (!Array.isArray(product[ProductField.IMAGES]) || product[ProductField.IMAGES].length === 0) {
    errors[ProductField.IMAGES] = REQUIRED_MESSAGES[ProductField.IMAGES];
  }

  return errors;
};
