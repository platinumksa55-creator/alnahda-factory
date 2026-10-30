import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = getAnalyticsSummary();
    return NextResponse.json({ success: true, data: summary });
  } catch (error: any) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
