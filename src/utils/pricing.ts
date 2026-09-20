import type { Product } from '../types/product';

export interface MetalPrices {
  silver: number | null;
  gold: number | null;
}

/**
 * Computes the actual price of a product based on its fixed price or weight × metal rate + making charges.
 * This matches the logic used in ProductCard for display.
 */
export const computeProductPrice = (product: Product, metalPrices: MetalPrices): number | null => {
  const { silver, gold } = metalPrices;

  const sanitizedWeight = Number(String(product?.weight ?? '').replace(/[^\d.]/g, ''));
  const weightInGrams =
    (Number.isFinite(sanitizedWeight) && sanitizedWeight > 0
      ? sanitizedWeight
      : Number(product?.weight ?? 0)) || 0;

  let basePrice: number | null = null;

  if (product?.fixed_price && product.fixed_price > 0) {
    basePrice = product.fixed_price;
  } else if (weightInGrams > 0) {
    const metalType = product?.metal_type?.toLowerCase();
    if (metalType === 'gold' && gold) {
      basePrice = weightInGrams * gold;
    } else if (metalType === 'silver' && silver) {
      basePrice = weightInGrams * (silver / 1000);
    }
  }

  if (basePrice == null) {
    return null;
  }

  const makingCharges = Math.max(0, Math.round(product?.making_charges ?? 0));
  const totalPrice = basePrice + makingCharges;

  return Math.round(totalPrice);
};
