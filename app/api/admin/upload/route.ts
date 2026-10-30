import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك برفع الملفات' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'لم يتم اختيار أي ملف' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'نوع الملف غير مدعوم. يرجى رفع صورة (PNG, JPG, WEBP, SVG)' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'حجم الصورة كبير جداً، الحد الأقصى 10 ميجابايت' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const baseName = path
      .basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `uploads/${Date.now()}-${baseName || 'model'}${ext}`;

    // Upload to Vercel Blob if configured
    if (process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(uniqueFileName, buffer, {
          access: 'private',
          contentType: file.type,
          addRandomSuffix: false,
        });
        return NextResponse.json({
          success: true,
          url: `/api/blob/view?pathname=${encodeURIComponent(blob.pathname)}`,
          fileName: blob.pathname,
        });
      } catch (blobError) {
        console.warn('Vercel Blob upload fallback:', blobError);
      }
    }

    // Local filesystem fallback when running locally without Blob
    const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (!isVercel) {
      try {
        const localFileName = path.basename(uniqueFileName);
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadsDir, localFileName), buffer);
        return NextResponse.json({
          success: true,
          url: `/uploads/${localFileName}`,
          fileName: localFileName,
        });
      } catch {
        // fallback to data url
      }
    }

    const base64DataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: base64DataUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
