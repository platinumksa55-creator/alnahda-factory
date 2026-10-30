import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { addInquiry } from "@/lib/inquiries-store";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, company, phone, service, message } = data;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // Save inquiry to dashboard store immediately so it's never lost
    const savedInquiry = await addInquiry({ name, email, company, phone, service, message });

    try {
      if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST, // smtp.gmail.com
          port: Number(process.env.EMAIL_SERVER_PORT || 465),
          secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Website Contact" <${process.env.EMAIL_SERVER_USER}>`,
          to: process.env.EMAIL_TO,
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
      }
    } catch (smtpError) {
      console.warn("SMTP send warning (inquiry saved locally):", smtpError);
    }

    return NextResponse.json({ ok: true, inquiry: savedInquiry });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error processing inquiry" },
      { status: 500 }
    );
  }
}
