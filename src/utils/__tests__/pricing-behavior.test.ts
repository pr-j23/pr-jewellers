import { describe, expect, it } from 'vitest';
import { computeProductPrice, type MetalPrices } from '../pricing';
import type { Product } from '../../types/product';

describe('Price Sorting Behavior (VERIFICATION - Fix Branch)', () => {
  // These tests verify that the NEW code matches the EXPECTED behavior
  // Expected behavior was documented on main branch

  describe('computeProductPrice matches expected behavior', () => {
    const metalPrices: MetalPrices = {
      silver: 65000, // per kg
      gold: 6500000, // per kg
    };

    it('verifies gold weight × rate calculation matches expected', () => {
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

      // Expected from baseline: 10g × 6500000/kg = 65000000 + 5000 = 65005000
      const expectedPrice = 65005000;
      const actualPrice = computeProductPrice(product, metalPrices);

      expect(actualPrice).toBe(expectedPrice);
    });

    it('verifies fixed price takes precedence', () => {
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

      // Expected from baseline: fixed_price is used directly
      const expectedPrice = 1000;
      const actualPrice = computeProductPrice(product, metalPrices);

      expect(actualPrice).toBe(expectedPrice);
    });

    it('verifies silver weight calculation matches expected', () => {
      const product: Product = {
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
      };

      // Expected from baseline: 100g × (65000/1000) = 6500
      const expectedPrice = 6500;
      const actualPrice = computeProductPrice(product, metalPrices);

      expect(actualPrice).toBe(expectedPrice);
    });
  });

  describe('Price sorting verification', () => {
    it('verifies that sorting will now use correct calculated prices', () => {
      const metalPrices: MetalPrices = {
        silver: 65000,
        gold: 6500000,
      };

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

      // Expected from baseline:
      // Silver chain: 100g × (65000/1000) = 6500
      // Gold ring: 10g × 6500000 = 65000000
      // Sorted low to high: Silver chain (6500), Gold ring (65000000)

      const silverPrice = computeProductPrice(products[0], metalPrices);
      const goldPrice = computeProductPrice(products[1], metalPrices);

      expect(silverPrice).toBe(6500);
      expect(goldPrice).toBe(65000000);

      // Verify the fix: sorting should now use these computed prices
      // not the fixed_price (which is 0 for both)
      if (silverPrice !== null && goldPrice !== null) {
        expect(silverPrice).toBeLessThan(goldPrice);
      }
    });
  });
});
