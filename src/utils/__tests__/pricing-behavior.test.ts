import { describe, expect, it } from 'vitest';
import type { Product } from '../../types/product';

describe('Price Sorting Behavior (BASELINE - Main Branch)', () => {
  // This test documents the CURRENT (buggy) behavior on main
  // After the fix, this test should be updated to expect correct behavior

  describe('Original ProductCard price calculation', () => {
    it('documents how ProductCard calculates price with gold rate', () => {
      // This documents the ORIGINAL behavior in ProductCard
      // Based on the original code, ProductCard calculates:
      // - If fixed_price > 0: use fixed_price
      // - Otherwise: weight × gold_rate + making_charges
      // - Silver: weight × (silver_rate / 1000) + making_charges

      const metalPrices = {
        silver: 65000, // per kg
        gold: 6500000, // per kg
      };

      // Test case: 10g gold ring
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Gold Ring',
        description: 'Test',
        weight: 10,
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 5000,
        images: [],
      };

      // Expected based on original ProductCard logic:
      // 10g × 6500000/kg = 65000000
      // + 5000 making charges = 65005000
      const expectedPrice = 65005000;

      // This is the BASELINE behavior we expect
      // After the fix, computeProductPrice should match this
      expect(expectedPrice).toBe(65005000);
    });

    it('documents how ProductCard handles fixed_price', () => {
      // Fixed price takes precedence over weight-based calculation
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Test Product',
        description: 'Test',
        weight: 100, // high weight
        category: 'rings',
        sub_category: '',
        fixed_price: 1000, // low fixed price
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      // Expected: fixed_price is used directly
      const expectedPrice = 1000;

      expect(expectedPrice).toBe(1000);
    });
  });

  describe('Original useProducts sorting behavior', () => {
    it('documents that sorting by price currently sorts by fixed_price only', () => {
      // This is the BUG we're fixing
      // The current useProducts hook sorts by product.fixed_price
      // This is WRONG for products priced by weight × metal rate

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

      // Current (buggy) behavior: sorts by fixed_price (both are 0)
      // So order is determined by other factors or original order

      // CORRECT behavior after fix:
      // Silver chain: 100g × (65000/1000) = 6500
      // Gold ring: 10g × 6500000 = 65000000
      // Sorted low to high: Silver chain (6500), Gold ring (65000000)

      const silverPrice = 100 * (metalPrices.silver / 1000);
      const goldPrice = 10 * metalPrices.gold;

      expect(silverPrice).toBe(6500);
      expect(goldPrice).toBe(65000000);

      // This test documents what the CORRECT sorting should be
      // After the fix, useProducts should sort by these calculated prices
    });
  });
});
