import ankletsImage from '../assets/images/categories/anklets.jpg';
import articlesImage from '../assets/images/categories/articles.jpg';
import bangleImage from '../assets/images/categories/bangle.jpg';
import braceletsImage from '../assets/images/categories/bracelets.jpg';
import chainImage from '../assets/images/categories/chain.jpg';
import coinsImage from '../assets/images/categories/coins.jpg';
import coupleJewelleryImage from '../assets/images/categories/couple-jewellery.jpg';
import earringsImage from '../assets/images/categories/earrings.jpg';
import kadaImage from '../assets/images/categories/kada.jpg';
import necklaceImage from '../assets/images/categories/necklace.jpg';
import pendantsImage from '../assets/images/categories/pendants.jpg';
import poojaItemsImage from '../assets/images/categories/pooja-items.jpg';
import rakhiImage from '../assets/images/categories/rakhi.jpg';
import ringsImage from '../assets/images/categories/rings.jpg';
import toeRingImage from '../assets/images/categories/toe-ring.jpg';
import babyJewelleryImage from '../assets/images/categories/baby-jewellery.jpg';

import type { CategoryHierarchyData, CategoryMeta, ChildCategoryOption } from '../types/product';

import { ProductFormLabel, ProductFormMode } from './productConstants';

export const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920',
    title: 'Luxury Collection',
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

