// src/components/evaluation/EvaluationForm.jsx
import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';
import EducationSection from './EducationSection';
import EmploymentSection from './EmploymentSection';
import ImmigrationSection from './ImmigrationSection';
import LanguageSection from './LanguageSection';
import FamilySection from './FamilySection';
import './EvaluationForm.css';

const EvaluationForm = ({
  currentSection,
  setCurrentSection,
  sections,
  formData,
  onFormUpdate,
  onSubmit
}) => {
  const renderSection = () => {
    const sectionProps = {
      data: formData,
      onUpdate: onFormUpdate
    };

    switch (currentSection) {
      case 0:
        return <PersonalInfoSection {...sectionProps} />;
      case 1:
        return <EducationSection {...sectionProps} />;
      case 2:
        return <EmploymentSection {...sectionProps} />;
      case 3:
        return <ImmigrationSection {...sectionProps} />;
      case 4:
        return <LanguageSection {...sectionProps} />;
      case 5:
        return <FamilySection {...sectionProps} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="evaluation-form">
      <div className="form-section-header">
        <h2>{sections[currentSection].title}</h2>
        <p>{sections[currentSection].description}</p>
      </div>

      <div className="form-content">
        {renderSection()}
      </div>

      <div className="form-navigation">
        <button
          type="button"
          onClick={handlePrev}
          className="btn btn-secondary"
          disabled={currentSection === 0}
        >
          قبلی
        </button>

        {currentSection < sections.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
          >
            بعدی
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            className="btn btn-primary"
          >
            ✅ ارسال ارزیابی
          </button>
        )}
      </div>
    </div>
  );
};

export default EvaluationForm;