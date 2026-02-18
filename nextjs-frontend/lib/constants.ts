export const BRAND = {
  name: 'YuvaGlow',
  fullName: 'YuvaGlow Professional Co.',
  tagline: 'Premium Salon Hair Care',
  phone: '+91 73000 45513',
  tel: 'tel:+917300045513',
  whatsapp: 'https://wa.me/917300045513',
  email: 'hello@yuvaglow.com',
  address: 'India',
  instagram: 'https://instagram.com/yuvaglow',
  facebook: 'https://facebook.com/yuvaglow',
};

export const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/about/',    label: 'About' },
  { href: '/products/', label: 'Products' },
  { href: '/gallery/',  label: 'Gallery' },
  { href: '/blog/',     label: 'Blog' },
  { href: '/career/',   label: 'Careers' },
  { href: '/partners/', label: 'Partners' },
  { href: '/contact/',  label: 'Contact' },
];

export const PRODUCT_CATEGORIES = [
  {
    slug: 'hair',
    label: 'Hair Care',
    description: 'Nourishing treatments, serums & shampoos for luminous hair.',
    gradient: 'from-amber-50 to-amber-100',
    emoji: '💆‍♀️',
  },
  {
    slug: 'skin',
    label: 'Skin Care',
    description: 'Botanical serums and creams for radiant, healthy skin.',
    gradient: 'from-rose-50 to-rose-100',
    emoji: '✨',
  },
  {
    slug: 'makeup',
    label: 'Makeup',
    description: 'Premium colour cosmetics crafted for professional results.',
    gradient: 'from-pink-50 to-pink-100',
    emoji: '💄',
  },
  {
    slug: 'salon',
    label: 'Salon Tools',
    description: 'Professional-grade tools designed for precision & elegance.',
    gradient: 'from-stone-50 to-stone-100',
    emoji: '✂️',
  },
];

export interface ChatNode {
  id: string;
  text: string;
  options?: { label: string; next: string }[];
  action?: 'navigate' | 'phone' | 'whatsapp' | 'email' | 'reset';
  actionValue?: string;
}

