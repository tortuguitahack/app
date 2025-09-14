import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, onAddToCart, title = "Our Collection" }) => {
  return (
    <section className="section-padding-small">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 className="hero-medium" style={{ marginBottom: '16px' }}>
            {title}
          </h2>
          <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
            Handpicked selection of premium spirits
          </p>
        </div>

        <div className="grid-product-showcase">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};