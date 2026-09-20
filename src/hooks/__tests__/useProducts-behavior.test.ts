import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useProducts } from '../useProducts';
import type { Product } from '../../types/product';

describe('useProducts Behavior (VERIFICATION - Fix Branch)', () => {
  // These tests verify that the NEW code matches the EXPECTED behavior
  // Expected behavior was documented on main branch

  describe('Search null description fix', () => {
    it('verifies search handles null descriptions without crashing', () => {
      // EXPECTED behavior after fix:
      // Search should use (product.description ?? '').toLowerCase()
      // This prevents crashes when description is null

      const products: Product[] = [
        {
          id: '1',
          product_id: 'SKU-1',
          name: 'Test Product',
          description: null, // null description
          weight: 10,
          category: 'rings',
          sub_category: '',
          fixed_price: 50000,
          metal_type: 'gold',
          making_charges: 0,
          images: [],
        },
        {
          id: '2',
          product_id: 'SKU-2',
          name: 'Another Product',
          description: 'Valid description',
          weight: 5,
          category: 'chains',
          sub_category: '',
          fixed_price: 25000,
          metal_type: 'silver',
          making_charges: 0,
          images: [],
        },
      ];

      const { result } = renderHook(() => useProducts(products));

      // Verify initial state
      expect(result.current.products).toHaveLength(2);

      // Test search with null description - should not crash
      act(() => {
        result.current.setSearchQuery('test');
      });

      // Should filter by name since description is null
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].name).toBe('Test Product');
    });

    it('verifies search works with valid descriptions', () => {
      const products: Product[] = [
        {
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
        },
        {
          id: '2',
          product_id: 'SKU-2',
          name: 'Another Product',
          description: 'Different description',
          weight: 5,
          category: 'chains',
          sub_category: '',
          fixed_price: 25000,
          metal_type: 'silver',
          making_charges: 0,
          images: [],
        },
      ];

      const { result } = renderHook(() => useProducts(products));

      // Test search by description
      act(() => {
        result.current.setSearchQuery('test');
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].description).toBe('This is a test description');
    });
  });

  describe('Price sorting with computed prices', () => {
    it('verifies sorting uses computed prices for weight-based products', () => {
      // EXPECTED behavior after fix:
      // Sorting should use computed prices (weight × rate)
      // Not just fixed_price

      const products: Product[] = [
        {
          id: '1',
          product_id: 'SKU-1',
          name: 'Silver Chain',
          description: 'Test',
          weight: 100,
          category: 'chains',
          sub_category: '',
          fixed_price: 0,
          metal_type: 'silver',
          making_charges: 0,
          images: [],
        },
        {
          id: '2',
          product_id: 'SKU-2',
          name: 'Gold Ring',
          description: 'Test',
          weight: 10,
          category: 'rings',
          sub_category: '',
          fixed_price: 0,
          metal_type: 'gold',
          making_charges: 0,
          images: [],
        },
      ];

      const metalPrices = {
        silver: 65000,
        gold: 6500000,
      };

      const { result } = renderHook(() => useProducts(products, {}, metalPrices));

      // Sort by price low to high
      act(() => {
        result.current.setSortType('price-low-high');
      });

      // Silver chain: 100g × (65000/1000) = 6500
      // Gold ring: 10g × 6500000 = 65000000
      // Silver should come first
      expect(result.current.products[0].name).toBe('Silver Chain');
      expect(result.current.products[1].name).toBe('Gold Ring');
    });

    it('verifies fixed_price takes precedence over weight-based calculation', () => {
      const products: Product[] = [
        {
          id: '1',
          product_id: 'SKU-1',
          name: 'High Weight Low Price',
          description: 'Test',
          weight: 100,
          category: 'chains',
          sub_category: '',
          fixed_price: 1000, // low fixed price
          metal_type: 'silver',
          making_charges: 0,
          images: [],
        },
        {
          id: '2',
          product_id: 'SKU-2',
          name: 'Low Weight High Price',
          description: 'Test',
          weight: 5,
          category: 'rings',
          sub_category: '',
          fixed_price: 100000, // high fixed price
          metal_type: 'gold',
          making_charges: 0,
          images: [],
        },
      ];

      const metalPrices = {
        silver: 65000,
        gold: 6500000,
      };

      const { result } = renderHook(() => useProducts(products, {}, metalPrices));

      // Sort by price low to high
      act(() => {
        result.current.setSortType('price-low-high');
      });

      // Fixed price should be used, not weight-based calculation
      expect(result.current.products[0].name).toBe('High Weight Low Price');
      expect(result.current.products[1].name).toBe('Low Weight High Price');
    });
  });
});
