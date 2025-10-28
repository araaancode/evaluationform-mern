// src/pages/Evaluation.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EvaluationContext } from '../contexts/EvaluationContext';
import { AuthContext } from '../contexts/AuthContext';
import EvaluationForm from '../components/evaluation/EvaluationForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './Evaluation.css';

const Evaluation = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({});
  const { createEvaluation, loading } = useContext(EvaluationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const sections = [
    {
      title: "🎯 اطلاعات فردی",
      description: "لطفاً اطلاعات شخصی خود را با دقت وارد کنید"
    },
    {
      title: "🎓 اطلاعات تحصیلی",
      description: "سوابق تحصیلی خود را ثبت کنید"
    },
    {
      title: "💼 اطلاعات شغلی",
      description: "تجربیات کاری خود را وارد کنید"
    },
    {
      title: "🌍 اطلاعات مهاجرتی",
      description: "اهداف و سوابق مهاجرتی خود را مشخص کنید"
    },
    {
      title: "🗣 سطح زبان",
      description: "مهارت‌های زبانی خود را ارزیابی کنید"
    },
    {
      title: "👪 اطلاعات خانوادگی",
      description: "وضعیت خانوادگی خود را بیان کنید"
    }
  ];

  const handleFormUpdate = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (finalData) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const completeData = { ...formData, ...finalData };
    const result = await createEvaluation(completeData);
    
    if (result.success) {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <LoadingSpinner text="در حال ثبت ارزیابی..." />;
  }

  return (
    <div className="evaluation-page">
      <div className="container">
        <div className="evaluation-header">
          <h1>ارزیابی اولیه مهاجرت</h1>
          <p className="intro-text">
            به ارزیابی اولیه فرامهاجرت خوش آمدید 🌍
            <br />
            این فرم با هدف جمع‌آوری اطلاعات کلیدی شما طراحی شده تا مشاوران ارشد ما، 
            پیش از جلسه، تصویری جامع از شرایط، توانایی‌ها و اهداف شما داشته باشند.
          </p>
        </div>

        <div className="evaluation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            بخش {currentSection + 1} از {sections.length}
          </div>
        </div>

        <EvaluationForm
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sections={sections}
          formData={formData}
          onFormUpdate={handleFormUpdate}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Evaluation;