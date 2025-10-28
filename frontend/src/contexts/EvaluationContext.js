// src/contexts/EvaluationContext.js
import React, { createContext, useState, useContext } from 'react';
import { evaluationService } from '../services/evaluationService';
import { AuthContext } from './AuthContext';

export const EvaluationContext = createContext();

export const EvaluationProvider = ({ children }) => {
  const [evaluations, setEvaluations] = useState([]);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const createEvaluation = async (evaluationData) => {
    try {
      setLoading(true);
      setError(null);
      const newEvaluation = await evaluationService.createEvaluation(evaluationData);
      setEvaluations(prev => [newEvaluation, ...prev]);
      return { success: true, data: newEvaluation };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getUserEvaluations = async () => {
    try {
      setLoading(true);
      const userEvaluations = await evaluationService.getUserEvaluations();
      setEvaluations(userEvaluations);
      return userEvaluations;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getEvaluationById = async (id) => {
    try {
      setLoading(true);
      const evaluation = await evaluationService.getEvaluationById(id);
      setCurrentEvaluation(evaluation);
      return evaluation;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    evaluations,
    currentEvaluation,
    loading,
    error,
    createEvaluation,
    getUserEvaluations,
    getEvaluationById,
    setError
  };

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
};