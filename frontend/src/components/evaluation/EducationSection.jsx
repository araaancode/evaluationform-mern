// src/components/evaluation/EducationSection.jsx
import React, { useState } from 'react';

const EducationSection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    degree: data.degree || '',
    field: data.field || '',
    gpa: data.gpa || '',
    university: data.university || '',
    graduationYear: data.graduationYear || ''
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
          <label className="form-label">آخرین مدرک تحصیلی *</label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="دیپلم">دیپلم</option>
            <option value="فوق‌دیپلم">فوق‌دیپلم</option>
            <option value="کارشناسی">کارشناسی</option>
            <option value="کارشناسی ارشد">کارشناسی ارشد</option>
            <option value="دکتری">دکتری</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">رشته تحصیلی *</label>
          <input
            type="text"
            name="field"
            value={formData.field}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">معدل آخرین مدرک *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="20"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
            className="form-input"
            placeholder="مثلاً 17.5"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">دانشگاه محل تحصیل *</label>
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">سال فارغ‌التحصیلی *</label>
          <input
            type="number"
            min="1300"
            max="1405"
            name="graduationYear"
            value={formData.graduationYear}
            onChange={handleChange}
            className="form-input"
            placeholder="مثلاً 1400"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EducationSection;