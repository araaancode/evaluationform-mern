// src/components/evaluation/EmploymentSection.jsx
import React, { useState } from 'react';

const EmploymentSection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    jobTitle: data.jobTitle || '',
    experience: data.experience || '',
    field: data.field || '',
    company: data.company || '',
    contractType: data.contractType || '',
    salaryRange: data.salaryRange || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">عنوان شغلی فعلی *</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            className="form-input"
            placeholder="مثلاً: توسعه‌دهنده فرانت‌اند"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">سابقه کاری (به سال) *</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="form-input"
            min="0"
            max="50"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">حوزه کاری *</label>
          <select
            name="field"
            value={formData.field}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="IT">IT و فناوری اطلاعات</option>
            <option value="پزشکی">پزشکی و سلامت</option>
            <option value="آموزش">آموزش و پژوهش</option>
            <option value="مهندسی">مهندسی</option>
            <option value="هنر">هنر و طراحی</option>
            <option value="سایر">سایر</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">نام شرکت یا سازمان فعلی</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
            placeholder="اختیاری"
          />
        </div>

        <div className="form-group">
          <label className="form-label">نوع قرارداد *</label>
          <select
            name="contractType"
            value={formData.contractType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="رسمی">رسمی</option>
            <option value="پیمانی">پیمانی</option>
            <option value="آزاد">آزاد (فریلنسر)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">درآمد ماهانه (تومان)</label>
          <select
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">انتخاب کنید</option>
            <option value="کمتر از ۲۰ میلیون">کمتر از ۲۰ میلیون</option>
            <option value="۲۰-۵۰ میلیون">۲۰-۵۰ میلیون</option>
            <option value="۵۰-۱۰۰ میلیون">۵۰-۱۰۰ میلیون</option>
            <option value="بالای ۱۰۰ میلیون">بالای ۱۰۰ میلیون</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EmploymentSection;