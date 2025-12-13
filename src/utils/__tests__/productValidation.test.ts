import { describe, expect, it } from 'vitest';

vi.mock('../categoryHelpers', () => ({
  requiresSubCategory: (category: string) => category === 'requires-child',
}));

import { ProductField, ProductValidationMode } from '../../utils/productConstants';
import { validateProduct } from '../productValidation';
import type { Product } from '../../types/product';

const buildProduct = (overrides: Partial<Product> = {}): Product => ({
  product_id: 'SKU-1',
  name: 'Test Product',
  description: 'A product used for testing',
  weight: 10,
  category: 'custom-category',
  sub_category: '',
  fixed_price: 5000,
  metal_type: 'gold',
  making_charges: 0,
  images: ['img.jpg'],
  ...overrides,
});

describe('validateProduct', () => {
  it('validates add mode products successfully', () => {
    const result = validateProduct(buildProduct());

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('returns errors for missing required add mode fields', () => {
    const result = validateProduct(
      buildProduct({
        images: [],
        weight: 0,
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors).toMatchObject({
      [ProductField.IMAGES]: 'Upload at least one image',
      [ProductField.WEIGHT]: 'Weight must be greater than 0',
    });
  });

  it('validates optional making charges when provided', () => {
    const result = validateProduct(
      buildProduct({
        making_charges: -10,
      })
    );

    expect(result.isValid).toBe(false);
    expect(result.errors[ProductField.MAKING_CHARGES]).toBe(
      'Making charges must be zero or greater'
    );
  });

  it('requires sub categories when category metadata demands it', () => {
    const result = validateProduct(
      buildProduct({
        category: 'requires-child',
        sub_category: '',
      }),
      { mode: ProductValidationMode.EDIT }
    );

    expect(result.isValid).toBe(false);
    expect(result.errors[ProductField.SUB_CATEGORY]).toBe('Select a subcategory');
  });

  it('only enforces category/subcategory in edit mode', () => {
    const result = validateProduct(buildProduct({ category: '', sub_category: '' }), {
      mode: ProductValidationMode.EDIT,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveProperty(ProductField.CATEGORY);
  });
});
