import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BrandContext } from '../contexts/BrandContext';
import './Home.css';

const Home = () => {
  const { currentBrandData } = useContext(BrandContext);

  const getBrandDescription = (brandName) => {
    const descriptions = {
      'آزمون لند': 'ما در آزمون لند باور داریم که هر فرد شایسته بهترین فرصت‌های شغلی و تحصیلی است. این فرم با هدف شناسایی استعدادها و توانایی‌های شما طراحی شده تا مسیر موفقیت را برایتان هموار کنیم.',
      'فرامهاجرت': 'ما در فرامهاجرت باور داریم مسیر مهاجرت، تصمیمی حیاتی‌ست که باید بر پایه‌ی شناخت دقیق، تحلیل شخصی و طراحی هوشمندانه بنا شود. این فرم با هدف جمع‌آوری اطلاعات کلیدی شما طراحی شده.',
      'خودجوش': 'ما در خودجوش معتقدیم هر فرد توانایی رشد و تحول بی‌نهایت دارد. این ارزیابی به شما کمک می‌کند مسیر توسعه فردی و مهارت‌آموزی خود را به درستی شناسایی کنید.'
    };
    return descriptions[brandName] || descriptions['فرامهاجرت'];
  };

  const getBrandFeatures = (brandName) => {
    const features = {
      'آزمون لند': [
        { icon: '📊', title: 'ارزیابی دقیق', desc: 'بررسی تخصصی توانایی‌ها و استعدادها' },
        { icon: '🎯', title: 'مسیر شغلی', desc: 'هدایت به سوی مناسب‌ترین فرصت‌های شغلی' },
        { icon: '🚀', title: 'پیشرفت سریع', desc: 'شناسایی نقاط قوت و زمینه‌های بهبود' }
      ],
      'فرامهاجرت': [
        { icon: '🌍', title: 'تحلیل تخصصی', desc: 'بررسی دقیق شرایط شما توسط متخصصان مهاجرت' },
        { icon: '🗺️', title: 'مسیر شفاف', desc: 'تدوین استراتژی شخصی‌سازی شده برای موفقیت' },
        { icon: '📞', title: 'پشتیبانی کامل', desc: 'همراهی تا رسیدن به هدف نهایی' }
      ],
      'خودجوش': [
        { icon: '💡', title: 'خودشناسی', desc: 'شناسایی توانایی‌ها و علایق شخصی' },
        { icon: '📈', title: 'توسعه مهارت', desc: 'ارائه مسیر یادگیری شخصی‌سازی شده' },
        { icon: '🌟', title: 'رشد فردی', desc: 'همراهی در مسیر تحول و پیشرفت شخصی' }
      ]
    };
    return features[brandName] || features['فرامهاجرت'];
  };

  return (
    <div className="home-page">
      {/* هیرو سکشن */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              به {currentBrandData.name} خوش آمدید {
                currentBrandData.name === 'آزمون لند' ? '🎯' :
                currentBrandData.name === 'فرامهاجرت' ? '🌍' : '🌟'
              }
            </h1>
            <p className="hero-description">
              {getBrandDescription(currentBrandData.name)}
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
            {getBrandFeatures(currentBrandData.name).map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>
              {currentBrandData.name === 'آزمون لند' ? 'آماده کشف استعدادهایتان هستید؟ ✨' :
               currentBrandData.name === 'فرامهاجرت' ? 'آماده‌اید قدم اول را حرفه‌ای بردارید؟ 🚀' :
               'آماده شروع مسیر رشد شخصی‌تان هستید؟ 🌱'}
            </h2>
            <p>
              {currentBrandData.name === 'آزمون لند' ? 'اولین گام شما به سوی شناخت توانایی‌ها و یافتن مسیر شغلی ایده‌آل' :
               currentBrandData.name === 'فرامهاجرت' ? 'اولین گام شما به سوی یک تصمیم آگاهانه، مسیر روشن و آینده‌ای بدون ریسک' :
               'اولین گام شما به سوی خودشناسی، مهارت‌آموزی و تحول شخصی'}
            </p>
            <Link to="/evaluation" className="btn btn-primary btn-large">
              {currentBrandData.name === 'آزمون لند' ? '🎯 شروع ارزیابی' :
               currentBrandData.name === 'فرامهاجرت' ? '🌍 شروع ارزیابی' :
               '🌟 شروع ارزیابی'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;