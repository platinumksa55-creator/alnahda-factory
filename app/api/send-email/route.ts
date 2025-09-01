import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, phone, service, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,    // smtp.gmail.com
      port: Number(process.env.EMAIL_SERVER_PORT || 465),
      secure: true, // لأننا على 465
      auth: {
        user: process.env.EMAIL_SERVER_USER,  // alnahdafactory4@gmail.com
        pass: process.env.EMAIL_SERVER_PASSWORD, // App Password
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.EMAIL_TO, // info@alnahdafactory.com
      subject: `New message from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone}
Service: ${service}

Message:
${message}
      `,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "SMTP error" },
      { status: 500 }
    );
  }
}
