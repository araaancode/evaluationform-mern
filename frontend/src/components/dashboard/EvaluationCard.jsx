// src/components/dashboard/EvaluationCard.jsx
import React, { useState } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import './EvaluationCard.css';

const EvaluationCard = ({ evaluation }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'در انتظار بررسی', color: '#FF9800', icon: '⏳' },
      under_review: { label: 'در حال بررسی', color: '#2196F3', icon: '🔍' },
      completed: { label: 'تکمیل شده', color: '#4CAF50', icon: '✅' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(evaluation.status);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: faIR });
  };

  return (
    <div className="evaluation-card">
      <div className="card-header">
        <div className="card-main">
          <div className="card-title">
            <h3>ارزیابی {evaluation.brand}</h3>
            <span 
              className="status-badge"
              style={{ backgroundColor: statusInfo.color }}
            >
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>
          <div className="card-meta">
            <span>📅 {formatDate(evaluation.createdAt)}</span>
            {evaluation.score && (
              <span>🎯 امتیاز: {evaluation.score}/100</span>
            )}
          </div>
        </div>
        <div className="card-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'بستن جزئیات' : 'مشاهده جزئیات'}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="card-details">
          <div className="details-grid">
            {/* اطلاعات فردی */}
            <div className="detail-section">
              <h4>👤 اطلاعات فردی</h4>
              <div className="detail-row">
                <span>نام کامل:</span>
                <span>{evaluation.personalInfo?.firstName} {evaluation.personalInfo?.lastName}</span>
              </div>
              <div className="detail-row">
                <span>جنسیت:</span>
                <span>{evaluation.personalInfo?.gender}</span>
              </div>
              <div className="detail-row">
                <span>تاریخ تولد:</span>
                <span>{evaluation.personalInfo?.birthDate}</span>
              </div>
            </div>

            {/* اطلاعات تحصیلی */}
            <div className="detail-section">
              <h4>🎓 اطلاعات تحصیلی</h4>
              <div className="detail-row">
                <span>مدرک:</span>
                <span>{evaluation.education?.degree}</span>
              </div>
              <div className="detail-row">
                <span>رشته:</span>
                <span>{evaluation.education?.field}</span>
              </div>
              <div className="detail-row">
                <span>معدل:</span>
                <span>{evaluation.education?.gpa}</span>
              </div>
            </div>

            {/* اطلاعات مهاجرتی */}
            <div className="detail-section">
              <h4>🌍 اطلاعات مهاجرتی</h4>
              <div className="detail-row">
                <span>کشورهای مورد نظر:</span>
                <span>{evaluation.immigration?.targetCountries?.join('، ')}</span>
              </div>
              <div className="detail-row">
                <span>هدف:</span>
                <span>{evaluation.immigration?.purpose}</span>
              </div>
            </div>

            {/* سطح زبان */}
            <div className="detail-section">
              <h4>🗣 سطح زبان</h4>
              <div className="detail-row">
                <span>زبان:</span>
                <span>{evaluation.language?.targetLanguage}</span>
              </div>
              <div className="detail-row">
                <span>سطح:</span>
                <span>{evaluation.language?.level}</span>
              </div>
              {evaluation.language?.certificate && evaluation.language.certificate !== 'ندارم' && (
                <div className="detail-row">
                  <span>مدرک:</span>
                  <span>{evaluation.language?.certificate} - {evaluation.language?.score}</span>
                </div>
              )}
            </div>
          </div>

          {/* اقدامات */}
          <div className="card-actions-footer">
            <button className="btn btn-secondary">
              📞 درخواست مشاوره
            </button>
            <button className="btn btn-primary">
              📄 دریافت گزارش کامل
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationCard;