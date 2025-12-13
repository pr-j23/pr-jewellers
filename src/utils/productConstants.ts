export const ProductField = {
  PRODUCT_ID: 'product_id',
  NAME: 'name',
  DESCRIPTION: 'description',
  WEIGHT: 'weight',
  FIXED_PRICE: 'fixed_price',
  CATEGORY: 'category',
  SUB_CATEGORY: 'sub_category',
  METAL_TYPE: 'metal_type',
  IMAGES: 'images',
  MAKING_CHARGES: 'making_charges',
} as const;

export type ProductFieldKey = keyof typeof ProductField;
export type ProductFieldValue = (typeof ProductField)[ProductFieldKey];

export const ProductFormMode = {
  ADD: 'add-product',
  EDIT: 'edit-product',
  ADD_CAROUSEL_IMAGE: 'add-carousel-img',
} as const;

export type ProductFormModeValue = (typeof ProductFormMode)[keyof typeof ProductFormMode];

export const ProductFormLabel: Record<ProductFormModeValue, string> = {
  [ProductFormMode.ADD]: 'Add Product',
  [ProductFormMode.EDIT]: 'Edit Product',
  [ProductFormMode.ADD_CAROUSEL_IMAGE]: 'Add Carousel Image',
};

export const ProductValidationMode = {
  ADD: 'add',
  EDIT: 'edit',
} as const;

export type ProductValidationModeValue =
  (typeof ProductValidationMode)[keyof typeof ProductValidationMode];
