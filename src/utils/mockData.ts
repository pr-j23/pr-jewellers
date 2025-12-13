import type { CategoryHierarchyData, CategoryMeta, ChildCategoryOption } from '../types/product';

export const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920',
    title: 'Luxury Collection 2024',
    description: 'Discover our newest arrivals',
  },
  {
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1920',
    title: 'Timeless Elegance',
    description: 'Handcrafted with precision',
  },
  {
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1920',
    title: 'Diamond Collection',
    description: 'Pure brilliance in every piece',
  },
];

export const mockProducts = [
  // Rings
  {
    id: 'ring-1',
    name: 'Diamond Solitaire Ring',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800',
    weight: '3.5g',
    price: 2999.99,
    description: '18K White Gold Diamond Ring',
    category: 'rings',
  },
  {
    id: 'ring-2',
    name: 'Ruby Engagement Ring',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800',
    weight: '4.2g',
    price: 1899.99,
    description: 'Natural Ruby with Diamond Halo',
    category: 'rings',
  },
  {
    id: 'ring-3',
    name: 'Vintage Pearl Ring',
    image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800',
    weight: '3.2g',
    price: 799.99,
    description: 'Vintage Pearl and Diamond Ring',
    category: 'rings',
  },

  // Necklaces
  {
    id: 'necklace-1',
    name: 'Diamond Pendant Necklace',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800',
    weight: '8.5g',
    price: 1999.99,
    description: '1ct Diamond Solitaire Pendant',
    category: 'necklaces',
  },
  {
    id: 'necklace-2',
    name: 'Pearl Strand',
    image:
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800',
    weight: '25g',
    price: 1499.99,
    description: 'Freshwater Pearl Strand Necklace',
    category: 'necklaces',
  },
  {
    id: 'necklace-3',
    name: 'Gold Chain',
    image:
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800',
    weight: '15g',
    price: 899.99,
    description: '18K Gold Chain Necklace',
    category: 'necklaces',
  },

  // Earrings
  {
    id: 'earring-1',
    name: 'Diamond Studs',
    image:
      'https://images.unsplash.com/photo-1589207212797-cfd546dea0fe?auto=format&fit=crop&w=800',
    weight: '2.8g',
    price: 2499.99,
    description: '2ct Total Diamond Studs',
    category: 'earrings',
  },
  {
    id: 'earring-2',
    name: 'Pearl Drop Earrings',
    image:
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800',
    weight: '3.5g',
    price: 699.99,
    description: 'South Sea Pearl Drops',
    category: 'earrings',
  },
  {
    id: 'earring-3',
    name: 'Gold Hoops',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800',
    weight: '4g',
    price: 599.99,
    description: '14K Gold Hoop Earrings',
    category: 'earrings',
  },

  // Silver Coins
  {
    id: 'coin-1',
    name: 'American Silver Eagle',
    image:
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800',
    weight: '31.1g',
    price: 35.99,
    description: '1oz Silver American Eagle Coin',
    category: 'coins',
  },
  {
    id: 'coin-2',
    name: 'Canadian Maple Leaf',
    image:
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56e8?auto=format&fit=crop&w=800',
    weight: '31.1g',
    price: 34.99,
    description: '1oz Silver Maple Leaf Coin',
    category: 'coins',
  },
  {
    id: 'coin-3',
    name: 'Silver Britannia',
    image:
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56e8?auto=format&fit=crop&w=800',
    weight: '31.1g',
    price: 33.99,
    description: '1oz Silver Britannia Coin',
    category: 'coins',
  },

  // Anklets
  {
    id: 'anklet-1',
    name: 'Sterling Silver Chain Anklet',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800',
    weight: '3.5g',
    price: 49.99,
    description: 'Sterling Silver Delicate Chain Anklet',
    category: 'anklets',
  },
  {
    id: 'anklet-2',
    name: 'Pearl Charm Anklet',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800',
    weight: '4g',
    price: 69.99,
    description: 'Freshwater Pearl Charm Anklet',
    category: 'anklets',
  },
  {
    id: 'anklet-3',
    name: 'Gold-Plated Bell Anklet',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800',
    weight: '5g',
    price: 39.99,
    description: 'Traditional Bell Charm Anklet',
    category: 'anklets',
  },

  // Bangles
  {
    id: 'bangle-1',
    name: 'Gold Kada Bangle',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800',
    weight: '15g',
    price: 999.99,
    description: 'Traditional Gold Kada Bangle',
    category: 'bangles',
  },
  {
    id: 'bangle-2',
    name: 'Diamond Bangle',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800',
    weight: '12g',
    price: 1499.99,
    description: 'Diamond Studded Gold Bangle',
    category: 'bangles',
  },
  {
    id: 'bangle-3',
    name: 'Silver Filigree Bangle',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800',
    weight: '20g',
    price: 299.99,
    description: 'Sterling Silver Filigree Bangle',
    category: 'bangles',
  },

  // Bracelets
  {
    id: 'bracelet-1',
    name: 'Diamond Tennis Bracelet',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800',
    weight: '15g',
    price: 3999.99,
    description: '4ct Total Diamond Weight',
    category: 'bracelets',
  },
  {
    id: 'bracelet-2',
    name: 'Gold Chain Bracelet',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800',
    weight: '12g',
    price: 1299.99,
    description: '22K Gold Chain Bracelet',
    category: 'bracelets',
  },
  {
    id: 'bracelet-3',
    name: 'Charm Bracelet',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800',
    weight: '18g',
    price: 899.99,
    description: 'Sterling Silver Charm Bracelet',
    category: 'bracelets',
  },
];

