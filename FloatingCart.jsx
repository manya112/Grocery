import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function FloatingCart() {
  const { cartCount, cartTotal } = useApp();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 z-1000 w-90 max-w-lg px-3"
          style={{ width: '90%', maxWidth: '520px' }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <div
            className="bg-success text-white rounded-pill px-4 py-3 shadow-lg d-flex align-items-center justify-content-between border border-white-50 cursor-pointer"
            onClick={() => navigate('/cart')}
            style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)', boxShadow: '0 12px 36px rgba(22,163,74,.4)' }}
          >
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.2rem' }}>
                <i className="bi bi-bag-check-fill text-white" />
              </div>
              <div>
                <div className="fw-bold fs-6 lh-sm">{cartCount} {cartCount === 1 ? 'Item' : 'Items'} · {money(cartTotal)}</div>
                <small className="text-white-50" style={{ fontSize: '.75rem' }}>Extra discounts applied at checkout</small>
              </div>
            </div>

            <button className="btn bg-white text-success rounded-pill px-3.5 py-2 fw-bold text-nowrap shadow-sm d-flex align-items-center gap-1" style={{ fontSize: '.875rem' }}>
              <span>View Cart</span>
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
