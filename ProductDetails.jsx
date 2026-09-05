import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { toast } from 'react-toastify';

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateCart, cart, toggleWishlist, isWishlisted, user } = useApp();
  
  const product = products.find(p => p.id === Number(id)) || products[0];
  const cartItem = cart.find(x => x.id === product.id);
  const qty = cartItem?.qty || 0;
  const wishlisted = isWishlisted(product.id);
  
  const [activeTab, setActiveTab] = useState('description');
  const [mainImg, setMainImg] = useState(product.image);

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const boughtTogether = products.filter(p => p.id !== product.id).slice(2, 4);

  const discount = product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const requireAuth = () => {
    if (!user) {
      toast.warning('🔒 Please sign in or register to add items to your cart!', { autoClose: 2500 });
      navigate('/login');
      return false;
    }
    return true;
  };

  return (
    <main style={{ background: 'var(--bg-secondary)', minHeight: '80vh', padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0" style={{ fontSize: '.85rem' }}>
            <li className="breadcrumb-item"><Link to="/" style={{ color: '#16a34a', textDecoration: 'none' }}>Home</Link></li>
            <li className="breadcrumb-item"><Link to="/products" style={{ color: '#16a34a', textDecoration: 'none' }}>Products</Link></li>
            <li className="breadcrumb-item"><Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#16a34a', textDecoration: 'none' }}>{product.category}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Product Hero Details */}
        <div className="bg-white rounded-4 shadow-sm border p-4 p-md-5 mb-5">
          <div className="row g-5">
            {/* Gallery / Zoom */}
            <div className="col-lg-6">
              <div className="position-relative overflow-hidden rounded-4 mb-3 bg-light" style={{ height: 380, border: '1px solid #e2e8f0' }}>
                <motion.img
                  key={mainImg}
                  src={mainImg}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  initial={{ opacity: .8, scale: .98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: .25 }}
                />
                {discount > 0 && (
                  <span className="badge bg-danger rounded-pill px-3 py-1.5 fw-bold shadow-sm position-absolute top-0 start-0 m-3" style={{ fontSize: '.8rem' }}>
                    {discount}% OFF
                  </span>
                )}
                <button
                  className="position-absolute border-0 shadow-sm d-flex align-items-center justify-content-center transition-all"
                  style={{
                    top: 12,
                    right: 12,
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                    zIndex: 5
                  }}
                  onClick={() => {
                    if (!requireAuth()) return;
                    toggleWishlist(product);
                    toast(wishlisted ? '💔 Removed from wishlist' : '❤️ Saved to wishlist');
                  }}
                >
                  <i className={`bi ${wishlisted ? 'bi-heart-fill text-danger' : 'bi-heart text-secondary'}`} style={{ fontSize: '1.2rem' }} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="d-flex gap-2">
                {[product.image, 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=85', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=700&q=85'].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImg(img)}
                    style={{
                      width: 70, height: 70, borderRadius: 12, overflow: 'hidden',
                      border: mainImg === img ? '2.5px solid #16a34a' : '1px solid #e2e8f0',
                      opacity: mainImg === img ? 1 : .7, transition: 'all .2s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Meta */}
            <div className="col-lg-6 d-flex flex-column justify-content-between">
              <div>
                <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill mb-2">
                  <i className="bi bi-patch-check-fill me-1" /> {product.brand}
                </span>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '.5rem' }} className="text-dark">{product.name}</h1>
                
                <div className="d-flex align-items-center gap-3 mb-3" style={{ fontSize: '.9rem' }}>
                  <div className="d-flex align-items-center gap-1 text-warning">
                    <i className="bi bi-star-fill" />
                    <strong className="text-dark">{product.rating}</strong>
                    <span className="text-muted">({product.reviews} reviews)</span>
                  </div>
                  <span className="text-muted">|</span>
                  <span className="text-success fw-semibold"><i className="bi bi-lightning-charge-fill" /> Express 10 Mins Delivery</span>
                </div>

                {/* Clean Price Line */}
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fw-extrabold text-dark" style={{ fontSize: '2.2rem' }}>{money(product.price)}</span>
                  {product.oldPrice > product.price && (
                    <del className="text-muted fs-5 fw-normal">{money(product.oldPrice)}</del>
                  )}
                  {product.oldPrice > product.price && (
                    <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1.5 fw-bold" style={{ fontSize: '.85rem' }}>
                      Save {money(product.oldPrice - product.price)}
                    </span>
                  )}
                </div>

                <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>{product.description}</p>

                {/* Specs Cards - Clean Rounded Pill Containers */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4">
                      <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '.68rem', letterSpacing: '.04em' }}>UNIT WEIGHT</small>
                      <strong className="text-dark fs-6">{product.unit}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-4">
                      <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '.68rem', letterSpacing: '.04em' }}>TYPE</small>
                      <strong className="text-dark fs-6 d-flex align-items-center gap-1.5">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: product.veg ? '#16a34a' : '#dc2626', display: 'inline-block' }} />
                        {product.veg ? 'Vegetarian' : 'Non-Vegetarian'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="pt-3 border-top d-flex gap-3 align-items-center">
                {qty > 0 ? (
                  <div className="d-inline-flex align-items-center bg-success text-white rounded-pill overflow-hidden shadow-sm" style={{ height: 46 }}>
                    <button
                      className="btn btn-success border-0 px-3.5 py-0 h-100 text-white fw-bold d-grid place-items-center"
                      onClick={() => { if (requireAuth()) updateCart(product.id, -1); }}
                      style={{ background: 'transparent' }}
                    >
                      <i className="bi bi-dash-lg" />
                    </button>
                    <span className="fw-extrabold text-white px-3 d-grid place-items-center" style={{ fontSize: '1rem', minWidth: 32, background: 'transparent' }}>
                      {qty}
                    </span>
                    <button
                      className="btn btn-success border-0 px-3.5 py-0 h-100 text-white fw-bold d-grid place-items-center"
                      onClick={() => { if (requireAuth()) updateCart(product.id, 1); }}
                      style={{ background: 'transparent' }}
                    >
                      <i className="bi bi-plus-lg" />
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-success flex-grow-1 rounded-pill py-3 fw-bold shadow-sm" style={{ fontSize: '1rem' }} onClick={() => { if (!requireAuth()) return; addToCart(product); toast.success(`${product.name} added to cart!`); }}>
                    <i className="bi bi-bag-plus me-2" /> Add to Basket
                  </button>
                )}
                <button className="btn btn-outline-success rounded-pill px-4 py-3 fw-bold" onClick={() => { if (!requireAuth()) return; if (qty === 0) addToCart(product); navigate('/cart'); }}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Details */}
        <div className="bg-white rounded-4 shadow-sm border p-4 mb-5">
          <div className="d-flex gap-4 border-bottom mb-4" style={{ overflowX: 'auto' }}>
            {[
              ['description', 'Description & Storage'],
              ['nutrition', 'Nutrition Facts'],
              ['shipping', 'Delivery & Returns'],
            ].map(([tKey, label]) => (
              <button
                key={tKey}
                onClick={() => setActiveTab(tKey)}
                style={{
                  paddingBottom: '.75rem', fontWeight: 700, fontSize: '.95rem',
                  borderBottom: activeTab === tKey ? '3px solid #16a34a' : '3px solid transparent',
                  color: activeTab === tKey ? '#16a34a' : '#64748b',
                  background: 'none', transition: 'all .2s'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div>
              <h4 className="fw-bold text-dark mb-2">Product Description</h4>
              <p className="text-muted">{product.description} Sourced directly from certified organic farms, stored in temperature-controlled dark stores, and packed right before dispatch.</p>
              <h5 className="fw-bold text-dark mt-4 mb-2">Storage Instructions</h5>
              <p className="text-muted">Keep in a cool, dry place. For optimal fresh taste, consume within 3-4 days of delivery.</p>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h4 className="fw-bold text-dark mb-3">Nutritional Values (per 100g)</h4>
              <div className="row g-3" style={{ maxWidth: 500 }}>
                {[['Energy', '42 kcal'], ['Protein', '1.2 g'], ['Carbohydrates', '7.4 g'], ['Fats', '0.3 g'], ['Dietary Fiber', '1.8 g']].map(([k, v]) => (
                  <div className="col-6" key={k}>
                    <div className="p-3 rounded-3 bg-light border d-flex justify-content-between">
                      <span className="text-muted">{k}</span>
                      <strong className="text-dark">{v}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div>
              <h4 className="fw-bold text-dark mb-2">10-Minute Express Guarantee</h4>
              <p className="text-muted">Your order is packed at the nearest FreshKart Dark Store within 2 minutes of checkout and delivered directly to your doorstep in insulated thermal bags.</p>
              <h5 className="fw-bold text-dark mt-4 mb-2">Return &amp; Replacement Policy</h5>
              <p className="text-muted">If you receive damaged or unsatisfactory items, take a photo in the app for an instant refund or replacement credit — no questions asked.</p>
            </div>
          )}
        </div>

        {/* Frequently Bought Together */}
        <div className="mb-5">
          <h3 className="fw-bold text-dark mb-3"><i className="bi bi-layers-fill text-success me-2" />Frequently Bought Together</h3>
          <div className="bg-white rounded-4 shadow-sm border p-4">
            <div className="row align-items-center g-3">
              <div className="col-md-8 d-flex align-items-center gap-3 flex-wrap">
                <div className="d-flex align-items-center gap-2 border p-2 rounded-3 bg-light">
                  <img src={product.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                  <div><strong className="d-block text-dark" style={{ fontSize: '.85rem' }}>{product.name}</strong><span className="text-success fw-bold">{money(product.price)}</span></div>
                </div>
                <span className="fs-4 text-muted fw-bold">+</span>
                {boughtTogether.map(bt => (
                  <div key={bt.id} className="d-flex align-items-center gap-2 border p-2 rounded-3 bg-light">
                    <img src={bt.image} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }} />
                    <div><strong className="d-block text-dark" style={{ fontSize: '.85rem' }}>{bt.name}</strong><span className="text-success fw-bold">{money(bt.price)}</span></div>
                  </div>
                ))}
              </div>
              <div className="col-md-4 text-md-end border-start-md ps-md-4">
                <div className="text-muted small">Total Bundle Price</div>
                <div className="fs-4 fw-extrabold text-success mb-2">{money(product.price + boughtTogether.reduce((s, x) => s + x.price, 0))}</div>
                <button className="btn btn-success rounded-pill w-100 py-2.5 fw-bold" onClick={() => { if (!requireAuth()) return; addToCart(product); boughtTogether.forEach(addToCart); toast.success('Bundle added to cart!'); }}>
                  Add Bundle to Basket
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold text-dark m-0">Similar Essentials</h3>
            <button className="see-all" onClick={() => navigate('/products')}>View all <i className="bi bi-arrow-right" /></button>
          </div>
          <div className="row g-3">
            {related.map(r => (
              <div className="col-6 col-md-3" key={r.id}>
                <ProductCard product={r} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
