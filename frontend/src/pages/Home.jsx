// src/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BrandContext } from '../contexts/BrandContext';
import './Home.css';

const Home = () => {
  const { currentBrandData } = useContext(BrandContext);

  return (
    <div className="home-page">
      {/* هیرو سکشن */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              به {currentBrandData.name} خوش آمدید 🌍
            </h1>
            <p className="hero-description">
              ما در {currentBrandData.name} باور داریم مسیر مهاجرت، تصمیمی حیاتی‌ست که باید بر پایه‌ی شناخت دقیق، 
              تحلیل شخصی و طراحی هوشمندانه بنا شود.
            </p>
            <div className="hero-actions">
              <Link to="/evaluation" className="btn btn-primary btn-large">
                شروع ارزیابی رایگان
              </Link>
              <Link to="/login" className="btn btn-secondary">
                ورود به پنل کاربری
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ویژگی‌ها */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">چرا {currentBrandData.name}؟</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>تحلیل تخصصی</h3>
              <p>بررسی دقیق شرایط شما توسط متخصصان مهاجرت</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>مسیر شفاف</h3>
              <p>تدوین استراتژی شخصی‌سازی شده برای موفقیت</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>پشتیبانی کامل</h3>
              <p>همراهی تا رسیدن به هدف نهایی</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>آماده‌اید قدم اول را حرفه‌ای بردارید؟</h2>
            <p>اولین گام شما به سوی یک تصمیم آگاهانه، مسیر روشن و آینده‌ای بدون ریسک</p>
            <Link to="/evaluation" className="btn btn-primary btn-large">
              🚀 شروع ارزیابی
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;