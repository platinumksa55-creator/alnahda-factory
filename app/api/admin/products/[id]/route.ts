import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductById, createOrUpdateProduct, deleteProduct } from '@/lib/products-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const product = getProductById(numId);

    if (!product) {
      return NextResponse.json({ success: false, error: 'الموديل غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const body = await req.json();

    const updated = createOrUpdateProduct({
      ...body,
      id: numId,
    });

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    const success = deleteProduct(numId);

    if (!success) {
      return NextResponse.json({ success: false, error: 'تعذر حذف الموديل أو الموديل غير موجود' }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'تم حذف الموديل بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
