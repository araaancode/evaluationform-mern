// src/components/evaluation/FamilySection.jsx
import React, { useState } from 'react';

const FamilySection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    maritalStatus: data.maritalStatus || '',
    childrenCount: data.childrenCount || 0,
    childrenAges: data.childrenAges || '',
    familyMigrationPlan: data.familyMigrationPlan || ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseInt(value) || 0 : value;
    
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    onUpdate(updated);
  };

  const showFamilyFields = formData.maritalStatus && formData.maritalStatus !== 'مجرد';
  const showChildrenFields = showFamilyFields && formData.childrenCount > 0;

  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">وضعیت تأهل *</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="مجرد">مجرد</option>
            <option value="متأهل">متأهل</option>
            <option value="طلاق‌گرفته">طلاق‌گرفته</option>
            <option value="هم‌خانگی">هم‌خانگی</option>
          </select>
        </div>

        {showFamilyFields && (
          <>
            <div className="form-group">
              <label className="form-label">تعداد فرزندان *</label>
              <input
                type="number"
                name="childrenCount"
                value={formData.childrenCount}
                onChange={handleChange}
                className="form-input"
                min="0"
                max="20"
                required
              />
            </div>

            {showChildrenFields && (
              <div className="form-group">
                <label className="form-label">سن فرزندان</label>
                <input
                  type="text"
                  name="childrenAges"
                  value={formData.childrenAges}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثلاً: ۵ سال، ۸ سال"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">آیا همسر یا فرزندان قصد مهاجرت دارند؟ *</label>
              <select
                name="familyMigrationPlan"
                value={formData.familyMigrationPlan}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">انتخاب کنید</option>
                <option value="بله">بله</option>
                <option value="خیر">خیر</option>
                <option value="هنوز مشخص نیست">هنوز مشخص نیست</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* پیام پایانی فرم */}
      {formData.maritalStatus && (
        <div className="completion-message">
          <div className="success-box">
            <h4>✅ تقریباً تمام شد!</h4>
            <p>
              با تکمیل این بخش، اطلاعات اولیه شما جمع‌آوری می‌شود. 
              مشاوران ما به زودی با شما تماس گرفته و تحلیل تخصصی شرایطتان را ارائه خواهند داد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySection;