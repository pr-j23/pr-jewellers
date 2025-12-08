import { describe, expect, it } from 'vitest';

vi.mock('../../mockData', () => ({
  categorySlugLookup: {
    gold: {
      value: 'gold',
      label: 'Gold',
      type: 'parent',
      parentName: 'Gold',
      rawLabel: 'Gold',
    },
    'gold-necklace': {
      value: 'gold-necklace',
      label: 'Gold Necklace',
      rawLabel: 'Necklace',
      type: 'child',
      parentSlug: 'gold',
      parentName: 'Gold',
    },
  },
  subCategoryMap: {
    gold: [{ slug: 'gold-necklace', label: 'Gold Necklace' }],
  },
}));

import {
  getCategoryDropdownConfig,
  matchesCategorySlug,
  normalizeCategorySelection,
  requiresSubCategory,
} from '../categoryHelpers';

describe('categoryHelpers', () => {
  it('normalizes category selection for child options', () => {
    const option = {
      label: 'Gold Necklace',
      value: 'gold-necklace',
      meta: { type: 'child', parentSlug: 'gold', value: 'gold-necklace' },
    };

    expect(normalizeCategorySelection(option)).toEqual({
      category: 'gold',
      sub_category: 'gold-necklace',
    });
  });

  it('matches products by parent or child slug', () => {
    const product = { category: 'gold', sub_category: 'gold-necklace' };

    expect(matchesCategorySlug(product, 'gold')).toBe(true);
    expect(matchesCategorySlug(product, 'gold-necklace')).toBe(true);
  });

  it('builds dropdown config with formatted labels', () => {
    const config = getCategoryDropdownConfig({ category: 'gold', sub_category: 'gold-necklace' });

    expect(config.selectedValue).toBe('gold-necklace');
    expect(config.initialOption).toBe('Gold › Necklace');
  });

  it('detects when a subcategory is required', () => {
    expect(requiresSubCategory('gold')).toBe(true);
    expect(requiresSubCategory('silver')).toBe(false);
  });
});
