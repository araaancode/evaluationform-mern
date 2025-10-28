import React from 'react';
import './Analytics.css';

const Analytics = ({ evaluations }) => {
  // محاسبات آماری
  const stats = {
    total: evaluations.length,
    byStatus: {
      pending: evaluations.filter(evaluation => evaluation.status === 'pending').length,
      under_review: evaluations.filter(evaluation => evaluation.status === 'under_review').length,
      completed: evaluations.filter(evaluation => evaluation.status === 'completed').length
    },
    byBrand: evaluations.reduce((acc, evaluation) => {
      acc[evaluation.brand] = (acc[evaluation.brand] || 0) + 1;
      return acc;
    }, {}),
    byDegree: evaluations.reduce((acc, evaluation) => {
      const degree = evaluation.education?.degree || 'نامشخص';
      acc[degree] = (acc[degree] || 0) + 1;
      return acc;
    }, {}),
    byPurpose: evaluations.reduce((acc, evaluation) => {
      const purpose = evaluation.immigration?.purpose || 'نامشخص';
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {})
  };

  return (
    <div className="analytics">
      <h2>📊 آمار و گزارشات سیستم</h2>
      
      <div className="analytics-grid">
        {/* کارت‌های آماری */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">کل ارزیابی‌ها</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.pending}</div>
            <div className="stat-label">در انتظار بررسی</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.under_review}</div>
            <div className="stat-label">در حال بررسی</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byStatus.completed}</div>
            <div className="stat-label">تکمیل شده</div>
          </div>
        </div>

        {/* نمودار توزیع بر اساس برند */}
        <div className="chart-card">
          <h3>توزیع بر اساس برند</h3>
          <div className="chart">
            {Object.entries(stats.byBrand).map(([brand, count]) => (
              <div key={brand} className="chart-item">
                <div className="chart-label">{brand}</div>
                <div className="chart-bar">
                  <div 
                    className="chart-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: getBrandColor(brand)
                    }}
                  ></div>
                </div>
                <div className="chart-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* نمودار توزیع بر اساس مدرک تحصیلی */}
        <div className="chart-card">
          <h3>توزیع بر اساس مدرک تحصیلی</h3>
          <div className="chart">
            {Object.entries(stats.byDegree).map(([degree, count]) => (
              <div key={degree} className="chart-item">
                <div className="chart-label">{degree}</div>
                <div className="chart-bar">
                  <div 
                    className="chart-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: getDegreeColor(degree)
                    }}
                  ></div>
                </div>
                <div className="chart-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* نمودار توزیع بر اساس هدف مهاجرت */}
        <div className="chart-card">
          <h3>توزیع بر اساس هدف مهاجرت</h3>
          <div className="chart">
            {Object.entries(stats.byPurpose).map(([purpose, count]) => (
              <div key={purpose} className="chart-item">
                <div className="chart-label">{purpose}</div>
                <div className="chart-bar">
                  <div 
                    className="chart-fill"
                    style={{ 
                      width: `${(count / stats.total) * 100}%`,
                      backgroundColor: getPurposeColor(purpose)
                    }}
                  ></div>
                </div>
                <div className="chart-value">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* خلاصه آماری */}
        <div className="summary-card">
          <h3>📈 خلاصه آماری</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span>میانگین امتیاز:</span>
              <strong>
                {evaluations.filter(evaluation => evaluation.score).length > 0 
                  ? (evaluations.reduce((sum, evaluation) => sum + (evaluation.score || 0), 0) / 
                     evaluations.filter(evaluation => evaluation.score).length).toFixed(1)
                  : '--'
                }/100
              </strong>
            </div>
            <div className="summary-item">
              <span>نرخ تکمیل:</span>
              <strong>{((stats.byStatus.completed / stats.total) * 100).toFixed(1)}%</strong>
            </div>
            <div className="summary-item">
              <span>ارزیابی امروز:</span>
              <strong>
                {evaluations.filter(evaluation => {
                  const today = new Date();
                  const evalDate = new Date(evaluation.createdAt);
                  return today.toDateString() === evalDate.toDateString();
                }).length}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// توابع کمکی برای رنگ‌ها
const getBrandColor = (brand) => {
  const colors = {
    'brand1': '#8B0000',
    'brand2': '#2E8B57', 
    'brand3': '#1E90FF',
    'default': '#616161'
  };
  return colors[brand] || colors.default;
};

const getDegreeColor = (degree) => {
  const colors = {
    'دیپلم': '#FF6B6B',
    'فوق‌دیپلم': '#4ECDC4',
    'کارشناسی': '#45B7D1',
    'کارشناسی ارشد': '#96CEB4',
    'دکتری': '#FFEAA7',
    'نامشخص': '#DDA0DD'
  };
  return colors[degree] || '#616161';
};

const getPurposeColor = (purpose) => {
  const colors = {
    'تحصیلی': '#4ECDC4',
    'کاری': '#45B7D1', 
    'سرمایه‌گذاری': '#FFEAA7',
    'پناهندگی': '#FF6B6B',
    'همراهی خانواده': '#96CEB4',
    'نامشخص': '#DDA0DD'
  };
  return colors[purpose] || '#616161';
};

export default Analytics;