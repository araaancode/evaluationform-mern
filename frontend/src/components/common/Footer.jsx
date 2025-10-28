import React, { useContext } from 'react';
import { BrandContext } from '../../contexts/BrandContext';
import './Footer.css';

const Footer = () => {
  const { currentBrand, brands } = useContext(BrandContext);
  const brand = brands.find(b => b.id === currentBrand);

  const getBrandSocialLinks = (brandName) => {
    const socials = {
      'آزمون لند': {
        instagram: 'https://instagram.com/azmoonland',
        telegram: 'https://t.me/azmoonland',
        website: 'https://azmoonland.ir'
      },
      'فرامهاجرت': {
        instagram: 'https://instagram.com/faramohajerat',
        telegram: 'https://t.me/faramohajerat',
        website: 'https://faramohajerat.ir'
      },
      'خودجوش': {
        instagram: 'https://instagram.com/khodjosh',
        telegram: 'https://t.me/khodjosh',
        website: 'https://khodjosh.ir'
      }
    };
    return socials[brandName] || socials['فرامهاجرت'];
  };

  const socialLinks = getBrandSocialLinks(brand.name);

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* اطلاعات تماس */}
        <div className="footer-section">
          <h4>اطلاعات تماس</h4>
          <div className="contact-info">
            <p>📞 تلفن: {brand?.phone || '021-12345678'}</p>
            <p>📧 ایمیل: {brand?.email || 'info@example.ir'}</p>
            <p>📍 آدرس: {brand?.address || 'تهران'}</p>
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
            <h3>{brand?.name || 'برند'}</h3>
            <p>{brand?.description || 'توضیحات برند'}</p>
            <div className="social-links">
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">📱</a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">✈️</a>
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" aria-label="Website">🌐</a>
            </div>
          </div>
        </div>
      </div>

      {/* کپی رایت */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {brand?.name || 'برند'} - تمام حقوق محفوظ است</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;