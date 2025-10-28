// src/components/evaluation/PersonalInfoSection.jsx
import React, { useState } from 'react';

const PersonalInfoSection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    gender: data.gender || '',
    birthDate: data.birthDate || '',
    phone: data.phone || '',
    militaryStatus: data.militaryStatus || '',
    exemptionType: data.exemptionType || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const showMilitarySection = formData.gender === 'مرد';

  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">نام *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">نام خانوادگی *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">جنسیت *</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="زن">زن</option>
            <option value="مرد">مرد</option>
            <option value="ترجیح می‌دهم نگویم">ترجیح می‌دهم نگویم</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">تاریخ تولد *</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">شماره تماس *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="09xxxxxxxxx"
            required
          />
        </div>
      </div>

      {/* بخش نظام وظیفه - فقط برای آقایان */}
      {showMilitarySection && (
        <div className="military-section">
          <h4>🪖 وضعیت نظام وظیفه</h4>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">وضعیت خدمت سربازی *</label>
              <select
                name="militaryStatus"
                value={formData.militaryStatus}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">انتخاب کنید</option>
                <option value="انجام شده">انجام شده</option>
                <option value="معافیت دائم">معافیت دائم</option>
                <option value="معافیت پزشکی">معافیت پزشکی</option>
                <option value="معافیت تحصیلی">معافیت تحصیلی</option>
                <option value="در حال خدمت">در حال خدمت</option>
              </select>
            </div>

            {(formData.militaryStatus === 'معافیت دائم' || 
              formData.militaryStatus === 'معافیت پزشکی' || 
              formData.militaryStatus === 'معافیت تحصیلی') && (
              <div className="form-group">
                <label className="form-label">نوع معافیت *</label>
                <input
                  type="text"
                  name="exemptionType"
                  value={formData.exemptionType}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="مثلاً: کفالت، پزشکی و ..."
                  required
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;