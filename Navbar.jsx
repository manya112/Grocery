import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { products } from '../data/products';

export default function Navbar() {
  const { cartCount, user, logout, dark, setDark } = useApp();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    const q = search.toLowerCase();
    const found = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 6);
    setResults(found);
    setShowDrop(true);
  }, [search]);

  useEffect(() => {
    const handler = (e) => { if (!searchRef.current?.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (product) => {
    setSearch('');
    setShowDrop(false);
    navigate(`/product/${product.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky-top z-1000">
      {/* Top Strip */}
      <div className="delivery-strip">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span className="eta-flash"><i className="bi bi-lightning-charge-fill" /> 10-MIN EXPRESS</span>
            <span>Superfast grocery delivery directly to your door</span>
          </div>
          <div className="d-none d-md-flex align-items-center gap-3">
            <span><i className="bi bi-shield-check text-warning me-1" /> Quality Guarantee</span>
            <span>Free delivery on orders over ₹499</span>
          </div>
        </div>
      </div>

      {/* Main Frosted Navbar */}
      <nav className="fk-navbar">
        <div className="container d-flex align-items-center justify-content-between gap-2">
          {/* Logo & Location */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <Link to="/" className="fk-brand text-decoration-none">
              <span className="brand-icon"><i className="bi bi-basket2-fill" /></span>
              <span>Harvest<span style={{ color: 'var(--emerald-green)' }}>ly</span></span>
            </Link>

            <div className="location-pill d-none d-xxl-flex" onClick={() => navigate('/products')}>
              <i className="bi bi-geo-alt-fill text-success fs-6" />
              <div className="lh-sm">
                <small className="d-block text-muted" style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em' }}>DELIVER TO</small>
                <strong style={{ fontSize: '.8rem' }}>Bandra West, Mumbai</strong>
              </div>
              <i className="bi bi-chevron-down ms-1 text-muted" style={{ fontSize: '.7rem' }} />
            </div>
          </div>

          {/* Search Bar - Responsive Flex Grow */}
          <div className="position-relative flex-grow-1 mx-1 mx-md-2" style={{ minWidth: 160, maxWidth: 360 }} ref={searchRef}>
            <div className="fk-search">
              <i className="bi bi-search search-icon" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 'milk', 'tomatoes'..."
                onKeyDown={(e) => { if (e.key === 'Enter') { setShowDrop(false); navigate(`/products?q=${encodeURIComponent(search)}`); } }}
              />
            </div>
            <AnimatePresence>
              {showDrop && results.length > 0 && (
                <motion.div
                  className="search-dropdown position-absolute w-100 bg-white rounded-4 shadow-lg border mt-2 overflow-hidden z-1000 p-2"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: .15 }}
                >
                  {results.map(p => (
                    <div
                      key={p.id}
                      className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light cursor-pointer"
                      onClick={() => handleResultClick(p)}
                    >
                      <img src={p.image} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark small">{p.name}</div>
                        <div className="text-muted small">₹{p.price} · {p.unit}</div>
                      </div>
                      <i className="bi bi-arrow-up-left text-muted fs-6" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
            {/* Desktop Navigation Links */}
            <div className="d-none d-lg-flex align-items-center me-1">
              <NavLink to="/" end className={({ isActive }) => `fk-navlink ${isActive ? 'active' : ''}`}>Home</NavLink>
              <NavLink to="/products" className={({ isActive }) => `fk-navlink ${isActive ? 'active' : ''}`}>Products</NavLink>
              <NavLink to="/about" className={({ isActive }) => `fk-navlink ${isActive ? 'active' : ''}`}>About</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `fk-navlink ${isActive ? 'active' : ''}`}>Contact</NavLink>
            </div>

            {/* Dark Mode */}
            <button className="dark-toggle" onClick={() => setDark(!dark)} title="Toggle dark mode" aria-label="Dark mode">
              <i className={`bi ${dark ? 'bi-sun-fill text-warning' : 'bi-moon-stars-fill'}`} />
            </button>

            {/* Cart Badge */}
            <Link to="/cart" className="cart-badge-btn" aria-label="Cart">
              <i className="bi bi-bag-fill" />
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>

            {/* Profile / Auth */}
            {user ? (
              <div className="dropdown">
                <button className="btn btn-outline-success rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-2 border-2" type="button" data-bs-toggle="dropdown" style={{ fontSize: '.85rem' }}>
                  <i className="bi bi-person-circle fs-6" />
                  <span className="d-none d-sm-inline">{user.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down small" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2" style={{ minWidth: '200px' }}>
                  <li className="px-3 py-2 border-bottom mb-1">
                    <div className="fw-bold text-dark">{user.name}</div>
                    <div className="small text-muted text-truncate">{user.email}</div>
                  </li>
                  <li><Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/profile"><i className="bi bi-person-badge text-success" /> My Profile</Link></li>
                  {user.role === 'admin' && <li><Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/admin"><i className="bi bi-shield-check text-warning" /> Admin Panel</Link></li>}
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><button className="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}><i className="bi bi-box-arrow-right" /> Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-1.5 ms-1">
                <Link to="/login" className="btn btn-outline-green rounded-pill px-3 py-1.5 fw-bold text-nowrap" style={{ fontSize: '.82rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-green rounded-pill px-3 py-1.5 fw-bold text-nowrap shadow-sm" style={{ fontSize: '.82rem' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button className="d-lg-none btn p-1.5 rounded-3 text-dark ms-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'} fs-3`} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="border-top bg-white py-3 px-4 d-lg-none"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: .2 }}
            >
              <div className="location-pill mb-3 w-100 justify-content-between p-2.5">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-geo-alt-fill text-success fs-5" />
                  <div>
                    <small className="d-block text-muted fw-bold" style={{ fontSize: '.68rem' }}>DELIVER TO</small>
                    <strong style={{ fontSize: '.88rem' }}>Bandra West, Mumbai</strong>
                  </div>
                </div>
                <i className="bi bi-chevron-right text-muted" />
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                {[
                  ['/', 'Home', 'bi-house-door-fill'],
                  ['/products', 'All Products', 'bi-grid-fill'],
                  ['/about', 'About Us', 'bi-info-circle-fill'],
                  ['/contact', 'Contact Us', 'bi-envelope-fill']
                ].map(([to, label, icon]) => (
                  <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `d-flex align-items-center gap-3 p-2.5 rounded-3 fw-semibold text-decoration-none ${isActive ? 'bg-success text-white' : 'text-dark hover-bg-light'}`} onClick={() => setMenuOpen(false)}>
                    <i className={`bi ${icon} fs-5`} /> {label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
