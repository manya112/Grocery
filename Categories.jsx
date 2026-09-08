import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '../data/products';

export default function Categories() {
  const navigate = useNavigate();

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '80vh' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <p className="eyebrow">OUR AISLES</p>
          <h1 style={{ fontSize: '2rem' }}>Shop the way you like.</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
            Every aisle is stocked with well-chosen products for your day-to-day life.
          </p>
        </div>

        <div className="row g-4">
          {categories.map((c, i) => (
            <div className={`col-md-6 ${i === 0 ? 'col-lg-8' : i === 1 ? 'col-lg-4' : 'col-lg-4'}`} key={c.name}>
              <motion.div
                className="cat-card"
                style={{ height: i < 2 ? 300 : 220 }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(c.name)}`)}
                whileHover={{ y: -4 }}
                transition={{ duration: .2 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img src={c.image} alt={c.name} loading="lazy" />
                <div className="cat-card-overlay" />
                <div className="cat-card-body">
                  <div className="cat-card-icon"><i className={`bi ${c.icon}`} /></div>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