export const categories = [
  {
    id: 'cat-all',
    name: 'All Products',
    slug: 'all',
    description: 'Browse every curation across jewellery, pooja collections, and gifting.',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800',
  },
  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description: 'Signature engagement rings to gemstone statements for every milestone.',
    image:
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800',
    // subCategories: [
    //   {
    //     id: 'rings-engagement',
    //     name: 'Engagement Rings',
    //     slug: 'engagement-rings',
    //     parentSlug: 'rings',
    //     description: 'Classic solitaires and halo styles to mark the proposal moment.',
    //   },
    // ],
  },
  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Studs, hoops, jhumkas, and chandbalis to frame every look.',
    image:
      'https://images.unsplash.com/photo-1522312298940-653d2b79db11?auto=format&fit=crop&w=800',
    // subCategories: [
    //   {
    //     id: 'earrings-studs',
    //     name: 'Studs',
    //     slug: 'stud-earrings',
    //     parentSlug: 'earrings',
    //     description: 'Minimal diamond and pearl studs for effortless polish.',
    //   },
    // ],
  },
  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Layered chains, heritage chokers, and contemporary pendants.',
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'necklaces-chokers',
        name: 'Chokers',
        slug: 'choker-necklaces',
        parentSlug: 'necklaces',
        description: 'Close-set chokers embellished with gemstones.',
      },
      {
        id: 'necklaces-rani-haar',
        name: 'Rani Haar',
        slug: 'rani-haar',
        parentSlug: 'necklaces',
        description: 'Layered royal haars with intricate motifs.',
      },
      {
        id: 'necklaces-mangalsutra',
        name: 'Mangalsutras',
        slug: 'mangalsutras',
        parentSlug: 'necklaces',
        description: 'Modern renditions of the sacred mangalsutra.',
      },
    ],
  },
  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Flexible chains, tennis classics, and cuff silhouettes.',
    image:
      'https://images.unsplash.com/photo-1617039621574-23c247c992dc?auto=format&fit=crop&w=800',
  },
  {
    id: 'cat-bangles',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Traditional kada sets and contemporary stackers.',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800',
  },
  {
    id: 'cat-anklets',
    name: 'Anklets',
    slug: 'anklets',
    description: 'Delicate chains and ghungroo anklets for every style.',
    image:
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'anklets-beaded',
        name: 'Beaded Anklets',
        slug: 'beaded-anklets',
        parentSlug: 'anklets',
        description: 'Pearl and gemstone strung anklets.',
      },
      {
        id: 'anklets-bridal',
        name: 'Bridal Anklets',
        slug: 'bridal-anklets',
        parentSlug: 'anklets',
        description: 'Elaborate anklets with ghungroo cascades.',
      },
      {
        id: 'anklets-fancy',
        name: 'Fancy Anklets',
        slug: 'fancy-anklets',
        parentSlug: 'anklets',
        description: 'Statement anklets with charms and layered details.',
      },
    ],
  },
  {
    id: 'cat-chains',
    name: 'Chains',
    slug: 'chains',
    description: 'Standalone chains for men, women, and kids.',
    image:
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800',
  },
  {
    id: 'cat-kadas',
    name: 'Kadas',
    slug: 'kadas',
    description: 'Bold cuffs and traditional kada silhouettes.',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800',
  },
  {
    id: 'cat-baby',
    name: 'Baby Jewellery',
    slug: 'baby-jewellery',
    description: 'Nazariya bracelets, baby kadas, and anklets crafted for tiny wrists.',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'baby-kadas',
        name: 'Baby Kadas',
        slug: 'baby-kadas',
        parentSlug: 'baby-jewellery',
        description: 'Rounded edges for safe everyday wear.',
      },
      {
        id: 'baby-nazariya',
        name: 'Nazariya Bracelets',
        slug: 'baby-nazariya',
        parentSlug: 'baby-jewellery',
        description: 'Black-bead talismans with silver charms.',
      },
      {
        id: 'baby-anklets',
        name: 'Baby Anklets',
        slug: 'baby-anklets',
        parentSlug: 'baby-jewellery',
        description: 'Soft anklets with bells and motifs.',
      },
      {
        id: 'baby-rings',
        name: 'Baby Rings',
        slug: 'baby-rings',
        parentSlug: 'baby-jewellery',
        description: 'Adjustable ring styles for gifting ceremonies.',
      },
      {
        id: 'baby-pendants',
        name: 'Baby Pendants',
        slug: 'baby-pendants',
        parentSlug: 'baby-jewellery',
        description: 'Tiny pendants with spiritual motifs.',
      },
    ],
  },
  {
    id: 'cat-pooja',
    name: 'Pooja Items',
    slug: 'pooja-items',
    description: 'Heritage silverware crafted for auspicious rituals.',
    image:
      'https://images.unsplash.com/photo-1472148083604-f4b0baf1c0a4?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'pooja-deepam',
        name: 'Deepams',
        slug: 'deepams',
        parentSlug: 'pooja-items',
        description: 'Traditional and Kamakshi deepam styles.',
      },
      {
        id: 'pooja-ashtalakshmi-chempu',
        name: 'Ashtalakshmi Chempu',
        slug: 'ashtalakshmi-chempu',
        parentSlug: 'pooja-items',
        description: 'Ashtalakshmi chempu crafted for auspicious rituals.',
      },
      {
        id: 'pooja-murthi',
        name: 'Murthi',
        slug: 'murthi',
        parentSlug: 'pooja-items',
        description: 'Divine forms for sanctums and homes.',
      },
      {
        id: 'pooja-stands',
        name: 'Agarbathi & Harathi Stands',
        slug: 'agarbathi-harathi-stands',
        parentSlug: 'pooja-items',
        description: 'Incense and arti holders to complete the ritual set.',
      },
    ],
  },
  {
    id: 'cat-coins',
    name: 'Coins',
    slug: 'coins',
    description: 'Investment-grade silver and gold coins for gifting and savings.',
    image:
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'coins-silver',
        name: 'Silver Coins',
        slug: 'silver-coins',
        parentSlug: 'coins',
        description: '999 purity coins in multiple weights.',
      },
      {
        id: 'coins-gold',
        name: 'Gold Coins',
        slug: 'gold-coins',
        parentSlug: 'coins',
        description: 'Assayer-certified gold coins.',
      },
      {
        id: 'coins-bars',
        name: 'Investment Bars',
        slug: 'investment-bars',
        parentSlug: 'coins',
        description: 'Silver and gold bars for portfolio building.',
      },
    ],
  },
  {
    id: 'cat-couple',
    name: 'Couple Jewellery',
    slug: 'couple-jewellery',
    description: 'Coordinated jewels designed for him and her.',
    image:
      'https://images.unsplash.com/photo-1522312298940-653d2b79db11?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'couple-rings',
        name: 'Couple Rings',
        slug: 'couple-rings',
        parentSlug: 'couple-jewellery',
        description: 'Matching ring sets with engravings.',
      },
      {
        id: 'couple-bracelets',
        name: 'Couple Bracelets',
        slug: 'couple-bracelets',
        parentSlug: 'couple-jewellery',
        description: 'Coordinated bracelet duos.',
      },
      {
        id: 'couple-pendants',
        name: 'His & Her Pendants',
        slug: 'couple-pendants',
        parentSlug: 'couple-jewellery',
        description: 'Puzzle pendants that connect as one.',
      },
      {
        id: 'couple-bangles',
        name: 'Couple Bangles / Kadas',
        slug: 'couple-bangles-kadas',
        parentSlug: 'couple-jewellery',
        description: 'Paired kada designs for the couple.',
      },
    ],
  },
  {
    id: 'cat-articles',
    name: 'Articles',
    slug: 'articles',
    description: 'Purposeful silverware accents for home and dining.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800',
    subCategories: [
      {
        id: 'articles-bowls',
        name: 'Bowls',
        slug: 'silver-bowls',
        parentSlug: 'articles',
        description: 'Decorative and dining-ready bowls.',
      },
      {
        id: 'articles-spoons',
        name: 'Spoons',
        slug: 'silver-spoons',
        parentSlug: 'articles',
        description: 'Intricately crafted spoons for rituals and dining.',
      },
      {
        id: 'articles-kumkum',
        name: 'Kumkum Barni',
        slug: 'kumkum-barni',
        parentSlug: 'articles',
        description: 'Keepsakes for sindoor and kumkum storage.',
      },
      {
        id: 'articles-chembu',
        name: 'Chembu',
        slug: 'articles-chembu',
        parentSlug: 'articles',
        description: 'Traditional chembu vessels for rituals and dining.',
      },
      {
        id: 'articles-plates',
        name: 'Plates',
        slug: 'silver-plates',
        parentSlug: 'articles',
        description: 'Serving and ceremonial plates with intricate detailing.',
      },
      {
        id: 'articles-flowers',
        name: 'Flowers',
        slug: 'silver-flowers',
        parentSlug: 'articles',
        description: 'Handcrafted florals and home accents.',
      },
    ],
  },
];

