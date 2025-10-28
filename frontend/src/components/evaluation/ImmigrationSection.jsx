// src/components/evaluation/ImmigrationSection.jsx
import React, { useState } from 'react';

const ImmigrationSection = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState({
    targetCountries: data.targetCountries || [],
    purpose: data.purpose || '',
    travelHistory: data.travelHistory || '',
    schengenVisa: data.schengenVisa || '',
    visaRejections: data.visaRejections || '',
    previousAttempts: data.previousAttempts || false,
    previousAttemptsDesc: data.previousAttemptsDesc || ''
  });

  const countries = [
    'کانادا', 'آمریکا', 'آلمان', 'فرانسه', 'ایتالیا', 'اسپانیا',
    'استرالیا', 'انگلستان', 'سوئد', 'نروژ', 'دانمارک', 'هلند',
    'سوئیس', 'اتریش', 'ژاپن', 'کره جنوبی', 'سایر'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updated = { ...formData, [name]: newValue };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleCountryChange = (country) => {
    const updatedCountries = formData.targetCountries.includes(country)
      ? formData.targetCountries.filter(c => c !== country)
      : [...formData.targetCountries, country];
    
    const updated = { ...formData, targetCountries: updatedCountries };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="form-section">
      <div className="form-grid">
        <div className="form-group full-width">
          <label className="form-label">کشور یا کشورهای مورد نظر برای مهاجرت *</label>
          <div className="countries-grid">
            {countries.map(country => (
              <label key={country} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.targetCountries.includes(country)}
                  onChange={() => handleCountryChange(country)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                {country}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">هدف از مهاجرت *</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">انتخاب کنید</option>
            <option value="تحصیلی">تحصیلی</option>
            <option value="کاری">کاری</option>
            <option value="سرمایه‌گذاری">سرمایه‌گذاری</option>
            <option value="پناهندگی">پناهندگی</option>
            <option value="همراهی خانواده">همراهی خانواده</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label className="form-label">سابقه سفر خارجی *</label>
          <textarea
            name="travelHistory"
            value={formData.travelHistory}
            onChange={handleChange}
            className="form-textarea"
            rows="3"
            placeholder="کشورها و سال سفر خود را ذکر کنید"
            required
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">سابقه ویزای شنگن</label>
          <textarea
            name="schengenVisa"
            value={formData.schengenVisa}
            onChange={handleChange}
            className="form-textarea"
            rows="2"
            placeholder="کشور، نوع ویزا، سال دریافت"
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">سابقه ریجکتی ویزا</label>
          <textarea
            name="visaRejections"
            value={formData.visaRejections}
            onChange={handleChange}
            className="form-textarea"
            rows="2"
            placeholder="کشور، دلیل ریجکتی، سال"
          />
        </div>

        <div className="form-group full-width">
          <label className="checkbox-label large">
            <input
              type="checkbox"
              name="previousAttempts"
              checked={formData.previousAttempts}
              onChange={handleChange}
              className="checkbox-input"
            />
            <span className="checkbox-custom"></span>
            آیا قبلاً برای مهاجرت اقدام کرده‌اید؟
          </label>
        </div>

        {formData.previousAttempts && (
          <div className="form-group full-width">
            <label className="form-label">شرح مختصر اقدامات قبلی</label>
            <textarea
              name="previousAttemptsDesc"
              value={formData.previousAttemptsDesc}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="شرح اقداماتی که قبلاً برای مهاجرت انجام داده‌اید"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImmigrationSection;