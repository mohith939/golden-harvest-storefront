// Tadepalli store catalog — every product is priced at a flat Rs.300.
// Edit names/categories here; prices are derived from TADEPALLI_PRICE.

export const TADEPALLI_PRICE = 300;

export interface TadepalliProduct {
  id: string;
  name: string;
  category: string;
  price: number;
}

const CATALOG: Record<string, string[]> = {
  Powders: [
    'Neem Powder',
    'Apple Powder',
    'Curry Leaves Powder',
    'Banana Powder',
    'Jaggery Powder',
    'Lemon Powder',
    'Beetroot Powder',
    'Moringa Powder',
    'Ginger Powder',
    'Garlic Powder',
    'Beetroot Powder (50g)',
    'Dates (50g)',
    'Spinach (50g)',
    'Banana Powder (50g)',
    'Neem Powder (50g)',
    'Amla Powder (50g)',
    'Moringa Powder (50g)',
  ],
  'Millet Products': [
    "Spinach & Moringa Millet's Atta",
    "Beetroot & Carrot Millet's Atta",
    'Spinach & Moringa Millet Instant Dosa Mix',
    'Beetroot & Carrot Millet Instant Dosa Mix',
  ],
  'Baby Products': [
    'Nutri Milk',
    'Jowar Nuts Mix',
    'Jowar Veggies Mix',
    'Ragi Nuts Mix',
    'Ragi Veggies Mix',
    'Weigh Grain Uggu',
  ],
  Fruits: ['Banana', 'Pineapple', 'Strawberry'],
  'Hair & Personal Care': [
    'Herbal Shampoo 200ml',
    'Herbal Shampoo 100ml',
    'Hibiscus Shampoo 100ml',
    'Sidy Shampoo 100ml',
    'Herbal Hair Oil 100ml',
  ],
  'Lip Products': ['Winter Monsoon Lip Balm', 'Straw Lip Tint', 'Cherry Lip Balm'],
  Soaps: [
    'Honey & Almond Soap',
    'Camel Milk Bar',
    'Papaya Bar',
    'Charcoal Bar',
    'Sandal Bathing Bar',
    'Toy Soap',
  ],
  'Mini Soaps': [
    'Papaya Mini Bar',
    'Sandal Mini Bar',
    'Honey & Almond Mini Bar',
    'Charcoal Mini Bar',
    'Camel Milk Mini Bar',
  ],
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const tadepalliCategories = Object.keys(CATALOG);

export const tadepalliProducts: TadepalliProduct[] = tadepalliCategories.flatMap((category) =>
  CATALOG[category].map((name) => ({
    id: slugify(name),
    name,
    category,
    price: TADEPALLI_PRICE,
  }))
);

export const getTadepalliProduct = (id?: string) =>
  tadepalliProducts.find((p) => p.id === id);