const parentCategories = categories.filter(category => category.slug !== 'all');

export const topLevelCategories = parentCategories;

type RawCategory = (typeof categories)[number];
type RawChildCategory = NonNullable<RawCategory['subCategories']>[number];

const toChildOption = (child: RawChildCategory): ChildCategoryOption => ({
  slug: child.slug,
  name: child.name,
  value: child.slug,
  parentSlug: child.parentSlug,
  description: child.description,
});

export const subCategoryMap: Record<string, ChildCategoryOption[]> = parentCategories.reduce(
  (acc, category) => {
    acc[category.slug] = category.subCategories?.map(toChildOption) ?? [];
    return acc;
  },
  {} as Record<string, ChildCategoryOption[]>
);

export const categorySearchIndex = parentCategories.reduce<CategoryHierarchyData['searchIndex']>(
  (acc, parent) => {
    const childNames = parent.subCategories?.map(child => child.name.toLowerCase()) ?? [];

    const parentMeta: CategoryMeta = {
      value: parent.slug,
      label: parent.name,
      rawLabel: parent.name,
      type: 'parent',
      parentSlug: parent.slug,
      parentName: parent.name,
    };

    acc.push({
      value: parent.slug,
      label: parent.name,
      type: 'parent',
      meta: parentMeta,
      searchTerms: [parent.name.toLowerCase(), ...childNames],
    });

    parent.subCategories?.forEach(child => {
      const childMeta: CategoryMeta = {
        value: child.slug,
        label: `${parent.name} › ${child.name}`,
        rawLabel: child.name,
        type: 'child',
        parentSlug: parent.slug,
        parentName: parent.name,
      };

      acc.push({
        value: child.slug,
        label: `${parent.name} › ${child.name}`,
        type: 'child',
        meta: childMeta,
        searchTerms: [child.name.toLowerCase(), parent.name.toLowerCase()],
      });
    });

    return acc;
  },
  []
);

