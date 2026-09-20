import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useProducts } from '../useProducts';
import type { Product } from '../../types/product';

describe('useProducts Search Behavior', () => {
  describe('Search with null descriptions', () => {
    it('should not crash when product has null description', () => {
      // ARRANGE: Create products with null description
      const products: Product[] = [
        {
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

      // ACT: Render hook and set search query
      const { result } = renderHook(() => useProducts(products));

      act(() => {
        result.current.setSearchQuery('test');
      });

      // ASSERT: Should filter by name since description is null
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].name).toBe('Test Product');
    });

    it('should search by description when description is valid', () => {
      // ARRANGE: Create products with valid descriptions
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

      // ACT: Render hook and search by description
      const { result } = renderHook(() => useProducts(products));

      act(() => {
        result.current.setSearchQuery('test');
      });

      // ASSERT: Should filter by description
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].description).toBe('This is a test description');
    });

    it('should search by name when description is null', () => {
      // ARRANGE: Create products where one has null description
      const products: Product[] = [
        {
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
        },
        {
          id: '2',
          product_id: 'SKU-2',
          name: 'Other Product',
          description: null,
          weight: 5,
          category: 'chains',
          sub_category: '',
          fixed_price: 25000,
          metal_type: 'silver',
          making_charges: 0,
          images: [],
        },
      ];

      // ACT: Render hook and search by name
      const { result } = renderHook(() => useProducts(products));

      act(() => {
        result.current.setSearchQuery('test');
      });

      // ASSERT: Should filter by name
      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].name).toBe('Test Product');
    });
  });
});

describe('useProducts Price Sorting Behavior', () => {
  describe('Sorting with computed prices', () => {
    it('should sort by computed price for weight-based products', () => {
      // ARRANGE: Create products with weight-based pricing
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

      // ACT: Render hook with metal prices and sort by price
      const { result } = renderHook(() => useProducts(products, {}, metalPrices));

      act(() => {
        result.current.setSortType('price-low-high');
      });

      // ASSERT: Silver chain (6500) should come before gold ring (65000000)
      expect(result.current.products[0].name).toBe('Silver Chain');
      expect(result.current.products[1].name).toBe('Gold Ring');
    });

    it('should use fixed_price when present', () => {
      // ARRANGE: Create products with fixed prices
      const products: Product[] = [
        {
          id: '1',
          product_id: 'SKU-1',
          name: 'High Weight Low Price',
          description: 'Test',
          weight: 100,
          category: 'chains',
          sub_category: '',
          fixed_price: 1000,
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
          fixed_price: 100000,
          metal_type: 'gold',
          making_charges: 0,
          images: [],
        },
      ];

      const metalPrices = {
        silver: 65000,
        gold: 6500000,
      };

      // ACT: Render hook and sort by price
      const { result } = renderHook(() => useProducts(products, {}, metalPrices));

      act(() => {
        result.current.setSortType('price-low-high');
      });

      // ASSERT: Fixed price should be used, not weight-based calculation
      expect(result.current.products[0].name).toBe('High Weight Low Price');
      expect(result.current.products[1].name).toBe('Low Weight High Price');
    });

    it('should sort high to low correctly', () => {
      // ARRANGE: Create products with different prices
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

      // ACT: Render hook and sort by price high to low
      const { result } = renderHook(() => useProducts(products, {}, metalPrices));

      act(() => {
        result.current.setSortType('price-high-low');
      });

      // ASSERT: Gold ring (65000000) should come before silver chain (6500)
      expect(result.current.products[0].name).toBe('Gold Ring');
      expect(result.current.products[1].name).toBe('Silver Chain');
    });
  });
});
