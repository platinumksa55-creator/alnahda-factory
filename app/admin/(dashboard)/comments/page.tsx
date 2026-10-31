import { getComments } from "@/lib/comments-store";
import { CommentsManager } from "@/components/admin/comments-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة التعليقات والتقييمات | لوحة التحكم",
};

export default async function AdminCommentsPage() {
  const comments = await getComments();

  return <CommentsManager initialComments={comments} />;
}
