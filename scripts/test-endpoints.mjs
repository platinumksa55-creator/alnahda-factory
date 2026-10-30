async function test() {
  console.log("=== 1. Testing Unauthenticated /admin Access ===");
  const res1 = await fetch("http://localhost:3001/admin", { redirect: "manual" });
  console.log("Status:", res1.status, "Location:", res1.headers.get("location"));

  console.log("\n=== 2. Testing Login ===");
  const loginRes = await fetch("http://localhost:3001/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "admin123" }),
  });
  console.log("Login Status:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("Login Response:", loginData);

  const setCookie = loginRes.headers.get("set-cookie");
  console.log("Cookie received:", !!setCookie);

  console.log("\n=== 3. Testing Analytics Stats with Session Cookie ===");
  const statsRes = await fetch("http://localhost:3001/api/analytics/stats", {
    headers: { Cookie: setCookie || "" },
  });
  const statsData = await statsRes.json();
  console.log("Stats Success:", statsData.success, "Total Visits:", statsData.data?.totalVisits);

  console.log("\n=== 4. Testing Visitor Tracking on public /ar ===");
  const trackRes = await fetch("http://localhost:3001/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId: "test_visitor_007",
      path: "/ar/products",
      referrer: "https://google.com",
    }),
  });
  const trackData = await trackRes.json();
  console.log("Track Response:", trackData);

  console.log("\n=== 5. Testing Adding a New Model ===");
  const newProduct = {
    name: { ar: "قماش حرير ملكي مميز", en: "Royal Luxury Silk Fabric" },
    category: { ar: "أقمشة الحرير", en: "Silk Fabrics" },
    categoryId: "silk",
    description: { ar: "قماش حرير طبيعي فاخر بلمعان فائق", en: "Premium natural silk with superior luster" },
    longDescription: { ar: "نسيج حريري راقي بأعلى معايير الجودة للاستخدام في الأزياء الراقية والفساتين الفاخرة.", en: "Refined silk woven with highest standards." },
    availability: { ar: "متوفر", en: "Available" },
    price: "حسب الكمية",
    featured: true,
    images: ["/images/luxury-cotton-fabric.png"],
    features: {
      ar: ["حرير طبيعي 100%", "ملمس ناعم جداً", "ألوان زاهية وثابتة"],
      en: ["100% Pure Silk", "Ultra Smooth", "Vibrant Colors"]
    },
    specifications: {
      ar: { "المادة": "100% حرير طبيعي", "العرض": "140 سم" },
      en: { "Material": "100% Silk", "Width": "140 cm" }
    }
  };

  const addRes = await fetch("http://localhost:3001/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: setCookie || "",
    },
    body: JSON.stringify(newProduct),
  });
  const addData = await addRes.json();
  console.log("Add Product Status:", addRes.status, "Slug:", addData.product?.slug);

  console.log("\n=== 6. Testing Public Products Page with New Product ===");
  const pubRes = await fetch(`http://localhost:3001/ar/products/${addData.product?.slug}`);
  console.log("Public New Product Page Status:", pubRes.status);

  console.log("\n=== All Tests Finished Successfully! ===");
}

test().catch(console.error);
