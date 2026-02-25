export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-50 border-t text-gray-500 text-xs z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        <div>
          © {new Date().getFullYear()} PDF Tools — 
          <span className="ml-1 font-medium text-gray-700">
            Thiết kế bởi Quang Trung
          </span>
        </div>

        <div className="flex gap-4">
          <button className="hover:text-gray-800 transition">
            Điều khoản
          </button>
          <button className="hover:text-gray-800 transition">
            Bảo mật
          </button>
          <button className="hover:text-gray-800 transition">
            Liên hệ
          </button>
        </div>

      </div>
    </footer>
  );
}