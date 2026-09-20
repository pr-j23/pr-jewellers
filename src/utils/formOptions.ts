import { ProductFormLabel, ProductFormMode } from './productConstants';
import { dropDownCategories, metalTypeOptions } from './categories';

export const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920',
    title: 'Luxury Collection',
    description: 'Discover our newest arrivals',
  },
  {
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1920',
    title: 'Timeless Elegance',
    description: 'Handcrafted with precision',
  },
  {
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1920',
    title: 'Diamond Collection',
    description: 'Pure brilliance in every piece',
  },
];

export const sortOptions = [
  { value: 'default', label: 'Default' },
  {
    value: 'price-low-high',
    label: 'Price: Low to High',
  },
  {
    value: 'price-high-low',
    label: 'Price: High to Low',
  },
  {
    value: 'name-a-z',
    label: 'Name: A to Z',
  },
  {
    value: 'name-z-a',
    label: 'Name: Z to A',
  },
];

export const metalTypeFilterOptions = [
  { value: 'all', label: 'All Metals' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
];

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
