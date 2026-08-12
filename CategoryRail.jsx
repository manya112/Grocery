import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { categories } from '../data/products';

export default function CategoryRail({ activeCategory, onSelect }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (name) => {
    if (onSelect) {
      onSelect(name);
    } else {
      navigate(`/products?category=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="category-rail-wrap">
      <button
        className={`cat-pill ${!activeCategory ? 'active' : ''}`}
        onClick={() => onSelect ? onSelect('') : navigate('/products')}
      >
        <i className="bi bi-grid-fill" /> All
      </button>
      {categories.map((c) => (
        <button
          key={c.name}
          className={`cat-pill ${activeCategory === c.name ? 'active' : ''}`}
          onClick={() => handleClick(c.name)}
        >
          <i className={`bi ${c.icon}`} /> {c.name}
        </button>
      ))}
    </div>
  );
}
