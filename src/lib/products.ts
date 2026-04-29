// ============================================
// LA CAMICERIA — Catálogo de Produtos
// ============================================

import { Product } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 'costume-maestro-cinza',
    name: 'Costume Maestro Cinza Claro',
    category: 'costume',
    categoryLabel: 'Costume',
    imageUrl: '/products/costume-maestro-cinza.png',
    colors: ['#BEBEBE', '#A9A9A9'],
    description: 'Corte slim refinado, cinza claro com caimento impecável.',
    featured: true,
  },
  {
    id: 'costume-stilo-xadrez-preto-azulmarinho',
    name: 'Costume Stilo Xadrez',
    category: 'costume',
    categoryLabel: 'Costume',
    imageUrl: '/products/costume-stilo-xadrez-preto-azulmarinho.png',
    colors: ['#1a1a1a', '#102A43'],
    description: 'Corte slim em xadrez sofisticado, preto e azul marinho.',
    featured: true,
  },
  {
    id: 'costume-eleganza-cinzapretoazulmarinho',
    name: 'Costume Eleganza',
    category: 'costume',
    categoryLabel: 'Costume',
    imageUrl: '/products/costume-eleganza-cinzapretoazulmarinho.png',
    colors: ['#BEBEBE', '#1a1a1a', '#102A43'],
    description: 'Corte slim em paleta tricolor: cinza, preto e azul marinho.',
    featured: true,
  },
  {
    id: 'costume-supremo-azulclaroazulmarinho',
    name: 'Costume Supremo',
    category: 'costume',
    categoryLabel: 'Costume',
    imageUrl: '/products/costume-supremo-azulclaroazulmarinho.png',
    colors: ['#6FA3BF', '#102A43'],
    description: 'Corte tradicional elegante em azul claro e azul marinho.',
    featured: true,
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.featured)

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'costume', label: 'Costumes' },
]
