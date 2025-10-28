// src/components/evaluation/LanguageSection.jsx
import React, { useState } from 'react';

const LanguageSection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    targetLanguage: data.targetLanguage || '',
    level: data.level || '',
    certificate: data.certificate || 'ندارم',
    score: data.score || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    
    // اگر مدرک "ندارم" انتخاب شد، نمره پاک شود
    if (name === 'certificate' && value === 'ندارم') {
      updated.score = '';
    }
    
    setFormData(updated);
    onUpdate(updated);
  };

  const showScoreField = formData.certificate && formData.certificate !== 'ندارم';

  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">زبان مورد نظر *</label>
          <select
            name="targetLanguage"
            value={formData.targetLanguage}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="انگلیسی">انگلیسی</option>
            <option value="آلمانی">آلمانی</option>
            <option value="فرانسوی">فرانسوی</option>
            <option value="ایتالیایی">ایتالیایی</option>
            <option value="اسپانیایی">اسپانیایی</option>
            <option value="سایر">سایر</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">سطح فعلی *</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="مبتدی">مبتدی (A1-A2)</option>
            <option value="متوسط">متوسط (B1-B2)</option>
            <option value="پیشرفته">پیشرفته (C1-C2)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">مدرک زبان *</label>
          <select
            name="certificate"
            value={formData.certificate}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="ندارم">ندارم</option>
            <option value="IELTS">IELTS</option>
            <option value="TOEFL">TOEFL</option>
            <option value="PTE">PTE</option>
            <option value="TestDaF">TestDaF</option>
            <option value="TCF">TCF</option>
            <option value="DELF">DELF</option>
            <option value="سایر">سایر</option>
          </select>
        </div>

        {showScoreField && (
          <div className="form-group">
            <label className="form-label">
              نمره مدرک 
              {formData.certificate === 'IELTS' && ' (0-9)'}
              {formData.certificate === 'TOEFL' && ' (0-120)'}
              {formData.certificate === 'PTE' && ' (10-90)'}
            </label>
            <input
              type={formData.certificate === 'IELTS' ? 'number' : 'text'}
              step={formData.certificate === 'IELTS' ? '0.5' : '1'}
              min={formData.certificate === 'IELTS' ? '0' : ''}
              max={formData.certificate === 'IELTS' ? '9' : ''}
              name="score"
              value={formData.score}
              onChange={handleChange}
              className="form-input"
              placeholder={
                formData.certificate === 'IELTS' ? 'مثلاً 7.5' :
                formData.certificate === 'TOEFL' ? 'مثلاً 105' :
                'نمره خود را وارد کنید'
              }
            />
          </div>
        )}
      </div>

      {/* راهنمای سطوح زبان */}
      <div className="info-box">
        <h4>🎯 راهنمای سطوح زبان:</h4>
        <div className="levels-guide">
          <div className="level-item">
            <strong>مبتدی (A1-A2):</strong> توانایی مکالمات ساده و روزمره
          </div>
          <div className="level-item">
            <strong>متوسط (B1-B2):</strong> توانایی مکالمه روان و درک متون نسبتاً پیچیده
          </div>
          <div className="level-item">
            <strong>پیشرفته (C1-C2):</strong> تسلط کامل مشابه زبان مادری
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;