import { describe, expect, it } from 'vitest';
import { computeProductPrice, type MetalPrices } from '../pricing';
import type { Product } from '../../types/product';

describe('computeProductPrice', () => {
  const metalPrices: MetalPrices = {
    silver: 65000, // per kg
    gold: 6500000, // per kg
  };

  describe('fixed price takes precedence', () => {
    it('uses fixed_price when positive', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Test Product',
        description: 'Test',
        weight: 10,
        category: 'rings',
        sub_category: '',
        fixed_price: 50000,
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(50000);
    });

    it('ignores weight when fixed_price is set', () => {
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

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(1000);
    });
  });

  describe('gold weight calculation', () => {
    it('calculates price as weight × gold rate', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Gold Ring',
        description: 'Test',
        weight: 10, // 10 grams
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(65000000); // 10g × 6500000/kg
    });

    it('handles decimal weights', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Gold Ring',
        description: 'Test',
        weight: 5.5,
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(35750000); // 5.5g × 6500000/kg
    });
  });

  describe('silver weight calculation', () => {
    it('calculates price as weight × (silver rate / 1000)', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Silver Chain',
        description: 'Test',
        weight: 100, // 100 grams
        category: 'chains',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'silver',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(6500); // 100g × (65000/1000)
    });
  });

  describe('making charges', () => {
    it('adds making charges to base price', () => {
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

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(65005000); // 65000000 + 5000
    });

    it('handles negative making charges as zero', () => {
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
        making_charges: -100, // negative
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(65000000); // making charges treated as 0
    });
  });

  describe('edge cases', () => {
    it('returns null when no pricing method available', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Test',
        description: 'Test',
        weight: 0,
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBeNull();
    });

    it('returns null when metal rate missing for weight-based calculation', () => {
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
        making_charges: 0,
        images: [],
      };

      const noGoldRate: MetalPrices = { silver: 65000, gold: null };
      const price = computeProductPrice(product, noGoldRate);
      expect(price).toBeNull();
    });

    it('handles string weight values', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Gold Ring',
        description: 'Test',
        weight: '10' as any, // string weight (edge case)
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 0,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      expect(price).toBe(65000000);
    });
  });

  describe('rounding', () => {
    it('rounds final price to nearest integer', () => {
      const product: Product = {
        id: '1',
        product_id: 'SKU-1',
        name: 'Gold Ring',
        description: 'Test',
        weight: 10.123,
        category: 'rings',
        sub_category: '',
        fixed_price: 0,
        metal_type: 'gold',
        making_charges: 500.5,
        images: [],
      };

      const price = computeProductPrice(product, metalPrices);
      // 10.123g × 6500000 = 65799500, rounded making charges = 501, total = 65800001
      expect(price).toBe(65800001);
    });
  });
});
