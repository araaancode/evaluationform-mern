// src/services/authService.js

// استفاده از URL ثابت - بعداً می‌توانید از فایل محیطی استفاده کنید
const API_URL = 'http://localhost:5000/api';

class AuthService {
  async login(phone, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در ورود');
    }

    return data;
  }

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در ثبت‌نام');
    }

    return data;
  }

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      localStorage.removeItem('token');
      throw new Error(data.message || 'خطا در دریافت اطلاعات کاربر');
    }

    return data;
  }
}

export const authService = new AuthService();