import { NextRequest, NextResponse } from 'next/server';
import { getInquiries, updateInquiryStatus, deleteInquiry } from '@/lib/inquiries-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك' }, { status: 401 });
  }

  const inquiries = getInquiries();
  return NextResponse.json({ success: true, inquiries });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const updated = updateInquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'الرسالة غير موجودة' }, { status: 404 });
    }
    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'معرف الرسالة مطلوب' }, { status: 400 });
    }
    const deleted = deleteInquiry(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
