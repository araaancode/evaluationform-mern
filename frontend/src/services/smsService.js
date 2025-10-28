// src/services/smsService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class SMSService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getTemplates() {
    const response = await fetch(`${API_URL}/admin/sms/templates`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت تمپلیت‌ها');
    }

    return data.data;
  }

  async updateTemplate(templateId, templateData) {
    const response = await fetch(`${API_URL}/admin/sms/templates/${templateId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(templateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در به‌روزرسانی تمپلیت');
    }

    return data.data;
  }

  async sendSMS(smsData) {
    const response = await fetch(`${API_URL}/admin/sms/send`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(smsData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در ارسال پیامک');
    }

    return data.data;
  }

  async getSentMessages(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/admin/sms/history?${queryParams}`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت تاریخچه پیامک‌ها');
    }

    return data.data;
  }

  async getSMSStats() {
    const response = await fetch(`${API_URL}/admin/sms/stats`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت آمار پیامک‌ها');
    }

    return data.data;
  }
}

export const smsService = new SMSService();