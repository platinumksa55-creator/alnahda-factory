// app/api/test/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  console.log("--- Starting API Test ---");
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("!!! RESEND_API_KEY is not found in .env.local");
      throw new Error("مفتاح RESEND_API_KEY غير موجود في ملف .env.local");
    }
    
    console.log("API Key found, starting with:", apiKey.substring(0, 5) + "...");
    const resend = new Resend(apiKey);

    console.log("Attempting to send email...");
    const { data, error } = await resend.emails.send({
      from: 'Test Email <onboarding@resend.dev>',
      to: ['info@alnahdafactory.com'], // تأكد من أن هذا الإيميل صحيح
      subject: 'رسالة اختبار ناجحة من موقعك!',
      html: '<h1>تهانينا!</h1><p>الاتصال بخدمة Resend يعمل بشكل صحيح من مشروعك.</p>',
    });

    if (error) {
      console.error("!!! Resend returned an error:", error);
      return NextResponse.json({ status: 'Error from Resend', error });
    }

    console.log("--- Test Successful! ---");
    return NextResponse.json({ status: 'Success', data });

  } catch (error) {
    console.error("!!! The test failed with an error:", error);
    return NextResponse.json({ status: 'Error in test file', error: (error as Error).message });
  }
}