export const CHATBOT_TREE: Record<string, ChatNode> = {
  root: {
    id: 'root',
    text: "Hello! I'm your YuvaGlow assistant. How can I help you today?",
    options: [
      { label: 'Our Products',  next: 'products' },
      { label: 'Partnerships',  next: 'partners' },
      { label: 'Careers',       next: 'careers' },
      { label: 'Contact Us',    next: 'contact' },
      { label: 'About YuvaGlow', next: 'about' },
    ],
  },
  products: {
    id: 'products',
    text: 'Which category are you interested in?',
    options: [
      { label: 'Hair Care',    next: 'product_hair' },
      { label: 'Skin Care',    next: 'product_skin' },
      { label: 'Makeup',       next: 'product_makeup' },
      { label: 'Salon Tools',  next: 'product_salon' },
      { label: '← Back',       next: 'root' },
    ],
  },
  product_hair: {
    id: 'product_hair',
    text: 'Explore our nourishing Hair Care range!',
    options: [
      { label: 'Browse Hair Care', next: 'nav_hair' },
      { label: 'WhatsApp Us',       next: 'whatsapp' },
      { label: '← Back',            next: 'products' },
    ],
  },
  product_skin: {
    id: 'product_skin',
    text: 'Discover our botanical Skin Care collection!',
    options: [
      { label: 'Browse Skin Care', next: 'nav_skin' },
      { label: 'WhatsApp Us',       next: 'whatsapp' },
      { label: '← Back',            next: 'products' },
    ],
  },
  product_makeup: {
    id: 'product_makeup',
    text: 'Explore our premium Makeup range!',
    options: [
      { label: 'Browse Makeup', next: 'nav_makeup' },
      { label: 'WhatsApp Us',    next: 'whatsapp' },
      { label: '← Back',         next: 'products' },
    ],
  },
  product_salon: {
    id: 'product_salon',
    text: 'Check out our professional Salon Tools!',
    options: [
      { label: 'Browse Salon Tools', next: 'nav_salon' },
      { label: 'WhatsApp Us',         next: 'whatsapp' },
      { label: '← Back',              next: 'products' },
    ],
  },
  nav_hair:   { id: 'nav_hair',   text: 'Opening Hair Care...', action: 'navigate', actionValue: '/products/hair/' },
  nav_skin:   { id: 'nav_skin',   text: 'Opening Skin Care...', action: 'navigate', actionValue: '/products/skin/' },
  nav_makeup: { id: 'nav_makeup', text: 'Opening Makeup...',    action: 'navigate', actionValue: '/products/makeup/' },
  nav_salon:  { id: 'nav_salon',  text: 'Opening Salon Tools...', action: 'navigate', actionValue: '/products/salon/' },
  whatsapp:   { id: 'whatsapp',   text: 'Connecting to WhatsApp...', action: 'whatsapp', actionValue: 'https://wa.me/917300045513' },

  partners: {
    id: 'partners',
    text: 'Are you interested in becoming a partner with YuvaGlow?',
    options: [
      { label: 'Super Stockist',   next: 'partner_stockist' },
      { label: 'Distributor',      next: 'partner_distributor' },
      { label: '← Back',           next: 'root' },
    ],
  },
  partner_stockist: {
    id: 'partner_stockist',
    text: 'Become a Super Stockist and expand your business with YuvaGlow!',
    options: [
      { label: 'Apply Now',    next: 'nav_partners' },
      { label: 'Call Us',      next: 'call' },
      { label: '← Back',       next: 'partners' },
    ],
  },
  partner_distributor: {
    id: 'partner_distributor',
    text: 'Join our Distributor network and reach customers across your region!',
    options: [
      { label: 'Apply Now',    next: 'nav_partners' },
      { label: 'Call Us',      next: 'call' },
      { label: '← Back',       next: 'partners' },
    ],
  },
  nav_partners: { id: 'nav_partners', text: 'Opening Partners page...', action: 'navigate', actionValue: '/partners/' },

  careers: {
    id: 'careers',
    text: 'We are growing! To view open positions or apply, visit our Careers page or email your CV to careers@yuvaglow.com.',
    options: [
      { label: 'View Openings', next: 'nav_careers' },
      { label: 'Email CV',       next: 'email_careers' },
      { label: '← Back',         next: 'root' },
    ],
  },
  nav_careers:   { id: 'nav_careers',   text: 'Opening Careers page...', action: 'navigate', actionValue: '/career/' },
  email_careers: { id: 'email_careers', text: 'Opening email...', action: 'email', actionValue: 'mailto:careers@yuvaglow.com' },

  contact: {
    id: 'contact',
    text: 'How would you like to reach us?',
    options: [
      { label: 'Call / WhatsApp', next: 'call' },
      { label: 'Visit Contact Page', next: 'nav_contact' },
      { label: 'Email Us',           next: 'email_general' },
      { label: '← Back',             next: 'root' },
    ],
  },
  call:          { id: 'call',          text: 'Calling us at +91 73000 45513...', action: 'phone', actionValue: 'tel:+917300045513' },
  nav_contact:   { id: 'nav_contact',   text: 'Opening Contact page...', action: 'navigate', actionValue: '/contact/' },
  email_general: { id: 'email_general', text: 'Opening email...', action: 'email', actionValue: 'mailto:hello@yuvaglow.com' },

  about: {
    id: 'about',
    text: 'YuvaGlow Professional Co. crafts premium, nature-inspired hair and beauty products for salons and consumers across India.',
    options: [
      { label: 'Learn More', next: 'nav_about' },
      { label: '← Back',     next: 'root' },
    ],
  },
  nav_about: { id: 'nav_about', text: 'Opening About page...', action: 'navigate', actionValue: '/about/' },
};
