// src/components/admin/EvaluationsList.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import './EvaluationsList.css';

const EvaluationsList = ({ evaluations, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvaluations = evaluations.filter(eval => {
    // فیلتر بر اساس وضعیت
    if (filter !== 'all' && eval.status !== filter) return false;
    
    // جستجو در نام و نام خانوادگی
    if (searchTerm) {
      const fullName = `${eval.personalInfo?.firstName} ${eval.personalInfo?.lastName}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return true;
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'در انتظار', color: '#FF9800', icon: '⏳' },
      under_review: { label: 'در حال بررسی', color: '#2196F3', icon: '🔍' },
      completed: { label: 'تکمیل شده', color: '#4CAF50', icon: '✅' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const handleSendSMS = async (phone, evaluationId) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone,
          evaluationId,
          type: 'reminder'
        })
      });
      
      if (response.ok) {
        alert('پیامک با موفقیت ارسال شد');
      }
    } catch (error) {
      alert('خطا در ارسال پیامک');
    }
  };

  const handleUpdateStatus = async (evaluationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/evaluations/${evaluationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        onRefresh();
        alert('وضعیت با موفقیت به‌روزرسانی شد');
      }
    } catch (error) {
      alert('خطا در به‌روزرسانی وضعیت');
    }
  };

  return (
    <div className="evaluations-list-admin">
      {/* فیلتر و جستجو */}
      <div className="list-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="جستجو بر اساس نام..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="pending">در انتظار</option>
            <option value="under_review">در حال بررسی</option>
            <option value="completed">تکمیل شده</option>
          </select>
          
          <button onClick={onRefresh} className="btn btn-secondary">
            🔄 بروزرسانی
          </button>
        </div>
      </div>

      {/* جدول ارزیابی‌ها */}
      <div className="evaluations-table">
        <div className="table-header">
          <div>کاربر</div>
          <div>برند</div>
          <div>وضعیت</div>
          <div>تاریخ</div>
          <div>امتیاز</div>
          <div>عملیات</div>
        </div>
        
        <div className="table-body">
          {filteredEvaluations.map(evaluation => {
            const statusInfo = getStatusInfo(evaluation.status);
            
            return (
              <div key={evaluation._id} className="table-row">
                <div className="user-info">
                  <div className="user-name">
                    {evaluation.personalInfo?.firstName} {evaluation.personalInfo?.lastName}
                  </div>
                  <div className="user-phone">
                    {evaluation.personalInfo?.phone}
                  </div>
                </div>
                
                <div className="brand-cell">
                  {evaluation.brand}
                </div>
                
                <div className="status-cell">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.icon} {statusInfo.label}
                  </span>
                </div>
                
                <div className="date-cell">
                  {format(new Date(evaluation.createdAt), 'dd/MM/yyyy', { locale: faIR })}
                </div>
                
                <div className="score-cell">
                  {evaluation.score ? `${evaluation.score}/100` : '--'}
                </div>
                
                <div className="actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="btn-action sms"
                      onClick={() => handleSendSMS(evaluation.personalInfo?.phone, evaluation._id)}
                      title="ارسال پیامک"
                    >
                      💬
                    </button>
                    
                    <select 
                      value={evaluation.status}
                      onChange={(e) => handleUpdateStatus(evaluation._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">در انتظار</option>
                      <option value="under_review">در حال بررسی</option>
                      <option value="completed">تکمیل شده</option>
                    </select>
                    
                    <button 
                      className="btn-action view"
                      title="مشاهده جزئیات"
                    >
                      👁️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* پیام خالی */}
      {filteredEvaluations.length === 0 && (
        <div className="empty-table">
          <div className="empty-icon">📋</div>
          <h3>هیچ ارزیابی یافت نشد</h3>
          <p>هیچ ارزیابی با فیلترهای انتخاب شده مطابقت ندارد</p>
        </div>
      )}
    </div>
  );
};

export default EvaluationsList;