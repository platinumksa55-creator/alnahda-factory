"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Star,
  Upload,
  X,
  Check,
  AlertCircle,
  ImageIcon,
  Sparkles,
  Layers,
  Filter,
  FileSpreadsheet,
  Download,
  Link2,
  ClipboardPaste,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProductItem } from "@/lib/types";

interface ProductsManagerProps {
  initialProducts: ProductItem[];
  editIdFromUrl?: number;
}

const CATEGORY_OPTIONS = [
  { id: "cotton", ar: "أقمشة القطن", en: "Cotton Fabrics" },
  { id: "linen", ar: "منسوجات الكتان", en: "Linen Textiles" },
  { id: "silk", ar: "أقمشة الحرير", en: "Silk Fabrics" },
  { id: "blended", ar: "منسوجات مخلوطة", en: "Blended Textiles" },
  { id: "home-decor", ar: "أقمشة الديكور", en: "Decor Fabrics" },
  { id: "industrial", ar: "منسوجات صناعية", en: "Industrial Textiles" },
];

export function ProductsManager({ initialProducts, editIdFromUrl }: ProductsManagerProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!editIdFromUrl);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(() => {
    if (editIdFromUrl) {
      return initialProducts.find((p) => p.id === editIdFromUrl) || null;
    }
    return null;
  });

  // Form states
  const [nameAr, setNameAr] = useState(editingProduct?.name?.ar || "");
  const [nameEn, setNameEn] = useState(editingProduct?.name?.en || "");
  const [categoryAr, setCategoryAr] = useState(editingProduct?.category?.ar || "أقمشة القطن");
  const [categoryEn, setCategoryEn] = useState(editingProduct?.category?.en || "Cotton Fabrics");
  const [categoryId, setCategoryId] = useState(editingProduct?.categoryId || "cotton");
  const [descriptionAr, setDescriptionAr] = useState(editingProduct?.description?.ar || "");
  const [descriptionEn, setDescriptionEn] = useState(editingProduct?.description?.en || "");
  const [longDescriptionAr, setLongDescriptionAr] = useState(editingProduct?.longDescription?.ar || "");
  const [longDescriptionEn, setLongDescriptionEn] = useState(editingProduct?.longDescription?.en || "");
  const [availabilityAr, setAvailabilityAr] = useState(editingProduct?.availability?.ar || "متوفر");
  const [price, setPrice] = useState(editingProduct?.price || "");
  const [featured, setFeatured] = useState<boolean>(editingProduct?.featured || false);
  const [images, setImages] = useState<string[]>(editingProduct?.images || []);

  // Features list
  const [featuresAr, setFeaturesAr] = useState<string[]>(editingProduct?.features?.ar || []);
  const [newFeatureAr, setNewFeatureAr] = useState("");

  // Specifications
  const [specsAr, setSpecsAr] = useState<Record<string, string>>(editingProduct?.specifications?.ar || {});
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  // Uploading state
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Import State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkTab, setBulkTab] = useState<"excel" | "gsheet" | "paste">("excel");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [previewItems, setPreviewItems] = useState<Partial<ProductItem>[]>([]);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  const resetBulkModal = () => {
    setPreviewItems([]);
    setGoogleSheetUrl("");
    setPastedText("");
    setBulkLoading(false);
  };

  const handleExcelFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/bulk?preview=true", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "تعذر قراءة ملف الإكسل");
      } else {
        setPreviewItems(data.preview || []);
        toast.success(`تم استخراج ${data.count} موديل من الملف للمعاينة`);
      }
    } catch {
      toast.error("حدث خطأ أثناء قراءة الملف");
    } finally {
      setBulkLoading(false);
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
    }
  };

  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl.trim()) {
      toast.error("يرجى وضع رابط Google Sheet أولاً");
      return;
    }

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk?preview=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleSheetUrl: googleSheetUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "تعذر جلب البيانات من Google Sheet");
      } else {
        setPreviewItems(data.preview || []);
        toast.success(`تم جلب ${data.count} موديل من جوجل شيت بنجاح!`);
      }
    } catch {
      toast.error("فشل الاتصال بجوجل شيت");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleParsePastedData = () => {
    if (!pastedText.trim()) {
      toast.error("يرجى لصق البيانات أولاً");
      return;
    }

    const lines = pastedText
      .trim()
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    // Detect if first row is header
    const firstCols = lines[0].split("\t");
    const isHeader =
      firstCols[0]?.includes("اسم") ||
      firstCols[0]?.toLowerCase().includes("name") ||
      firstCols[1]?.includes("وصف") ||
      firstCols[1]?.toLowerCase().includes("desc");

    const dataLines = isHeader ? lines.slice(1) : lines;
    const parsed: Partial<ProductItem>[] = [];

    for (const line of dataLines) {
      const cols = line.split("\t").map((c) => c.trim());
      const nameAr = cols[0];
      if (!nameAr) continue;

      const descAr = cols[1] || "";
      const longDescAr = cols[2] || descAr;
      const catAr = cols[3] || "أقمشة القطن";
      const priceVal = cols[4] || "حسب الكمية والمواصفات";

      const matchedCat =
        CATEGORY_OPTIONS.find((c) => catAr.includes(c.ar) || c.ar.includes(catAr)) ||
        CATEGORY_OPTIONS[0];

      parsed.push({
        name: { ar: nameAr, en: nameAr },
        description: { ar: descAr, en: descAr },
        longDescription: { ar: longDescAr, en: longDescAr },
        category: { ar: matchedCat.ar, en: matchedCat.en },
        categoryId: matchedCat.id,
        availability: { ar: "متوفر", en: "Available" },
        price: priceVal,
        featured: false,
        images: ["/images/luxury-cotton-fabric.png"],
      });
    }

    if (parsed.length === 0) {
      toast.error("لم يتم التعرف على أي صفوف صالحة. انسخ الأعمدة مباشرة من Excel أو Google Sheets.");
      return;
    }

    setPreviewItems(parsed);
    toast.success(`تم تجهيز ${parsed.length} موديل للمعاينة!`);
  };

  const handleConfirmBulkSave = async () => {
    if (previewItems.length === 0) return;

    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: previewItems }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "حدث خطأ أثناء حفظ المنتجات");
        return;
      }

      setProducts(data.products);
      toast.success(
        `تمت العملية بنجاح! (إضافة ${data.addedCount} موديل جديد، وتحديث ${data.updatedCount} موديل)`
      );
      setIsBulkModalOpen(false);
      resetBulkModal();
    } catch {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setBulkLoading(false);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNameAr("");
    setNameEn("");
    setCategoryAr("أقمشة القطن");
    setCategoryEn("Cotton Fabrics");
    setCategoryId("cotton");
    setDescriptionAr("");
    setDescriptionEn("");
    setLongDescriptionAr("");
    setLongDescriptionEn("");
    setAvailabilityAr("متوفر");
    setPrice("");
    setFeatured(false);
    setImages([]);
    setFeaturesAr([]);
    setSpecsAr({});
    setNewFeatureAr("");
    setSpecKey("");
    setSpecValue("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductItem) => {
    setEditingProduct(product);
    setNameAr(product.name?.ar || "");
    setNameEn(product.name?.en || "");
    setCategoryAr(product.category?.ar || "أقمشة القطن");
    setCategoryEn(product.category?.en || "Cotton Fabrics");
    setCategoryId(product.categoryId || "cotton");
    setDescriptionAr(product.description?.ar || "");
    setDescriptionEn(product.description?.en || "");
    setLongDescriptionAr(product.longDescription?.ar || "");
    setLongDescriptionEn(product.longDescription?.en || "");
    setAvailabilityAr(product.availability?.ar || "متوفر");
    setPrice(product.price || "");
    setFeatured(!!product.featured);
    setImages(product.images || []);
    setFeaturesAr(product.features?.ar || []);
    setSpecsAr(product.specifications?.ar || {});
    setIsModalOpen(true);
  };

  const handleCategorySelect = (catId: string) => {
    const found = CATEGORY_OPTIONS.find((c) => c.id === catId);
    if (found) {
      setCategoryId(found.id);
      setCategoryAr(found.ar);
      setCategoryEn(found.en);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImages((prev) => [...prev, data.url]);
          toast.success(`تم رفع الصورة ${file.name} بنجاح`);
        } else {
          toast.error(data.error || "فشل رفع الصورة");
        }
      }
    } catch (err: any) {
      toast.error("حدث خطأ أثناء رفع الصورة");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const addFeature = () => {
    if (!newFeatureAr.trim()) return;
    setFeaturesAr((prev) => [...prev, newFeatureAr.trim()]);
    setNewFeatureAr("");
  };

  const removeFeature = (idx: number) => {
    setFeaturesAr((prev) => prev.filter((_, i) => i !== idx));
  };

  const addSpec = () => {
    if (!specKey.trim() || !specValue.trim()) return;
    setSpecsAr((prev) => ({ ...prev, [specKey.trim()]: specValue.trim() }));
    setSpecKey("");
    setSpecValue("");
  };

  const removeSpec = (key: string) => {
    setSpecsAr((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameAr.trim()) {
      toast.error("يرجى إدخال اسم الموديل باللغة العربية");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<ProductItem> = {
        name: {
          ar: nameAr.trim(),
          en: nameEn.trim() || nameAr.trim(),
        },
        category: {
          ar: categoryAr,
          en: categoryEn,
        },
        categoryId,
        description: {
          ar: descriptionAr.trim(),
          en: descriptionEn.trim() || descriptionAr.trim(),
        },
        longDescription: {
          ar: longDescriptionAr.trim() || descriptionAr.trim(),
          en: longDescriptionEn.trim() || descriptionEn.trim() || descriptionAr.trim(),
        },
        availability: {
          ar: availabilityAr,
          en: availabilityAr === "متوفر" ? "Available" : "On Demand",
        },
        price: price.trim(),
        featured,
        images: images.length > 0 ? images : ["/images/luxury-cotton-fabric.png"],
        features: {
          ar: featuresAr,
          en: featuresAr, // default fallback
        },
        specifications: {
          ar: specsAr,
          en: specsAr,
        },
        applications: editingProduct?.applications || {
          ar: ["الاستخدام المنزلي والملابس", "الفنادق والمنتجعات"],
          en: ["Home & Apparel", "Hotels & Resorts"],
        },
      };

      let url = "/api/admin/products";
      let method = "POST";

      if (editingProduct) {
        url = `/api/admin/products/${editingProduct.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "حدث خطأ أثناء حفظ الموديل");
        setSaving(false);
        return;
      }

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
        toast.success("تم تحديث الموديل بنجاح!");
      } else {
        setProducts((prev) => [data.product, ...prev]);
        toast.success("تمت إضافة الموديل الجديد بنجاح!");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error("فشل الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (product: ProductItem) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف موديل "${product.name.ar}"؟ سيتم حذفه نهائياً من الموقع.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success("تم حذف الموديل بنجاح");
      } else {
        toast.error(data.error || "فشل حذف الموديل");
      }
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleToggleFeatured = async (product: ProductItem) => {
    try {
      const updatedStatus = !product.featured;
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: updatedStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, featured: updatedStatus } : p))
        );
        toast.success(
          updatedStatus
            ? "تم تمييز الموديل ليظهر في الصفحة الرئيسية"
            : "تمت إزالة الموديل من المنتجات المميزة"
        );
      }
    } catch {
      toast.error("فشل تعديل حالة التمييز");
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.ar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || product.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إدارة موديلات المصنع</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            إضافة موديلات جديدة فردياً أو بالجملة عبر الإكسل و Google Sheets، وتحديث التعريف والصور
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 text-xs sm:text-sm border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <a href="/api/admin/products/export" download>
              <Download className="w-4 h-4 text-slate-500" />
              <span>تصدير الكتالوج (Excel)</span>
            </a>
          </Button>

          <Button
            onClick={() => {
              resetBulkModal();
              setIsBulkModalOpen(true);
            }}
            variant="outline"
            className="h-10 border-emerald-600/40 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 font-semibold text-xs sm:text-sm flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>استيراد جماعي (Excel / Google Sheet)</span>
          </Button>

          <Button
            onClick={openAddModal}
            className="h-10 bg-primary hover:bg-primary/95 text-white font-semibold shadow-md flex items-center gap-2 text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة موديل جديد</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="بحث عن موديل بالاسم أو الفئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 bg-slate-50 border-slate-200 focus:bg-white text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            className="text-xs h-9 shrink-0"
          >
            الكل ({products.length})
          </Button>
          {CATEGORY_OPTIONS.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="text-xs h-9 shrink-0"
              >
                {cat.ar} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      {/* Products Grid / Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">لم يتم العثور على موديلات</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            لا توجد موديلات تطابق بحثك حالياً. يمكنك تغيير شروط البحث أو الضغط على "إضافة موديل جديد".
          </p>
          <Button onClick={openAddModal} size="sm" className="bg-primary text-white text-xs mt-2">
            إضافة موديل الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <Image
                    src={product.images[0] || "/images/luxury-cotton-fabric.png"}
                    alt={product.name.ar}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Badge className="bg-white/95 text-slate-800 backdrop-blur-xs font-semibold text-xs border border-white/40">
                      {product.category.ar}
                    </Badge>
                  </div>

                  <div className="absolute top-3 left-3">
                    <button
                      onClick={() => handleToggleFeatured(product)}
                      title={product.featured ? "إلغاء التمييز" : "تمييز في الصفحة الرئيسية"}
                      className={`p-1.5 rounded-full transition-all backdrop-blur-xs shadow-xs ${
                        product.featured
                          ? "bg-amber-400 text-slate-900"
                          : "bg-black/40 text-white hover:bg-black/60"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${product.featured ? "fill-slate-900" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs">
                    <span className="bg-emerald-600/90 backdrop-blur-xs px-2 py-0.5 rounded font-medium">
                      {product.availability.ar}
                    </span>
                    <span className="text-white/80 font-medium">{product.images.length} صور</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                      {product.name.ar}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
                    {product.description.ar || "لا يوجد وصف مختصر."}
                  </p>

                  {/* Specs Pill tags */}
                  {product.specifications?.ar && Object.keys(product.specifications.ar).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Object.entries(product.specifications.ar)
                        .slice(0, 2)
                        .map(([key, val]) => (
                          <span
                            key={key}
                            className="inline-block text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            {key}: {val}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 text-slate-700 hover:text-primary"
                >
                  <Link href={`/ar/products/${product.slug}`} target="_blank">
                    <Eye className="w-3.5 h-3.5 ml-1" />
                    <span>معاينة بالموقع</span>
                  </Link>
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => openEditModal(product)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  >
                    <Edit2 className="w-3.5 h-3.5 ml-1" />
                    <span>تعديل</span>
                  </Button>

                  <Button
                    onClick={() => handleDeleteProduct(product)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {editingProduct ? <Edit2 className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingProduct ? "تعديل الموديل" : "إضافة موديل جديد للموقع"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {editingProduct
                      ? `تعديل بيانات وتعريف موديل "${editingProduct.name.ar}"`
                      : "أدخل بيانات الموديل والتعريف والصور ليظهر في الموقع مباشرة"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nameAr" className="text-xs font-semibold text-slate-700">
                    اسم الموديل (بالعربي) *
                  </Label>
                  <Input
                    id="nameAr"
                    required
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder="مثال: قماش قطن أبيض فاخر"
                    className="text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="nameEn" className="text-xs font-semibold text-slate-700">
                    اسم الموديل (بالإنجليزي)
                  </Label>
                  <Input
                    id="nameEn"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Luxury White Cotton Fabric"
                    className="text-xs sm:text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">التصنيف *</Label>
                  <select
                    value={categoryId}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.ar}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">حالة التوفر</Label>
                  <select
                    value={availabilityAr}
                    onChange={(e) => setAvailabilityAr(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                  >
                    <option value="متوفر">متوفر</option>
                    <option value="حسب الطلب">حسب الطلب</option>
                    <option value="غير متوفر">غير متوفر</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="price" className="text-xs font-semibold text-slate-700">
                    السعر أو ملحوظة السعر
                  </Label>
                  <Input
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: حسب الكمية والمواصفات"
                    className="text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Featured Switch */}
              <div className="flex items-center gap-3 p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <Label htmlFor="featured" className="text-xs font-semibold text-slate-800 cursor-pointer flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>عرض هذا الموديل في قسم المنتجات المميزة بالصفحة الرئيسية</span>
                </Label>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <Label htmlFor="descAr" className="text-xs font-semibold text-slate-700">
                  الوصف والتعريف المختصر (يظهر في كارت المنتج بالصفحة الرئيسية والكتالوج)
                </Label>
                <Textarea
                  id="descAr"
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن القماش أو الموديل..."
                  className="text-xs sm:text-sm resize-none"
                />
              </div>

              {/* Long Description */}
              <div className="space-y-1.5">
                <Label htmlFor="longDescAr" className="text-xs font-semibold text-slate-700">
                  التعريف الكامل والتفصيلي للموديل (يظهر في صفحة تفاصيل المنتج)
                </Label>
                <Textarea
                  id="longDescAr"
                  rows={4}
                  value={longDescriptionAr}
                  onChange={(e) => setLongDescriptionAr(e.target.value)}
                  placeholder="اشرح بالتفصيل مميزات الخامة، طريقة الصباغة، الاستخدامات المناسبة، الجودة العالية..."
                  className="text-xs sm:text-sm"
                />
              </div>

              {/* Images Section */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-bold text-slate-800">صور الموديل</Label>
                    <p className="text-[11px] text-slate-500">
                      يمكنك رفع صور من جهازك أو وضع روابط صور. الصورة الأولى ستكون الصورة الرئيسية.
                    </p>
                  </div>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs gap-1.5 border-dashed border-primary/50 text-primary hover:bg-primary/5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "جاري الرفع..." : "رفع صورة من الجهاز"}</span>
                    </Button>
                  </div>
                </div>

                {/* Images Preview Grid */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                    {images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                      >
                        <Image
                          src={imgUrl}
                          alt={`صورة ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 right-1 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">
                            رئيسية
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute bottom-1 left-1 bg-red-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 hover:bg-red-700 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                    <span>لم يتم إضافة صور بعد. اضغط "رفع صورة من الجهاز" أعلاه لإضافة صور للموديل.</span>
                  </div>
                )}
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <Label className="text-xs font-bold text-slate-800">
                  المواصفات الفنية للموديل (مثل: الخامة، الوزن، العرض...)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="اسم الخاصية (مثال: المادة)"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="text-xs"
                  />
                  <Input
                    placeholder="القيمة (مثال: 100% قطن طبيعي)"
                    value={specValue}
                    onChange={(e) => setSpecValue(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    onClick={addSpec}
                    variant="secondary"
                    size="sm"
                    className="text-xs shrink-0"
                  >
                    إضافة
                  </Button>
                </div>

                {Object.keys(specsAr).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(specsAr).map(([key, val]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-xs"
                      >
                        <strong>{key}:</strong> {val}
                        <button
                          type="button"
                          onClick={() => removeSpec(key)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <Label className="text-xs font-bold text-slate-800">
                  المميزات الرئيسية (نقاط سريعة)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="مثال: نعومة فائقة، ألوان ثابتة، مقاوم للتجعد..."
                    value={newFeatureAr}
                    onChange={(e) => setNewFeatureAr(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="text-xs"
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    variant="secondary"
                    size="sm"
                    className="text-xs shrink-0"
                  >
                    إضافة ميزة
                  </Button>
                </div>

                {featuresAr.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {featuresAr.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-xs"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {feat}
                        <button
                          type="button"
                          onClick={() => removeFeature(idx)}
                          className="text-emerald-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  disabled={saving}
                  className="text-xs sm:text-sm"
                >
                  إلغاء
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs sm:text-sm min-w-[120px]"
                >
                  {saving ? "جاري الحفظ..." : editingProduct ? "حفظ التعديلات" : "إضافة الموديل للموقع"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal (Excel / Google Sheets / Paste) */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-950 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    إضافة وتحديث المنتجات دفعة واحدة (Excel / Google Sheets)
                  </h2>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    أضف عشرات الموديلات مع الوصف والتعريف والمواصفات في خطوة واحدة
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsBulkModalOpen(false);
                  resetBulkModal();
                }}
                className="p-2 text-emerald-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {/* Step 1: Download Template Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>خطوة اختيارية: تحميل قالب الإكسل الجاهز</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    يحتوي القالب على الأعمدة الجاهزة (اسم الموديل، الوصف المختصر، التعريف الكامل، التصنيف، السعر، المميزات، والمواصفات).
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 gap-1.5"
                >
                  <a href="/api/admin/products/export?template=true" download>
                    <Download className="w-3.5 h-3.5" />
                    <span>تحميل نموذج Excel فارغ</span>
                  </a>
                </Button>
              </div>

              {/* Tabs Selection */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBulkTab("excel")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    bulkTab === "excel"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>رفع ملف Excel / CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkTab("gsheet")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    bulkTab === "gsheet"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>رابط Google Sheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBulkTab("paste")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    bulkTab === "paste"
                      ? "bg-white text-emerald-800 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ClipboardPaste className="w-4 h-4" />
                  <span>نسخ ولصق مباشر</span>
                </button>
              </div>

              {/* Tab 1: Upload Excel File */}
              {bulkTab === "excel" && (
                <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 rounded-2xl p-8 text-center space-y-3">
                  <input
                    type="file"
                    ref={bulkFileInputRef}
                    onChange={handleExcelFileSelect}
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800">
                      اضغط لاختيار ملف Excel (.xlsx) أو CSV من جهازك
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      سيقوم النظام بقراءة جميع الصفوف (اسم الموديل، الدسكربشن المختصر والكامل، الفئة، والمواصفات) وعرضها لك للمراجعة قبل الحفظ.
                    </p>
                  </div>
                  <Button
                    type="button"
                    disabled={bulkLoading}
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold mt-2"
                  >
                    {bulkLoading ? "جاري قراءة الملف..." : "اختيار ملف الإكسل"}
                  </Button>
                </div>
              )}

              {/* Tab 2: Google Sheets Link */}
              {bulkTab === "gsheet" && (
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-800">
                      رابط ملف Google Sheets
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      تأكد من ضبط مشاركة الشيت في جوجل على <strong>"أي شخص لديه الرابط يمكنه العرض" (Anyone with the link)</strong> ثم الصق الرابط هنا:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <Input
                        dir="ltr"
                        placeholder="https://docs.google.com/spreadsheets/d/..."
                        value={googleSheetUrl}
                        onChange={(e) => setGoogleSheetUrl(e.target.value)}
                        className="bg-white text-xs sm:text-sm flex-1"
                      />
                      <Button
                        type="button"
                        disabled={bulkLoading}
                        onClick={handleFetchGoogleSheet}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shrink-0"
                      >
                        {bulkLoading ? "جاري الجلب..." : "سحب البيانات من الشيت"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Direct Copy & Paste from Excel/Sheets */}
              {bulkTab === "paste" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-800">
                      انسخ الخلايا من Excel أو Google Sheets والصقها هنا مباشرة:
                    </Label>
                    <span className="text-[11px] text-slate-500">
                      الترتيب: اسم الموديل | الوصف المختصر | التعريف الكامل | التصنيف | السعر
                    </span>
                  </div>
                  <Textarea
                    rows={5}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder={`قماش قطن فاخر\tقطن طبيعي 100% ناعم\tيتميز هذا الموديل بنعومته الفائقة...\tأقمشة القطن\tحسب الكمية\nمنسوجات كتان\tكتان طبيعي ممتاز للصيف\tمنسوجات كتان عالية الجودة...\tمنسوجات الكتان\tحسب الطلب`}
                    className="text-xs font-mono bg-slate-50"
                  />
                  <Button
                    type="button"
                    onClick={handleParsePastedData}
                    variant="secondary"
                    size="sm"
                    className="text-xs font-semibold"
                  >
                    تحليل النصوص المنسوخة ومعاينتها
                  </Button>
                </div>
              )}

              {/* Preview Table */}
              {previewItems.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>معاينة الموديلات الجاهزة للاستيراد ({previewItems.length} موديل)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setPreviewItems([])}
                      className="text-xs text-red-600 hover:underline"
                    >
                      مسح المعاينة
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 font-bold">#</th>
                          <th className="py-2.5 px-3 font-bold">اسم الموديل</th>
                          <th className="py-2.5 px-3 font-bold">التصنيف</th>
                          <th className="py-2.5 px-3 font-bold">الوصف المختصر (Description)</th>
                          <th className="py-2.5 px-3 font-bold">التعريف الكامل</th>
                          <th className="py-2.5 px-3 font-bold">السعر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-400 font-medium">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">
                              {item.name?.ar}
                            </td>
                            <td className="py-2 px-3">
                              <Badge variant="outline" className="text-[10px]">
                                {item.category?.ar}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-slate-600 max-w-[200px] truncate" title={item.description?.ar}>
                              {item.description?.ar || "—"}
                            </td>
                            <td className="py-2 px-3 text-slate-500 max-w-[200px] truncate" title={item.longDescription?.ar}>
                              {item.longDescription?.ar || "—"}
                            </td>
                            <td className="py-2 px-3 text-slate-700">{item.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-100 bg-slate-50">
              <p className="text-[11px] text-slate-500">
                ملاحظة: إذا كان اسم الموديل موجوداً مسبقاً سيتم تحديث الوصف والبيانات الخاصة به تلقائياً.
              </p>
              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsBulkModalOpen(false);
                    resetBulkModal();
                  }}
                  className="text-xs"
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  disabled={previewItems.length === 0 || bulkLoading}
                  onClick={handleConfirmBulkSave}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {bulkLoading
                      ? "جاري الحفظ..."
                      : `اعتماد وحفظ (${previewItems.length}) موديل في الموقع`}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
