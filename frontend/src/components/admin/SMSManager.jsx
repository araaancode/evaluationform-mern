// src/components/admin/SMSManager.jsx
import React, { useState, useEffect } from 'react';
import './SMSManager.css';

const SMSManager = () => {
  const [smsTemplates, setSmsTemplates] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sendSmsData, setSendSmsData] = useState({
    phone: '',
    template: '',
    customMessage: '',
    evaluationId: ''
  });

  useEffect(() => {
    loadTemplates();
    loadSentMessages();
  }, []);

  const loadTemplates = async () => {
    // شبیه‌سازی بارگذاری تمپلیت‌ها
    setTimeout(() => {
      const mockTemplates = [
        {
          id: '1',
          name: 'خوش‌آمدگویی',
          code: 'WELCOME',
          content: 'به فرامهاجرت خوش آمدید 🌍\nارزیابی شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.',
          variables: ['firstName', 'lastName'],
          createdAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'یادآوری ارزیابی',
          code: 'REMINDER',
          content: 'سلام {firstName} عزیز 👋\nیادآوری می‌کنیم که ارزیابی شما در حال بررسی است.\nبرای اطلاعات بیشتر با ما تماس بگیرید.',
          variables: ['firstName', 'lastName'],
          createdAt: '2024-01-01'
        },
        {
          id: '3',
          name: 'نتیجه ارزیابی',
          code: 'RESULT',
          content: 'سلام {firstName} عزیز 🎉\nنتایج ارزیابی شما آماده است.\nامتیاز: {score}\nبرای مشاهده جزئیات به پنل کاربری مراجعه کنید.',
          variables: ['firstName', 'score'],
          createdAt: '2024-01-01'
        }
      ];
      setSmsTemplates(mockTemplates);
    }, 500);
  };

  const loadSentMessages = async () => {
    // شبیه‌سازی بارگذاری پیامک‌های ارسال شده
    setTimeout(() => {
      const mockMessages = [
        {
          id: '1',
          phone: '09123456789',
          template: 'WELCOME',
          content: 'به فرامهاجرت خوش آمدید...',
          status: 'delivered',
          sentAt: '2024-01-20T10:30:00',
          cost: 250
        },
        {
          id: '2',
          phone: '09129876543',
          template: 'REMINDER',
          content: 'سلام زهرا عزیز...',
          status: 'sent',
          sentAt: '2024-01-19T15:45:00',
          cost: 250
        }
      ];
      setSentMessages(mockMessages);
    }, 500);
  };

  const handleSendSMS = async (e) => {
    e.preventDefault();
    
    if (!sendSmsData.phone && !sendSmsData.evaluationId) {
      alert('لطفاً شماره تماس یا انتخاب ارزیابی را وارد کنید');
      return;
    }

    try {
      // شبیه‌سازی ارسال پیامک
      const newMessage = {
        id: Date.now().toString(),
        phone: sendSmsData.phone || '09120000000',
        template: sendSmsData.template,
        content: sendSmsData.customMessage || 'پیام تستی',
        status: 'sent',
        sentAt: new Date().toISOString(),
        cost: 250
      };

      setSentMessages(prev => [newMessage, ...prev]);
      setSendSmsData({
        phone: '',
        template: '',
        customMessage: '',
        evaluationId: ''
      });
      
      alert('پیامک با موفقیت ارسال شد');
    } catch (error) {
      alert('خطا در ارسال پیامک');
    }
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = (updatedTemplate) => {
    setSmsTemplates(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
    setShowTemplateModal(false);
    setSelectedTemplate(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      sent: '#2196F3',
      delivered: '#4CAF50',
      failed: '#F44336',
      pending: '#FF9800'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="sms-manager">
      <div className="management-header">
        <h2>💬 مدیریت پیامک</h2>
        <p>مدیریت تمپلیت‌ها و ارسال پیامک به کاربران</p>
      </div>

      {/* تب‌های مدیریت پیامک */}
      <div className="sms-tabs">
        <button 
          className={`sms-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📝 تمپلیت‌ها
        </button>
        <button 
          className={`sms-tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          📤 ارسال پیامک
        </button>
        <button 
          className={`sms-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📋 تاریخچه ارسال
        </button>
      </div>

      {/* محتوای تب‌ها */}
      <div className="sms-content">
        {activeTab === 'templates' && (
          <TemplatesTab 
            templates={smsTemplates}
            onEditTemplate={handleEditTemplate}
          />
        )}

        {activeTab === 'send' && (
          <SendSmsTab 
            sendData={sendSmsData}
            onChange={setSendSmsData}
            onSubmit={handleSendSMS}
            templates={smsTemplates}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab 
            messages={sentMessages}
            getStatusColor={getStatusColor}
          />
        )}
      </div>

      {/* مودال ویرایش تمپلیت */}
      {showTemplateModal && (
        <TemplateModal
          template={selectedTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowTemplateModal(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </div>
  );
};

// تب تمپلیت‌ها
const TemplatesTab = ({ templates, onEditTemplate }) => {
  return (
    <div className="templates-tab">
      <div className="section-header">
        <h3>تمپلیت‌های پیامک</h3>
        <p>مدیریت متن‌های پیش‌فرض پیامک‌ها</p>
      </div>

      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <h4>{template.name}</h4>
              <span className="template-code">{template.code}</span>
            </div>
            
            <div className="template-content">
              <p>{template.content}</p>
            </div>

            <div className="template-variables">
              <strong>متغیرها:</strong>
              {template.variables.map(variable => (
                <span key={variable} className="variable-tag">
                  {variable}
                </span>
              ))}
            </div>

            <div className="template-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => onEditTemplate(template)}
              >
                ✏️ ویرایش
              </button>
              <button className="btn btn-primary">
                📤 تست ارسال
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// تب ارسال پیامک
const SendSmsTab = ({ sendData, onChange, onSubmit, templates }) => {
  return (
    <div className="send-sms-tab">
      <div className="section-header">
        <h3>ارسال پیامک جدید</h3>
        <p>ارسال پیامک به کاربران خاص یا گروهی</p>
      </div>

      <form onSubmit={onSubmit} className="send-sms-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">شماره تماس گیرنده</label>
            <input
              type="tel"
              value={sendData.phone}
              onChange={(e) => onChange(prev => ({ ...prev, phone: e.target.value }))}
              className="form-input"
              placeholder="09xxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label className="form-label">آیدی ارزیابی (اختیاری)</label>
            <input
              type="text"
              value={sendData.evaluationId}
              onChange={(e) => onChange(prev => ({ ...prev, evaluationId: e.target.value }))}
              className="form-input"
              placeholder="برای ارسال خودکار به کاربر ارزیابی"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">انتخاب تمپلیت</label>
          <select
            value={sendData.template}
            onChange={(e) => onChange(prev => ({ ...prev, template: e.target.value }))}
            className="form-select"
          >
            <option value="">انتخاب تمپلیت (اختیاری)</option>
            {templates.map(template => (
              <option key={template.id} value={template.code}>
                {template.name} - {template.code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">متن پیامک *</label>
          <textarea
            value={sendData.customMessage}
            onChange={(e) => onChange(prev => ({ ...prev, customMessage: e.target.value }))}
            className="form-textarea"
            rows="4"
            placeholder="متن پیامک خود را وارد کنید..."
            required
          />
          <div className="char-count">
            {sendData.customMessage.length} / 160 کاراکتر
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-large">
            📤 ارسال پیامک
          </button>
          <button type="button" className="btn btn-secondary">
            پاک کردن فرم
          </button>
        </div>
      </form>
    </div>
  );
};

// تب تاریخچه
const HistoryTab = ({ messages, getStatusColor }) => {
  return (
    <div className="history-tab">
      <div className="section-header">
        <h3>تاریخچه ارسال پیامک</h3>
        <p>پیامک‌های ارسال شده در 30 روز گذشته</p>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-number">{messages.length}</div>
          <div className="stat-label">کل پیامک‌ها</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {messages.filter(m => m.status === 'delivered').length}
          </div>
          <div className="stat-label">تحویل شده</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {messages.reduce((sum, msg) => sum + msg.cost, 0)}
          </div>
          <div className="stat-label">هزینه کل (تومان)</div>
        </div>
      </div>

      <div className="messages-table">
        <div className="table-header">
          <div>شماره گیرنده</div>
          <div>تمپلیت</div>
          <div>متن پیامک</div>
          <div>وضعیت</div>
          <div>زمان ارسال</div>
          <div>هزینه</div>
        </div>

        <div className="table-body">
          {messages.map(message => (
            <div key={message.id} className="table-row">
              <div className="phone-cell">{message.phone}</div>
              <div className="template-cell">{message.template}</div>
              <div className="content-cell">
                <div className="content-preview">
                  {message.content.substring(0, 50)}...
                </div>
              </div>
              <div className="status-cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(message.status) }}
                >
                  {message.status === 'delivered' ? '✓ تحویل شده' :
                   message.status === 'sent' ? '📤 ارسال شده' :
                   message.status === 'failed' ? '✗ خطا' : '⏳ در حال ارسال'}
                </span>
              </div>
              <div className="date-cell">
                {new Date(message.sentAt).toLocaleString('fa-IR')}
              </div>
              <div className="cost-cell">{message.cost} تومان</div>
            </div>
          ))}
        </div>
      </div>

      {messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>هیچ پیامکی یافت نشد</h3>
          <p>هنوز هیچ پیامکی ارسال نکرده‌اید</p>
        </div>
      )}
    </div>
  );
};

// مودال ویرایش تمپلیت
const TemplateModal = ({ template, onSave, onClose }) => {
  const [formData, setFormData] = useState(template);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h3>ویرایش تمپلیت پیامک</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">نام تمپلیت</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">کد تمپلیت</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">متن پیامک</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="form-textarea"
                rows="6"
                required
              />
              <div className="form-hint">
                از متغیرها مانند {'{firstName}'} برای شخصی‌سازی استفاده کنید
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">متغیرهای موجود</label>
              <div className="variables-list">
                {formData.variables.map((variable, index) => (
                  <span key={variable} className="variable-tag">
                    {variable}
                    <button
                      type="button"
                      className="remove-variable"
                      onClick={() => {
                        const newVariables = formData.variables.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, variables: newVariables }));
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="افزودن متغیر جدید"
                className="form-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const newVariable = e.target.value.trim();
                    if (newVariable && !formData.variables.includes(newVariable)) {
                      setFormData(prev => ({
                        ...prev,
                        variables: [...prev.variables, newVariable]
                      }));
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              انصراف
            </button>
            <button type="submit" className="btn btn-primary">
              💾 ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SMSManager;