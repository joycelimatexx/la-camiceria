'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { PRODUCTS, CATEGORIES } from '@/lib/products'

interface ProductGridProps {
  onSelect: (product: Product) => void
  selectedId?: string
}

export default function ProductGrid({ onSelect, selectedId }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`text-label whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-navy-900 text-cream'
                : 'bg-sand-100 text-navy-500 hover:bg-sand-200'
            }`}
            style={{ fontSize: '0.65rem' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => {
          const isSelected = product.id === selectedId
          return (
            <button
              key={product.id}
              onClick={() => onSelect(product)}
              className={`product-card group text-left rounded-xl overflow-hidden transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-navy-900 ring-offset-2 ring-offset-cream'
                  : ''
              }`}
            >
              {/* Image */}
              <div className="aspect-[3/4] bg-sand-100 overflow-hidden relative">
                <div className="product-image w-full h-full bg-gradient-to-br from-sand-100 to-sand-200 flex items-center justify-center">
                  {/* Placeholder — substituir por img real */}
                  <div className="text-center p-4">
                    <div
                      className="w-full h-32 rounded-lg mb-3 mx-auto opacity-40"
                      style={{ background: `linear-gradient(135deg, ${product.colors[0]}22, ${product.colors[0]}44)` }}
                    />
                    <div
                      className="w-8 h-8 rounded-full mx-auto"
                      style={{ background: product.colors[0] }}
                    />
                  </div>
                </div>

                {/* Selected overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-navy-900/20 flex items-center justify-center">
                    <div className="w-10 h-10 bg-navy-900 rounded-full flex items-center justify-center shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2.5 8L6.5 12L13.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="text-label bg-cream/90 text-navy-700 px-2 py-1 rounded" style={{ fontSize: '0.55rem' }}>
                    {product.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 bg-off-white">
                <p className="font-serif text-navy-900 text-sm font-medium leading-tight">
                  {product.name}
                </p>
                <p className="font-body text-sand-500 text-xs mt-1 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Colors */}
                <div className="flex items-center gap-1.5 mt-2">
                  {product.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full border border-sand-200"
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
