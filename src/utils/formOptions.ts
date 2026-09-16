import { ProductFormLabel, ProductFormMode } from './productConstants';
import { dropDownCategories, metalTypeOptions } from './categories';

export const formFields = [
  {
    label: 'Product ID',
    value: 'product_id',
    type: 'text',
  },
  {
    label: 'Product Name',
    value: 'name',
    type: 'text',
  },
  {
    label: 'Description',
    value: 'description',
    type: 'textarea',
  },
  {
    label: 'Weight',
    value: 'weight',
    type: 'number',
  },
  {
    label: 'Fixed Price',
    value: 'fixed_price',
    type: 'number',
  },
  {
    label: 'Making Charges',
    value: 'making_charges',
    type: 'number',
  },
  {
    label: 'Category / Subcategory',
    value: 'category',
    type: 'select',
    options: dropDownCategories,
  },
  {
    label: 'Metal Type',
    value: 'metal_type',
    type: 'select',
    options: metalTypeOptions,
  },
];

export const apiType = [
  {
    value: ProductFormMode.ADD,
    label: ProductFormLabel[ProductFormMode.ADD],
  },
  {
    value: ProductFormMode.EDIT,
    label: ProductFormLabel[ProductFormMode.EDIT],
  },
  {
    value: ProductFormMode.ADD_CAROUSEL_IMAGE,
    label: ProductFormLabel[ProductFormMode.ADD_CAROUSEL_IMAGE],
  },
];
