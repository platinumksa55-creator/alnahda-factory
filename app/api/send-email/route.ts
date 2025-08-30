import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, company, phone, service, message } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // تم تصحيح الخطأ هنا
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_EMAIL}>`,
      to: 'info@alnahdafactory.com',
      replyTo: email,
      subject: `رسالة جديدة من ${name} عبر الموقع`,
      html: `
        <h1>رسالة جديدة من نموذج التواصل</h1>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد الإلكتروني للمرسل:</strong> ${email}</p>
        <p><strong>الشركة:</strong> ${company || 'لم يحدد'}</p>
        <p><strong>رقم الهاتف:</strong> ${phone}</p>
        <p><strong>الخدمة المطلوبة:</strong> ${service}</p>
        <hr />
        <h3>الرسالة:</h3>
        <p>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully!' });

  } catch (error) {
    console.error("!!! FAILED TO SEND EMAIL:", error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}