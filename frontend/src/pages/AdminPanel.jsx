// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { evaluationService } from '../services/evaluationService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EvaluationsList from '../components/admin/EvaluationsList';
import Analytics from '../components/admin/Analytics';
import UserManagement from '../components/admin/UserManagement';
import SMSManager from '../components/admin/SMSManager';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('evaluations');
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    users: 0
  });

  useEffect(() => {
    loadAllEvaluations();
  }, []);

  const loadAllEvaluations = async () => {
    try {
      setLoading(true);
      // در واقعیت این API باید ساخته شود
      const response = await fetch('http://localhost:5000/api/admin/evaluations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setAllEvaluations(data.data);
        setStats({
          total: data.data.length,
          pending: data.data.filter(e => e.status === 'pending').length,
          completed: data.data.filter(e => e.status === 'completed').length,
          users: new Set(data.data.map(e => e.userId)).size
        });
      }
    } catch (error) {
      console.error('Error loading evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'evaluations', label: 'مدیریت ارزیابی‌ها', icon: '📋' },
    { id: 'analytics', label: 'آمار و گزارشات', icon: '📊' },
    { id: 'users', label: 'مدیریت کاربران', icon: '👥' },
    { id: 'sms', label: 'مدیریت پیامک', icon: '💬' }
  ];

  if (loading) {
    return <LoadingSpinner text="در حال بارگذاری پنل مدیریت..." />;
  }

  return (
    <div className="admin-panel">
      <div className="container">
        {/* هدر پنل ادمین */}
        <div className="admin-header">
          <div className="admin-title">
            <h1>🛠️ پنل مدیریت فرامهاجرت</h1>
            <p>مدیریت کامل سیستم ارزیابی مهاجرت</p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">کل ارزیابی‌ها</div>
              </div>
            </div>
            <div className="admin-stat">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">در انتظار</div>
              </div>
            </div>
            <div className="admin-stat">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <div className="stat-number">{stats.completed}</div>
                <div className="stat-label">تکمیل شده</div>
              </div>
            </div>
            <div className="admin-stat">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-number">{stats.users}</div>
                <div className="stat-label">کاربران</div>
              </div>
            </div>
          </div>
        </div>

        {/* تب‌های پنل ادمین */}
        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* محتوای تب‌ها */}
        <div className="admin-content">
          {activeTab === 'evaluations' && (
            <EvaluationsList 
              evaluations={allEvaluations} 
              onRefresh={loadAllEvaluations}
            />
          )}
          {activeTab === 'analytics' && (
            <Analytics evaluations={allEvaluations} />
          )}
          {activeTab === 'users' && (
            <UserManagement />
          )}
          {activeTab === 'sms' && (
            <SMSManager />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;