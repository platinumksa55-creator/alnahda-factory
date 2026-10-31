import { ProductComment } from './types';
import { readStoreFile, writeStoreFile } from './storage';

const COMMENTS_FILE = 'comments.json';

const initialSampleComments: ProductComment[] = [
  {
    id: "comm_1",
    productId: 1,
    productSlug: "luxury-white-cotton",
    productName: "قماش قطن أبيض فاخر",
    authorName: "أحمد السعيد",
    authorEmail: "ahmed.saeed@example.com",
    content: "جودة القماش ممتازة جداً ونعومته فائقة، تعاملت مع المصنع لتوريد كمية للمشروع وكانت النتيجة رائعة وسرعة في التسليم.",
    rating: 5,
    status: "approved",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reply: {
      content: "أهلاً بك يا أستاذ أحمد، نسعد دائماً بخدمتك وشهادتك وسام فخر لمصنع النهضة. في انتظار تعاون قادم دائماً!",
      repliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      repliedBy: "إدارة المصنع"
    }
  },
  {
    id: "comm_2",
    productId: 10,
    productSlug: "flamingo-tropical-beach-towel",
    productName: "منشفة شاطئ قطيفة بنقشة الفلامنجو الاستوائية",
    authorName: "سارة محمود",
    authorEmail: "sarah.m@example.com",
    content: "خامة الفوطة تحفة وثقيلة جداً وألوان الفلامنجو ثابتة وممتازة بعد الغسيل.",
    rating: 5,
    status: "approved",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "comm_3",
    productId: 40,
    productSlug: "hexagon-jacquard-border-7-color-hotel-towel-collection",
    productName: "مجموعة مناشف فندقية سادة بكنار جاكار سداسي (7 ألوان)",
    authorName: "مؤسسة الأفق الفندقية",
    authorEmail: "procurement@alofuq-hotels.com",
    content: "استلمنا العينات الخاصة بالمجموعة الفندقية، التطريز السداسي وخيوط القطن مشط فائق النعومة. نود طلب عرض سعر لكمية 1000 طقم.",
    rating: 5,
    status: "pending",
    createdAt: new Date().toISOString(),
  }
];

export async function getComments(): Promise<ProductComment[]> {
  return await readStoreFile<ProductComment[]>(COMMENTS_FILE, initialSampleComments);
}

export async function getApprovedProductComments(productIdOrSlug: number | string): Promise<ProductComment[]> {
  const comments = await getComments();
  return comments.filter(
    (c) =>
      c.status === "approved" &&
      (c.productId === productIdOrSlug || c.productSlug === productIdOrSlug)
  );
}

export async function addComment(comment: Omit<ProductComment, 'id' | 'createdAt' | 'status'>): Promise<ProductComment> {
  const comments = await getComments();
  const newComment: ProductComment = {
    ...comment,
    id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    status: "approved", // Allow instant appearance with admin moderation capability
    createdAt: new Date().toISOString(),
  };
  comments.unshift(newComment);
  await writeStoreFile(COMMENTS_FILE, comments);
  return newComment;
}

export async function replyToComment(id: string, replyContent: string, repliedBy = "إدارة المصنع"): Promise<boolean> {
  const comments = await getComments();
  const item = comments.find((c) => c.id === id);
  if (!item) return false;
  item.reply = {
    content: replyContent,
    repliedAt: new Date().toISOString(),
    repliedBy,
  };
  return await writeStoreFile(COMMENTS_FILE, comments);
}

export async function updateCommentStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<boolean> {
  const comments = await getComments();
  const item = comments.find((c) => c.id === id);
  if (!item) return false;
  item.status = status;
  return await writeStoreFile(COMMENTS_FILE, comments);
}

export async function deleteComment(id: string): Promise<boolean> {
  const comments = await getComments();
  const filtered = comments.filter((c) => c.id !== id);
  return await writeStoreFile(COMMENTS_FILE, filtered);
}
