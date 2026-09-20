import { describe, expect, it } from 'vitest';
import type { ProductFormValues } from '../useProductForm';
import { formValuesToProduct } from '../useProductForm';

describe('formValuesToProduct', () => {
  it('converts string number fields to numbers', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '10',
      category: 'rings',
      sub_category: '',
      fixed_price: '50000',
      metal_type: 'gold',
      making_charges: '1000',
      images: [],
    };

    const product = formValuesToProduct(formValues);

    expect(product.weight).toBe(10);
    expect(product.fixed_price).toBe(50000);
    expect(product.making_charges).toBe(1000);
    expect(typeof product.weight).toBe('number');
    expect(typeof product.fixed_price).toBe('number');
    expect(typeof product.making_charges).toBe('number');
  });

  it('converts empty strings to zero', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '',
      category: 'rings',
      sub_category: '',
      fixed_price: '',
      metal_type: 'gold',
      making_charges: '',
      images: [],
    };

    const product = formValuesToProduct(formValues);

    expect(product.weight).toBe(0);
    expect(product.fixed_price).toBe(0);
    expect(product.making_charges).toBe(0);
  });

  it('handles decimal string values', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '10.5',
      category: 'rings',
      sub_category: '',
      fixed_price: '12345.67',
      metal_type: 'gold',
      making_charges: '100.25',
      images: [],
    };

    const product = formValuesToProduct(formValues);

    expect(product.weight).toBe(10.5);
    expect(product.fixed_price).toBe(12345.67);
    expect(product.making_charges).toBe(100.25);
  });

  it('preserves non-number fields as strings', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '10',
      category: 'rings',
      sub_category: 'gold-rings',
      fixed_price: '50000',
      metal_type: 'gold',
      making_charges: '1000',
      images: [],
    };

    const product = formValuesToProduct(formValues);

    expect(product.product_id).toBe('SKU-1');
    expect(product.name).toBe('Test Product');
    expect(product.description).toBe('Test description');
    expect(product.category).toBe('rings');
    expect(product.sub_category).toBe('gold-rings');
    expect(product.metal_type).toBe('gold');
  });

  it('handles images array', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '10',
      category: 'rings',
      sub_category: '',
      fixed_price: '50000',
      metal_type: 'gold',
      making_charges: '1000',
      images: ['image1.jpg', 'image2.jpg'],
    };

    const product = formValuesToProduct(formValues);

    expect(product.images).toEqual(['image1.jpg', 'image2.jpg']);
  });

  it('handles zero string values', () => {
    const formValues: ProductFormValues = {
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'Test description',
      weight: '0',
      category: 'rings',
      sub_category: '',
      fixed_price: '0',
      metal_type: 'gold',
      making_charges: '0',
      images: [],
    };

    const product = formValuesToProduct(formValues);

    expect(product.weight).toBe(0);
    expect(product.fixed_price).toBe(0);
    expect(product.making_charges).toBe(0);
  });
});
