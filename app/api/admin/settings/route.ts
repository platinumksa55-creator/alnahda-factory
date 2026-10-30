import { NextRequest, NextResponse } from 'next/server';
import { getAdminConfig, saveAdminConfig, verifyAdminCredentials, updateAdminPassword, isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const config = getAdminConfig();
    return NextResponse.json({
      success: true,
      settings: {
        username: config.username,
        siteName: config.siteName,
        contactPhone: config.contactPhone,
        contactEmail: config.contactEmail,
        contactAddress: config.contactAddress,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'change_password') {
      const { oldPassword, newPassword } = body;
      const config = getAdminConfig();

      if (!verifyAdminCredentials(config.username, oldPassword)) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' }, { status: 400 });
      }

      const updated = updateAdminPassword(newPassword);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'فشل حفظ كلمة المرور الجديدة' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    }

    if (action === 'update_info') {
      const config = getAdminConfig();
      if (body.contactPhone) config.contactPhone = body.contactPhone;
      if (body.contactEmail) config.contactEmail = body.contactEmail;
      if (body.contactAddress) config.contactAddress = body.contactAddress;
      if (body.siteName) config.siteName = body.siteName;

      saveAdminConfig(config);
      return NextResponse.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
