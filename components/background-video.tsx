// components/background-video.tsx

export function BackgroundVideo() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        // تأكد من أن اسم الفيديو هنا يطابق اسم ملفك
        src="/videos/fabric-transform.mp4"
      >
        <source src="/videos/fabric-transform.mp4" type="video/mp4" />
      </video>
      {/* هذا غطاء داكن فوق الفيديو لزيادة وضوح النص */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  );
}