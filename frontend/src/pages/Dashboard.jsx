// src/pages/Dashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { EvaluationContext } from '../contexts/EvaluationContext';
import { AuthContext } from '../contexts/AuthContext';
import EvaluationCard from '../components/dashboard/EvaluationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { evaluations, getUserEvaluations, loading } = useContext(EvaluationContext);
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    getUserEvaluations();
  }, []);

  const filteredEvaluations = evaluations.filter(eval => {
    if (activeTab === 'all') return true;
    return eval.status === activeTab;
  });

  const stats = {
    total: evaluations.length,
    completed: evaluations.filter(e => e.status === 'completed').length,
    pending: evaluations.filter(e => e.status === 'pending').length,
    under_review: evaluations.filter(e => e.status === 'under_review').length,
  };

  if (loading) {
    return <LoadingSpinner text="در حال بارگذاری اطلاعات..." />;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* هدر پنل کاربری */}
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>👋 سلام، {user?.firstName} {user?.lastName}</h1>
            <p>به پنل کاربری فرامهاجرت خوش آمدید</p>
          </div>
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">کل ارزیابی‌ها</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-label">تکمیل شده</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">در انتظار</div>
            </div>
          </div>
        </div>

        {/* تب‌های فیلتر */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            همه ارزیابی‌ها ({stats.total})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            تکمیل شده ({stats.completed})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            در انتظار ({stats.pending})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'under_review' ? 'active' : ''}`}
            onClick={() => setActiveTab('under_review')}
          >
            در حال بررسی ({stats.under_review})
          </button>
        </div>

        {/* لیست ارزیابی‌ها */}
        <div className="evaluations-list">
          {filteredEvaluations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>هنوز ارزیابی‌ای ثبت نکرده‌اید</h3>
              <p>برای شروع فرآیند مهاجرت، اولین ارزیابی خود را انجام دهید</p>
              <a href="/evaluation" className="btn btn-primary">
                شروع ارزیابی جدید
              </a>
            </div>
          ) : (
            <>
              {filteredEvaluations.map(evaluation => (
                <EvaluationCard 
                  key={evaluation._id} 
                  evaluation={evaluation} 
                />
              ))}
            </>
          )}
        </div>

        {/* CTA برای ارزیابی جدید */}
        {evaluations.length > 0 && (
          <div className="dashboard-cta">
            <div className="cta-card">
              <h3>ارزیابی جدید نیاز دارید؟</h3>
              <p>برای شرایط جدید یا بررسی مجدد، ارزیابی جدید انجام دهید</p>
              <a href="/evaluation" className="btn btn-primary">
                🚀 شروع ارزیابی جدید
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;