import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary, resetAnalytics } from '@/lib/analytics-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await resetAnalytics();
    return NextResponse.json({ success: true, data: await getAnalyticsSummary() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
