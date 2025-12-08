export const ProductField = Object.freeze({
  PRODUCT_ID: 'product_id',
  NAME: 'name',
  DESCRIPTION: 'description',
  WEIGHT: 'weight',
  FIXED_PRICE: 'fixed_price',
  CATEGORY: 'category',
  SUB_CATEGORY: 'sub_category',
  METAL_TYPE: 'metal_type',
  IMAGES: 'images',
});

export const ProductFormMode = Object.freeze({
  ADD: 'add-product',
  EDIT: 'edit-product',
  ADD_CAROUSEL_IMAGE: 'add-carousel-img',
});

export const ProductFormLabel = Object.freeze({
  [ProductFormMode.ADD]: 'Add Product',
  [ProductFormMode.EDIT]: 'Edit Product',
  [ProductFormMode.ADD_CAROUSEL_IMAGE]: 'Add Carousel Image',
});

export const ProductValidationMode = Object.freeze({
  ADD: 'add',
  EDIT: 'edit',
});
