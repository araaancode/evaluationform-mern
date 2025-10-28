// src/components/common/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { BrandContext } from '../../contexts/BrandContext';
import './Header.css';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const { currentBrand, setCurrentBrand, brands } = useContext(BrandContext);
  const location = useLocation();

  const slides = [
    "Your future starts with informed decisions 🌍",
    "Professional immigration consulting 💼",
    "Three brands, one standard of excellence 🎯"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleBrandChange = (brandId) => {
    setCurrentBrand(brandId);
  };

  return (
    <header className="header">
      {/* اسلایدر */}
      <div className="slider-container">
        <div className="slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <p>{slide}</p>
            </div>
          ))}
        </div>
      </div>

      {/* نویگیشن اصلی */}
      <nav className="main-nav">
        <div className="nav-container">
          {/* انتخاب برند */}
          <div className="brand-selector">
            <select 
              value={currentBrand} 
              onChange={(e) => handleBrandChange(e.target.value)}
              className="brand-select"
            >
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* لینک‌های نویگیشن */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              خانه
            </Link>
            <Link to="/evaluation" className={`nav-link ${location.pathname === '/evaluation' ? 'active' : ''}`}>
              ارزیابی
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  پنل کاربری
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                    پنل مدیریت
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-secondary">
                  خروج
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                ورود / ثبت‌نام
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;