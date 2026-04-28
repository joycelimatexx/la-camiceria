// ============================================
// LA CAMICERIA — Catalog de Produtos
// ============================================

import { Product } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: 'camisa-linho-azul',
    name: 'Camisa de Linho Azul',
    category: 'camisa',
    categoryLabel: 'Camisa',
    imageUrl: '/products/camisa-linho-azul.jpg',
    colors: ['#1B3A6B', '#2E5FA3'],
    description: 'Linho italiano premium, corte slim elegante. Perfeita para o mediterrâneo.',
    featured: true,
  },
  {
    id: 'camisa-oxford-branca',
    name: 'Camisa Oxford Branca',
    category: 'camisa',
    categoryLabel: 'Camisa',
    imageUrl: '/products/camisa-oxford-branca.jpg',
    colors: ['#FFFFFF', '#F5F5F0'],
    description: 'Oxford inglês de algodão puro, colarinho button-down. Atemporal.',
    featured: true,
  },
  {
    id: 'polo-pique-navy',
    name: 'Polo Piquet Navy',
    category: 'polo',
    categoryLabel: 'Polo',
    imageUrl: '/products/polo-pique-navy.jpg',
    colors: ['#102A43', '#243B53'],
    description: 'Piquet egípcio premium, ajuste perfeito. Sofisticação casual.',
    featured: true,
  },
  {
    id: 'polo-linho-areia',
    name: 'Polo Linho Areia',
    category: 'polo',
    categoryLabel: 'Polo',
    imageUrl: '/products/polo-linho-areia.jpg',
    colors: ['#C8B49A', '#B5997E'],
    description: 'Linho respirável, tom areia mediterrâneo. Resort de alto padrão.',
  },
  {
    id: 'bermuda-toscana',
    name: 'Bermuda Toscana',
    category: 'bermuda',
    categoryLabel: 'Bermuda',
    imageUrl: '/products/bermuda-toscana.jpg',
    colors: ['#627D98', '#334E68'],
    description: 'Sarja italiana, corte chino, acabamento impecável. Elegância acima do joelho.',
    featured: true,
  },
  {
    id: 'bermuda-linho-cru',
    name: 'Bermuda Linho Cru',
    category: 'bermuda',
    categoryLabel: 'Bermuda',
    imageUrl: '/products/bermuda-linho-cru.jpg',
    colors: ['#E8DDD0', '#D9C9B5'],
    description: 'Linho cru natural, silhueta relaxada. Para o verão europeu.',
  },
  {
    id: 'trico-cotton-cinza',
    name: 'Tricô Cotton Cinza',
    category: 'trico',
    categoryLabel: 'Tricô',
    imageUrl: '/products/trico-cotton-cinza.jpg',
    colors: ['#829AB1', '#627D98'],
    description: 'Cotton mercerizado, ponto inglês, fit estruturado. Outono perfeito.',
  },
  {
    id: 'blazer-linho-marfim',
    name: 'Blazer de Linho Marfim',
    category: 'blazer',
    categoryLabel: 'Blazer',
    imageUrl: '/products/blazer-linho-marfim.jpg',
    colors: ['#F5F0E8', '#E8DDD0'],
    description: 'Linho estruturado, sem forro, dois botões. Sofisticação italiana.',
    featured: true,
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(p => p.featured)

export const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'camisa', label: 'Camisas' },
  { id: 'polo', label: 'Polos' },
  { id: 'bermuda', label: 'Bermudas' },
  { id: 'trico', label: 'Tricôs' },
  { id: 'blazer', label: 'Blazers' },
]
