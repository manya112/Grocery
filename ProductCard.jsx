import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { toast } from 'react-toastify';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function ProductCard({ product, onOpen }) {
  const { addToCart, updateCart, cart, toggleWishlist, isWishlisted, user } = useApp();
  const navigate = useNavigate();
  const cartItem = cart.find(x => x.id === product.id);
  const qty = cartItem?.qty || 0;
  const wishlisted = isWishlisted(product.id);
  const discount = product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const requireAuth = () => {
    if (!user) {
      toast.warning('🔒 Please sign in or register to add items to your basket!', { autoClose: 2500 });
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;
    addToCart(product);
    toast.success(`${product.name} added to basket!`, { autoClose: 1800 });
  };

  const handleUpdate = (e, by) => {
    e.stopPropagation();
    if (!requireAuth()) return;
    updateCart(product.id, by);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!requireAuth()) return;
    toggleWishlist(product);
    toast(wishlisted ? '💔 Removed from wishlist' : '❤️ Saved to wishlist', { autoClose: 1500 });
  };

  return (
    <motion.div
      className="card h-100 border-0 rounded-4 shadow-sm overflow-hidden bg-white"
      whileHover={{ y: -4 }}
      transition={{ duration: .2 }}
      style={{ border: '1px solid #e2e8f0' }}
    >
      {/* Product Image Container */}
      <div
        className="position-relative overflow-hidden bg-light cursor-pointer"
        style={{ height: 190 }}
        onClick={() => onOpen?.(product) || navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-100 h-100 object-fit-cover transition-all"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85';
          }}
        />

        {/* Top Badges */}
        <div className="position-absolute top-0 start-0 p-2.5 d-flex gap-1 flex-wrap">
          {product.tag && (
            <span className="badge bg-success rounded-pill px-2.5 py-1 text-white fw-bold shadow-sm" style={{ fontSize: '.68rem' }}>
              {product.tag}
            </span>
          )}
          {discount > 0 && (
            <span className="badge bg-danger rounded-pill px-2.5 py-1 text-white fw-bold shadow-sm" style={{ fontSize: '.68rem' }}>
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Perfectly centered Wishlist Heart Circle */}
        <button
          className="position-absolute border-0 shadow-sm transition-all"
          style={{
            top: 10,
            right: 10,
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5
          }}
          onClick={handleWishlist}
          aria-label="Wishlist"
        >
          <i
            className={`bi ${wishlisted ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
            style={{ fontSize: '1rem', color: wishlisted ? '#dc2626' : '#64748b' }}
          />
        </button>

        {/* Delivery ETA Badge */}
        <div
          className="position-absolute bottom-0 start-0 m-2.5 text-white rounded-pill px-2.5 py-1 fw-bold shadow-sm d-flex align-items-center gap-1"
          style={{ fontSize: '.65rem', backgroundColor: 'rgba(15,23,42,.85)', backdropFilter: 'blur(4px)' }}
        >
          <i className="bi bi-lightning-charge-fill text-warning" /> {product.eta || '10 mins'}
        </div>
      </div>

      {/* Product Body */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <small className="text-muted fw-bold text-uppercase d-block mb-1" style={{ fontSize: '.68rem', letterSpacing: '.04em' }}>
          {product.brand}
        </small>
        <h3
          className="h6 fw-bold text-dark mb-1 text-truncate cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
          title={product.name}
        >
          {product.name}
        </h3>
        <small className="text-muted d-block mb-2">{product.unit}</small>

        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-3" style={{ fontSize: '.78rem' }}>
          <i className="bi bi-star-fill text-warning" />
          <strong className="text-dark fw-bold">{product.rating}</strong>
          <span className="text-muted">({product.reviews})</span>
        </div>

        {/* Footer Price & Add/Stepper Button */}
        <div className="mt-auto d-flex align-items-center justify-content-between pt-2 border-top">
          <div>
            <span className="fw-bold text-dark fs-6">{money(product.price)}</span>
            {product.oldPrice > product.price && (
              <del className="text-muted small ms-1" style={{ fontSize: '.78rem' }}>{money(product.oldPrice)}</del>
            )}
          </div>

          <AnimatePresence mode="wait">
            {qty > 0 ? (
              <motion.div
                key="stepper"
                className="d-inline-flex align-items-center justify-content-between rounded-pill shadow-sm"
                style={{
                  background: '#16a34a',
                  height: 34,
                  minWidth: 84,
                  padding: '0 4px',
                  color: '#ffffff'
                }}
                initial={{ scale: .85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: .85, opacity: 0 }}
                transition={{ duration: .15 }}
              >
                <button
                  className="btn border-0 p-0 text-white d-flex align-items-center justify-content-center"
                  onClick={(e) => handleUpdate(e, -1)}
                  style={{ width: 26, height: 26, background: 'transparent', fontSize: '.85rem' }}
                  aria-label="Decrease quantity"
                >
                  <i className="bi bi-dash-lg" />
                </button>

                <span
                  className="fw-extrabold text-white text-center"
                  style={{ fontSize: '.85rem', minWidth: 20, lineHeight: 1 }}
                >
                  {qty}
                </span>

                <button
                  className="btn border-0 p-0 text-white d-flex align-items-center justify-content-center"
                  onClick={(e) => handleUpdate(e, 1)}
                  style={{ width: 26, height: 26, background: 'transparent', fontSize: '.85rem' }}
                  aria-label="Increase quantity"
                >
                  <i className="bi bi-plus-lg" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                className="btn btn-outline-success btn-sm rounded-pill px-3 py-1.5 fw-bold d-inline-flex align-items-center gap-1"
                onClick={handleAdd}
                initial={{ scale: .85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: .85, opacity: 0 }}
                transition={{ duration: .15 }}
                whileTap={{ scale: .95 }}
                style={{ fontSize: '.8rem', borderWidth: '1.5px' }}
              >
                <span>ADD</span>
                <i className="bi bi-plus-lg" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