export const categorySlugLookup: Record<string, CategoryMeta> = categorySearchIndex.reduce(
  (acc, entry) => {
    acc[entry.value] = entry.meta;
    return acc;
  },
  {
    all: {
      value: 'all',
      label: 'All Products',
      rawLabel: 'All Products',
      type: 'all',
      parentSlug: 'all',
      parentName: 'All Products',
    },
  } as Record<string, CategoryMeta>
);

// Generate dropdown categories from the main categories array, excluding 'All Products'
const dropDownCategories = parentCategories.map(({ slug, name }) => ({
  value: slug,
  label: name,
}));

export const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'name-a-z', label: 'Name: A to Z' },
  { value: 'name-z-a', label: 'Name: Z to A' },
];

const metalTypeOptions = [
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
];

export const metalTypeFilterOptions = [
  { value: 'all', label: 'All Metals' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
];

export const formFields = [
  { label: 'Product ID', value: 'product_id', type: 'text' },
  { label: 'Product Name', value: 'name', type: 'text' },
  { label: 'Description', value: 'description', type: 'textarea' },
  { label: 'Weight', value: 'weight', type: 'number' },
  { label: 'Fixed Price', value: 'fixed_price', type: 'number' },
  { label: 'Making Charges', value: 'making_charges', type: 'number' },
  {
    label: 'Category / Subcategory',
    value: 'category',
    type: 'select',
    options: dropDownCategories,
  },
  {
    label: 'Metal Type',
    value: 'metal_type',
    type: 'select',
    options: metalTypeOptions,
  },
];

import { ProductFormLabel, ProductFormMode } from './productConstants';

export const apiType = [
  { value: ProductFormMode.ADD, label: ProductFormLabel[ProductFormMode.ADD] },
  { value: ProductFormMode.EDIT, label: ProductFormLabel[ProductFormMode.EDIT] },
  {
    value: ProductFormMode.ADD_CAROUSEL_IMAGE,
    label: ProductFormLabel[ProductFormMode.ADD_CAROUSEL_IMAGE],
  },
];
