import { describe, expect, it } from 'vitest';
import { formValuesToProduct, type ProductFormValues } from '../../hooks/useProductForm';
import type { Product } from '../../types/product';

describe('Form Number Input Handling', () => {
  describe('formValuesToProduct conversion', () => {
    it('should convert string number fields to numbers at submission', () => {
      // ARRANGE: Create form values with string number fields
      const formValues: ProductFormValues = {
        product_id: 'SKU-1',
        name: 'Test Product',
        description: 'Test',
        weight: '10',
        category: 'rings',
        sub_category: '',
        fixed_price: '50000',
        metal_type: 'gold',
        making_charges: '1000',
        images: [],
      };

      // ACT: Convert form values to Product
      const product = formValuesToProduct(formValues);

      // ASSERT: All number fields should be converted to numbers
      expect(typeof product.weight).toBe('number');
      expect(typeof product.fixed_price).toBe('number');
      expect(typeof product.making_charges).toBe('number');
      expect(product.weight).toBe(10);
      expect(product.fixed_price).toBe(50000);
      expect(product.making_charges).toBe(1000);
    });

    it('should convert empty strings to zero', () => {
      // ARRANGE: Create form values with empty string number fields
      const formValues: ProductFormValues = {
        product_id: 'SKU-1',
        name: 'Test Product',
        description: 'Test',
        weight: '',
        category: 'rings',
        sub_category: '',
        fixed_price: '',
        metal_type: 'gold',
        making_charges: '',
        images: [],
      };

      // ACT: Convert form values to Product
      const product = formValuesToProduct(formValues);

      // ASSERT: Empty strings should become 0
      expect(product.weight).toBe(0);
      expect(product.fixed_price).toBe(0);
      expect(product.making_charges).toBe(0);
    });

    it('should convert decimal string values correctly', () => {
      // ARRANGE: Create form values with decimal string values
      const formValues: ProductFormValues = {
        product_id: 'SKU-1',
        name: 'Test Product',
        description: 'Test',
        weight: '10.5',
        category: 'rings',
        sub_category: '',
        fixed_price: '12345.67',
        metal_type: 'gold',
        making_charges: '100.25',
        images: [],
      };

      // ACT: Convert form values to Product
      const product = formValuesToProduct(formValues);

      // ASSERT: Decimal values should be preserved
      expect(product.weight).toBe(10.5);
      expect(product.fixed_price).toBe(12345.67);
      expect(product.making_charges).toBe(100.25);
    });

    it('should preserve non-number fields as strings', () => {
      // ARRANGE: Create form values with various field types
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
        images: ['image1.jpg', 'image2.jpg'],
      };

      // ACT: Convert form values to Product
      const product = formValuesToProduct(formValues);

      // ASSERT: Non-number fields should remain strings
      expect(product.product_id).toBe('SKU-1');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test description');
      expect(product.category).toBe('rings');
      expect(product.sub_category).toBe('gold-rings');
      expect(product.metal_type).toBe('gold');
      expect(product.images).toEqual(['image1.jpg', 'image2.jpg']);
    });
  });
});

describe('Search Null Description Handling', () => {
  it('should handle null descriptions without crashing', () => {
    // ARRANGE: Create a product with null description
    const product: Product = {
      id: '1',
      product_id: 'SKU-1',
      name: 'Test Product',
      description: null,
      weight: 10,
      category: 'rings',
      sub_category: '',
      fixed_price: 50000,
      metal_type: 'gold',
      making_charges: 0,
      images: [],
    };

    // ACT: Use nullish coalescing to handle null description
    const searchValue = (product.description ?? '').toLowerCase();

    // ASSERT: Should not crash and should return empty string
    expect(searchValue).toBe('');
  });

  it('should throw error if nullish coalescing is not used', () => {
    // ARRANGE: Create a product with null description
    const product: Product = {
      id: '1',
      product_id: 'SKU-1',
      name: 'Test Product',
      description: null,
      weight: 10,
      category: 'rings',
      sub_category: '',
      fixed_price: 50000,
      metal_type: 'gold',
      making_charges: 0,
      images: [],
    };

    // ACT & ASSERT: Direct toLowerCase() on null should throw
    expect(() => (product.description as string).toLowerCase()).toThrow();
  });

  it('should work correctly with valid descriptions', () => {
    // ARRANGE: Create a product with valid description
    const product: Product = {
      id: '1',
      product_id: 'SKU-1',
      name: 'Test Product',
      description: 'This is a test description',
      weight: 10,
      category: 'rings',
      sub_category: '',
      fixed_price: 50000,
      metal_type: 'gold',
      making_charges: 0,
      images: [],
    };

    // ACT: Convert description to lowercase
    const searchValue = (product.description ?? '').toLowerCase();

    // ASSERT: Should convert correctly
    expect(searchValue).toBe('this is a test description');
  });
});
