import { NextRequest, NextResponse } from "next/server";
import { getApprovedProductComments, addComment } from "@/lib/comments-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    const identifier = slug || (id ? Number(id) : null);
    if (!identifier) {
      return NextResponse.json({ success: false, error: "معرف المنتج مطلوب" }, { status: 400 });
    }

    const comments = await getApprovedProductComments(identifier);
    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productSlug, productName, authorName, authorEmail, content, rating } = body;

    if (!productId || !authorName || !content) {
      return NextResponse.json({ success: false, error: "يرجى ملء جميع الحقول المطلوبة" }, { status: 400 });
    }

    const newComment = await addComment({
      productId: Number(productId),
      productSlug: productSlug || "",
      productName: productName || "",
      authorName: authorName.trim(),
      authorEmail: (authorEmail || "").trim(),
      content: content.trim(),
      rating: Number(rating) || 5,
    });

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
