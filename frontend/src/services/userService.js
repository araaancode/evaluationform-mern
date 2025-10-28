// src/services/userService.js

const API_URL = 'http://localhost:5000/api';

class UserService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getAllUsers() {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت کاربران');
    }

    return data.data;
  }

  async updateUserRole(userId, newRole) {
    const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role: newRole }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در تغییر نقش کاربر');
    }

    return data.data;
  }

  async deleteUser(userId) {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در حذف کاربر');
    }

    return data;
  }

  async getUserStats() {
    const response = await fetch(`${API_URL}/admin/users/stats`, {
      headers: this.getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'خطا در دریافت آمار کاربران');
    }

    return data.data;
  }
}

export const userService = new UserService();