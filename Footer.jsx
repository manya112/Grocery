import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="fk-footer">
      <div className="container">
        <div className="row gy-4">
          {/* Brand Column */}
          <div className="col-lg-4">
            <div className="footer-brand">
              <span style={{ background: '#16a34a', borderRadius: 12, width: 38, height: 38, display: 'grid', placeItems: 'center', color: '#fff', fontSize: '1.1rem' }}>
                <i className="bi bi-basket2-fill" />
              </span>
              Harvest<em style={{ color: '#16a34a', fontStyle: 'normal' }}>ly</em>
            </div>
            <p className="footer-tagline">10-minute fresh organic grocery delivery for everyday living. Farm-fresh, delivered fast.</p>
            <div className="d-flex gap-3">
              {['bi-instagram', 'bi-twitter-x', 'bi-facebook', 'bi-youtube'].map(icon => (
                <a key={icon} href="#" style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.08)', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.7)', transition: 'all .2s', fontSize: '1rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
                >
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <p className="footer-h">Shop</p>
            <Link className="footer-link" to="/products">All Products</Link>
            <Link className="footer-link" to="/categories">Categories</Link>
            <Link className="footer-link" to="/products?category=Fruits%20%26%20Vegetables">Fresh Vegetables</Link>
            <Link className="footer-link" to="/cart">Your Basket</Link>
          </div>

          {/* Company */}
          <div className="col-6 col-lg-2">
            <p className="footer-h">Company</p>
            <Link className="footer-link" to="/about">About Us</Link>
            <Link className="footer-link" to="/contact">Support Contact</Link>
            <a className="footer-link" href="#">Careers</a>
            <a className="footer-link" href="#">Press</a>
          </div>

          {/* Contact */}
          <div className="col-lg-4">
            <p className="footer-h">Get in Touch</p>
            <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '.875rem', color: 'rgba(255,255,255,.7)' }}>
              <i className="bi bi-telephone text-success" /> 1800 123 456
            </div>
            <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '.875rem', color: 'rgba(255,255,255,.7)' }}>
              <i className="bi bi-envelope text-success" /> hello@harvestly.in
            </div>
            <div className="d-flex align-items-center gap-2" style={{ fontSize: '.875rem', color: 'rgba(255,255,255,.7)' }}>
              <i className="bi bi-clock text-success" /> Every day, 7:00 AM – 11:00 PM
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Harvestly Online Grocery System. All rights reserved.</span>
          <div className="d-flex gap-3">
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