export const categories = [
  {
    id: 'cat-all',
    name: 'All Products',
    slug: 'all',
    description: 'Browse every curation across jewellery, pooja collections, and gifting.',
    image: articlesImage,
  },

  {
    id: 'cat-anklets',
    name: 'Anklets',
    slug: 'anklets',
    description: 'Delicate chains and ghungroo anklets in silver and gold for every style.',
    image: ankletsImage,
    subCategories: [
      {
        id: 'anklets-beaded',
        name: 'Beaded Anklets',
        slug: 'beaded-anklets',
        parentSlug: 'anklets',
        description: 'Pearl and gemstone strung anklets on silver and gold bases.',
      },
      {
        id: 'anklets-bridal',
        name: 'Bridal Anklets',
        slug: 'bridal-anklets',
        parentSlug: 'anklets',
        description: 'Elaborate anklets with ghungroo cascades in silver and gold.',
      },
      {
        id: 'anklets-everyday',
        name: 'Everyday Anklets',
        slug: 'everyday-anklets',
        parentSlug: 'anklets',
        description: 'Lightweight anklets made for comfortable daily wear in silver and gold.',
      },
      {
        id: 'anklets-fancy',
        name: 'Fancy Anklets',
        slug: 'fancy-anklets',
        parentSlug: 'anklets',
        description: 'Statement anklets with charms and layered details in silver and gold.',
      },
    ],
  },

  {
    id: 'cat-articles',
    name: 'Articles',
    slug: 'articles',
    description: 'Purposeful accents for home and dining crafted in silver and gold.',
    image: articlesImage,
    subCategories: [
      {
        id: 'articles-bowls',
        name: 'Bowls',
        slug: 'silver-bowls',
        parentSlug: 'articles',
        description: 'Decorative and dining-ready bowls crafted in silver and gold.',
      },
      {
        id: 'articles-chembu',
        name: 'Chembu',
        slug: 'articles-chembu',
        parentSlug: 'articles',
        description:
          'Traditional chembu vessels crafted in silver and gold for rituals and dining.',
      },
      {
        id: 'articles-flowers',
        name: 'Flowers',
        slug: 'silver-flowers',
        parentSlug: 'articles',
        description: 'Handcrafted florals and home accents in silver and gold.',
      },
      {
        id: 'articles-glass',
        name: 'Glass',
        slug: 'articles-glass',
        parentSlug: 'articles',
        description: 'Glassware accented in silver and gold for serving and decor.',
      },
      {
        id: 'articles-gift-items',
        name: 'Gift Items',
        slug: 'gift-items',
        parentSlug: 'articles',
        description: 'Thoughtful gifting-ready accessories in silver and gold.',
      },
      {
        id: 'articles-kumkum',
        name: 'Kumkum Barni',
        slug: 'kumkum-barni',
        parentSlug: 'articles',
        description: 'Keepsakes for sindoor and kumkum storage in silver and gold.',
      },
      {
        id: 'articles-plates',
        name: 'Plates',
        slug: 'silver-plates',
        parentSlug: 'articles',
        description: 'Serving and ceremonial plates with intricate detailing in silver and gold.',
      },
      {
        id: 'articles-spoons',
        name: 'Spoons',
        slug: 'silver-spoons',
        parentSlug: 'articles',
        description: 'Intricately crafted spoons for rituals and dining in silver and gold.',
      },
    ],
  },

  {
    id: 'cat-baby',
    name: 'Baby Jewellery',
    slug: 'baby-jewellery',
    description:
      'Nazariya bracelets, baby kadas, and anklets crafted in hypoallergenic silver and gold for tiny wrists.',
    image: babyJewelleryImage,
    subCategories: [
      {
        id: 'baby-anklets',
        name: 'Baby Anklets',
        slug: 'baby-anklets',
        parentSlug: 'baby-jewellery',
        description: 'Soft anklets with bells and motifs in silver and gold.',
      },
      {
        id: 'baby-kadas',
        name: 'Baby Kadas',
        slug: 'baby-kadas',
        parentSlug: 'baby-jewellery',
        description: 'Rounded edges in silver and gold for safe everyday wear.',
      },
      {
        id: 'baby-pendants',
        name: 'Baby Pendants',
        slug: 'baby-pendants',
        parentSlug: 'baby-jewellery',
        description: 'Tiny pendants with spiritual motifs in silver and gold.',
      },
      {
        id: 'baby-rings',
        name: 'Baby Rings',
        slug: 'baby-rings',
        parentSlug: 'baby-jewellery',
        description: 'Adjustable ring styles for gifting ceremonies in silver and gold.',
      },
      {
        id: 'baby-gift-items',
        name: 'Gift Items',
        slug: 'baby-gift-items',
        parentSlug: 'baby-jewellery',
        description:
          'Keepsake gift sets in silver and gold for naming ceremonies and first milestones.',
      },
      {
        id: 'baby-nazariya',
        name: 'Nazariya Bracelets',
        slug: 'baby-nazariya',
        parentSlug: 'baby-jewellery',
        description: 'Black-bead talismans with silver and gold charms.',
      },
    ],
  },

  {
    id: 'cat-bangles',
    name: 'Bangles',
    slug: 'bangles',
    description: 'Traditional kada sets and contemporary stackers fashioned in silver and gold.',
    image: bangleImage,
  },

  {
    id: 'cat-bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description:
      'Flexible chains, tennis classics, and cuff silhouettes crafted in silver and gold.',
    image: braceletsImage,
  },

  {
    id: 'cat-chains',
    name: 'Chains',
    slug: 'chains',
    description: 'Standalone chains for men, women, and kids in silver and gold finishes.',
    image: chainImage,
  },

  {
    id: 'cat-coins',
    name: 'Coins',
    slug: 'coins',
    description: 'Investment-grade silver and gold coins for gifting and savings.',
    image: coinsImage,
    subCategories: [
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
      {
        id: 'coins-silver',
        name: 'Silver Coins',
        slug: 'silver-coins',
        parentSlug: 'coins',
        description: '999 purity coins in multiple weights.',
      },
    ],
  },

  {
    id: 'cat-couple',
    name: 'Couple Jewellery',
    slug: 'couple-jewellery',
    description: 'Coordinated jewels designed for him and her in matching silver and gold motifs.',
    image: coupleJewelleryImage,
    subCategories: [
      {
        id: 'couple-bangles',
        name: 'Couple Bangles / Kadas',
        slug: 'couple-bangles-kadas',
        parentSlug: 'couple-jewellery',
        description: 'Paired kada designs for the couple.',
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
        id: 'couple-rings',
        name: 'Couple Rings',
        slug: 'couple-rings',
        parentSlug: 'couple-jewellery',
        description: 'Matching ring sets with engravings.',
      },
    ],
  },

  {
    id: 'cat-earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Studs, hoops, jhumkas, and chandbalis in silver and gold to frame every look.',
    image: earringsImage,
  },

  {
    id: 'cat-kadas',
    name: 'Kadas',
    slug: 'kadas',
    description: 'Bold cuffs and traditional kada silhouettes crafted in silver and gold.',
    image: kadaImage,
  },

  {
    id: 'cat-necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description:
      'Layered chains, heritage chokers, and contemporary pendants crafted in silver and gold.',
    image: necklaceImage,
    subCategories: [
      {
        id: 'necklaces-chokers',
        name: 'Chokers',
        slug: 'choker-necklaces',
        parentSlug: 'necklaces',
        description: 'Close-set chokers embellished with gemstones in silver and gold.',
      },
      {
        id: 'necklaces-mangalsutra',
        name: 'Mangalsutras',
        slug: 'mangalsutras',
        parentSlug: 'necklaces',
        description: 'Modern renditions of the sacred mangalsutra in silver and gold.',
      },
      {
        id: 'necklaces-rani-haar',
        name: 'Rani Haar',
        slug: 'rani-haar',
        parentSlug: 'necklaces',
        description: 'Layered royal haars with intricate motifs crafted in silver and gold.',
      },
    ],
  },

  {
    id: 'cat-pendants',
    name: 'Pendants',
    slug: 'pendants',
    description: 'Solitaire, spiritual, and motif-driven pendants crafted for effortless styling.',
    image: pendantsImage,
  },

  {
    id: 'cat-pooja',
    name: 'Pooja Items',
    slug: 'pooja-items',
    description: 'Heritage ritualware crafted in silver and gold for auspicious ceremonies.',
    image: poojaItemsImage,
    subCategories: [
      {
        id: 'pooja-stands',
        name: 'Agarbathi & Harathi Stands',
        slug: 'agarbathi-harathi-stands',
        parentSlug: 'pooja-items',
        description: 'Incense and arti holders in silver and gold to complete the ritual set.',
      },
      {
        id: 'pooja-ashtalakshmi-chempu',
        name: 'Ashtalakshmi Chempu',
        slug: 'ashtalakshmi-chempu',
        parentSlug: 'pooja-items',
        description: 'Ashtalakshmi chempu crafted in silver and gold for auspicious rituals.',
      },
      {
        id: 'pooja-deepam',
        name: 'Deepams',
        slug: 'deepams',
        parentSlug: 'pooja-items',
        description: 'Traditional and Kamakshi deepam styles in silver and gold.',
      },
      {
        id: 'pooja-murthi',
        name: 'Murthi',
        slug: 'murthi',
        parentSlug: 'pooja-items',
        description: 'Divine forms for sanctums and homes sculpted in silver and gold.',
      },
    ],
  },

  {
    id: 'cat-rakhi',
    name: 'Rakhi',
    slug: 'rakhi',
    description:
      'Traditional and contemporary Rakhis curated for celebrating the special bond between brothers and sisters.',
    image: rakhiImage,
  },

  {
    id: 'cat-rings',
    name: 'Rings',
    slug: 'rings',
    description:
      'Signature engagement rings to gemstone statements crafted in silver and gold for every milestone.',
    image: ringsImage,
  },

  {
    id: 'cat-toe-rings',
    name: 'Toe Rings',
    slug: 'toe-rings',
    description:
      'Heritage and contemporary toe rings in silver and gold for daily wear and bridal sets.',
    image: toeRingImage,
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

const dropDownCategories = parentCategories.map(({ slug, name }) => ({
  value: slug,
  label: name,
}));

export const sortOptions = [
  { value: 'default', label: 'Default' },
  {
    value: 'price-low-high',
    label: 'Price: Low to High',
  },
  {
    value: 'price-high-low',
    label: 'Price: High to Low',
  },
  {
    value: 'name-a-z',
    label: 'Name: A to Z',
  },
  {
    value: 'name-z-a',
    label: 'Name: Z to A',
  },
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
  {
    label: 'Product ID',
    value: 'product_id',
    type: 'text',
  },
  {
    label: 'Product Name',
    value: 'name',
    type: 'text',
  },
  {
    label: 'Description',
    value: 'description',
    type: 'textarea',
  },
  {
    label: 'Weight',
    value: 'weight',
    type: 'number',
  },
  {
    label: 'Fixed Price',
    value: 'fixed_price',
    type: 'number',
  },
  {
    label: 'Making Charges',
    value: 'making_charges',
    type: 'number',
  },
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

export const apiType = [
  {
    value: ProductFormMode.ADD,
    label: ProductFormLabel[ProductFormMode.ADD],
  },
  {
    value: ProductFormMode.EDIT,
    label: ProductFormLabel[ProductFormMode.EDIT],
  },
  {
    value: ProductFormMode.ADD_CAROUSEL_IMAGE,
    label: ProductFormLabel[ProductFormMode.ADD_CAROUSEL_IMAGE],
  },
];
