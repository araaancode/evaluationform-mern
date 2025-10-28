// src/components/common/Footer.jsx
import React, { useContext } from 'react';
import { BrandContext } from '../../contexts/BrandContext';
import './Footer.css';

const Footer = () => {
  const { currentBrand, brands } = useContext(BrandContext);
  const brand = brands.find(b => b.id === currentBrand);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* اطلاعات تماس */}
        <div className="footer-section">
          <h4>اطلاعات تماس</h4>
          <div className="contact-info">
            <p>📞 تلفن: {brand?.phone || '021-12345678'}</p>
            <p>📧 ایمیل: {brand?.email || 'info@faramohajerat.ir'}</p>
            <p>📍 آدرس: {brand?.address || 'تهران، خیابان ولیعصر'}</p>
          </div>
        </div>

        {/* لینک‌های سریع */}
        <div className="footer-section">
          <h4>لینک‌های سریع</h4>
          <ul className="footer-links">
            <li><a href="/about">درباره ما</a></li>
            <li><a href="/services">خدمات</a></li>
            <li><a href="/contact">تماس با ما</a></li>
            <li><a href="/privacy">حریم خصوصی</a></li>
          </ul>
        </div>

        {/* گوگل مپ */}
        <div className="footer-section">
          <h4>موقعیت ما</h4>
          <div className="map-placeholder">
            <div className="map-content">
              <p>📍 نقشه موقعیت</p>
              <small>اینجا نقشه گوگل نمایش داده می‌شود</small>
            </div>
          </div>
        </div>

        {/* اطلاعات برند */}
        <div className="footer-section">
          <div className="brand-info">
            <h3>{brand?.name || 'فرامهاجرت'}</h3>
            <p>{brand?.description || 'مشاوره تخصصی مهاجرت'}</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">📱</a>
              <a href="#" aria-label="Telegram">✈️</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
        </div>
      </div>

      {/* کپی رایت */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {brand?.name || 'فرامهاجرت'} - تمام حقوق محفوظ است</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;