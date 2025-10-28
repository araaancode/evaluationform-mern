// src/components/admin/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // شبیه‌سازی داده‌های کاربران
      setTimeout(() => {
        const mockUsers = [
          {
            _id: '1',
            firstName: 'علی',
            lastName: 'محمدی',
            phone: '09123456789',
            email: 'ali@example.com',
            role: 'user',
            createdAt: '2024-01-15',
            evaluationsCount: 3,
            lastLogin: '2024-01-20'
          },
          {
            _id: '2',
            firstName: 'زهرا',
            lastName: 'احمدی',
            phone: '09129876543',
            email: 'zahra@example.com',
            role: 'user',
            createdAt: '2024-01-10',
            evaluationsCount: 1,
            lastLogin: '2024-01-19'
          },
          {
            _id: '3',
            firstName: 'مدیر',
            lastName: 'سیستم',
            phone: '09120000000',
            email: 'admin@faramohajerat.ir',
            role: 'admin',
            createdAt: '2024-01-01',
            evaluationsCount: 0,
            lastLogin: '2024-01-20'
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      // در واقعیت اینجا API call می‌شود
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      alert(`نقش کاربر با موفقیت به ${newRole === 'admin' ? 'مدیر' : 'کاربر عادی'} تغییر یافت`);
    } catch (error) {
      alert('خطا در تغییر نقش کاربر');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      try {
        // در واقعیت اینجا API call می‌شود
        setUsers(prev => prev.filter(user => user._id !== userId));
        alert('کاربر با موفقیت حذف شد');
      } catch (error) {
        alert('خطا در حذف کاربر');
      }
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>در حال بارگذاری کاربران...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>👥 مدیریت کاربران</h2>
        <p>مدیریت کاربران سیستم و تنظیمات دسترسی</p>
      </div>

      {/* کنترل‌های فیلتر و جستجو */}
      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل یا شماره تماس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="user">کاربران عادی</option>
            <option value="admin">مدیران</option>
          </select>

          <button className="btn btn-primary" onClick={loadUsers}>
            🔄 بروزرسانی
          </button>
        </div>
      </div>

      {/* آمار کاربران */}
      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">کل کاربران</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{users.filter(u => u.role === 'user').length}</div>
          <div className="stat-label">کاربران عادی</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
          <div className="stat-label">مدیران</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {users.reduce((sum, user) => sum + user.evaluationsCount, 0)}
          </div>
          <div className="stat-label">کل ارزیابی‌ها</div>
        </div>
      </div>

      {/* جدول کاربران */}
      <div className="users-table">
        <div className="table-header">
          <div>اطلاعات کاربر</div>
          <div>نقش</div>
          <div>تعداد ارزیابی‌ها</div>
          <div>تاریخ عضویت</div>
          <div>آخرین ورود</div>
          <div>عملیات</div>
        </div>

        <div className="table-body">
          {filteredUsers.map(user => (
            <div key={user._id} className="table-row">
              <div className="user-info">
                <div className="user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="user-contact">
                  <div>📱 {user.phone}</div>
                  <div>📧 {user.email}</div>
                </div>
              </div>

              <div className="role-cell">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="role-select"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر سیستم</option>
                </select>
              </div>

              <div className="evaluations-cell">
                <span className="count-badge">{user.evaluationsCount}</span>
              </div>

              <div className="date-cell">
                {new Date(user.createdAt).toLocaleDateString('fa-IR')}
              </div>

              <div className="date-cell">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fa-IR') : '--'}
              </div>

              <div className="actions-cell">
                <div className="action-buttons">
                  <button
                    className="btn-action view"
                    onClick={() => handleViewUserDetails(user)}
                    title="مشاهده جزئیات"
                  >
                    👁️
                  </button>
                  
                  <button
                    className="btn-action delete"
                    onClick={() => handleDeleteUser(user._id)}
                    title="حذف کاربر"
                    disabled={user.role === 'admin'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* پیام خالی */}
      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>هیچ کاربری یافت نشد</h3>
          <p>هیچ کاربری با فیلترهای انتخاب شده مطابقت ندارد</p>
        </div>
      )}

      {/* مودال جزئیات کاربر */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </div>
  );
};

// کامپوننت مودال جزئیات کاربر
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>جزئیات کاربر</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="user-details">
            <div className="detail-row">
              <label>نام کامل:</label>
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <div className="detail-row">
              <label>شماره تماس:</label>
              <span>{user.phone}</span>
            </div>
            <div className="detail-row">
              <label>ایمیل:</label>
              <span>{user.email}</span>
            </div>
            <div className="detail-row">
              <label>نقش:</label>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
              </span>
            </div>
            <div className="detail-row">
              <label>تعداد ارزیابی‌ها:</label>
              <span>{user.evaluationsCount}</span>
            </div>
            <div className="detail-row">
              <label>تاریخ عضویت:</label>
              <span>{new Date(user.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
            <div className="detail-row">
              <label>آخرین ورود:</label>
              <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fa-IR') : '--'}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;