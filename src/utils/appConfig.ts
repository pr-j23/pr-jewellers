export const BRAND_INFO = {
  name: 'Pavan Jewellers',
} as const;

export const STORE_CONTACT = {
  address: '21-3-88, Chelapuara, Ghansi Bazar, Hyderabad 500 002',
  landline: '040-66514933',
  mobile: '+91-6304170035',
  email: 'contact@pavanjewellers.in',
  whatsappNumber: '914066514933',
  hours: {
    weekDays: 'Mon - Sat: 11:00 AM - 10:00 PM',
    weekend: 'Sun: 11:00 AM - 5:00 PM',
  },
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/pavanjewellers/',
  facebook: 'https://www.facebook.com/groups/69151418603232',
} as const;

export const MAP_CONFIG = {
  storeLocationUrl: 'https://maps.app.goo.gl/o8qayPeMpNYDTNZ49',
} as const;

export const DEFAULT_MEDIA = {
  storeImage:
    'https://images.unsplash.com/photo-1527015175922-36a306cf0e20?auto=format&fit=crop&w=800',
} as const;

export const LOGIN_CREDENTIALS = {
  email: 'admin@admin.com',
  password: 'Admin@2580',
} as const;
