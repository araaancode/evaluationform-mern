// src/services/evaluationService.js

const API_URL = 'http://localhost:5000/api';

class EvaluationService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createEvaluation(evaluationData) {
    const response = await fetch(`${API_URL}/evaluations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(evaluationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در ثبت ارزیابی');
    }

    return data.data;
  }

  async getUserEvaluations() {
    const response = await fetch(`${API_URL}/evaluations/my-evaluations`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت ارزیابی‌ها');
    }

    return data.data;
  }

  async getEvaluationById(id) {
    const response = await fetch(`${API_URL}/evaluations/${id}`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت اطلاعات ارزیابی');
    }

    return data.data;
  }
}

export const evaluationService = new EvaluationService();