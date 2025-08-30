// components/email-template.tsx

import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  company?: string;
  phone: string;
  service: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name, email, company, phone, service, message,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f4f4f4' }}>
    <div style={{ maxWidth: '600px', margin: 'auto', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
      <h1 style={{ color: '#333', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        رسالة جديدة من موقع المصنع
      </h1>
      <h2 style={{ color: '#555' }}>تفاصيل المرسل:</h2>
      <ul>
        <li><strong>الاسم:</strong> {name}</li>
        <li><strong>البريد الإلكتروني:</strong> {email}</li>
        {company && <li><strong>الشركة:</strong> {company}</li>}
        <li><strong>رقم الهاتف:</strong> {phone}</li>
        <li><strong>الخدمة المطلوبة:</strong> {service}</li>
      </ul>
      <h2 style={{ color: '#555', marginTop: '20px' }}>نص الرسالة:</h2>
      <p style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
        {message}
      </p>
    </div>
  </div>
);