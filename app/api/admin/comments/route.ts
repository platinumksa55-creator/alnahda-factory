import { NextRequest, NextResponse } from "next/server";
import { getComments, addComment, updateCommentStatus, deleteComment, replyToComment } from "@/lib/comments-store";
import { isAuthenticated } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const comments = await getComments();
    return NextResponse.json({ success: true, comments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, replyContent, status } = body;

    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    if (action === "reply") {
      if (!id || !replyContent) {
        return NextResponse.json({ success: false, error: "بيانات ناقصة" }, { status: 400 });
      }
      const success = await replyToComment(id, replyContent);
      return NextResponse.json({ success });
    }

    if (action === "status") {
      if (!id || !status) {
        return NextResponse.json({ success: false, error: "بيانات ناقصة" }, { status: 400 });
      }
      const success = await updateCommentStatus(id, status);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "معرف التعليق مطلوب" }, { status: 400 });
    }

    const success = await deleteComment(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
