import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

export default function RarToZip() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const originalSize = file
    ? (file.size / 1024 / 1024).toFixed(2)
    : null;

  const convert = async () => {
    if (!file) {
      setError("Vui lòng chọn một file RAR để chuyển đổi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/rar-to-zip/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Chuyển đổi thất bại, vui lòng thử lại.");
      }

      const data = await res.json();
      const url = `${API_URL}/rar-to-zip/download/${data.file_id}/`;

      setDownloadUrl(url);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // Cleanup tránh memory leak
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        window.URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto mt-20 bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Chuyển RAR sang ZIP
        </h1>

        <p className="text-gray-500 mb-8">
          Tải lên file .rar và tải về dưới dạng .zip tương thích mọi thiết bị.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-5 text-sm">
            {error}
          </div>
        )}

        {/* ===== BOX HOÀN THÀNH ===== */}
        {downloadUrl && (
          <div className="bg-green-50 border border-green-200 rounded p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-3">
              🎉 Chuyển đổi thành công!
            </h2>

            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = downloadUrl;
                a.download = file.name.replace(/\.rar$/i, ".zip");
                a.click();
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
            >
              Tải file ZIP
            </button>

            <button
              onClick={() => {
                window.URL.revokeObjectURL(downloadUrl);
                setDownloadUrl(null);
                setFile(null);
              }}
              className="text-sm text-gray-500 mt-4 hover:underline"
            >
              Chuyển file khác
            </button>
          </div>
        )}

        {/* ===== BOX UPLOAD ===== */}
        {!downloadUrl && (
          <>
            {!file && (
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept=".rar"
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold">
                  Chọn tệp RAR
                </div>
              </label>
            )}

            {file && (
              <>
                <div className="border rounded p-4 mb-6 text-left">
                  <p className="font-medium text-gray-700 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    Kích thước gốc: {originalSize} MB
                  </p>

                  <button
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 mt-2 hover:underline"
                  >
                    Chọn file khác
                  </button>
                </div>

                <button
                  onClick={convert}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold"
                >
                  {loading ? "Đang chuyển đổi..." : "Chuyển sang ZIP"}
                </button>
              </>
            )}
          </>
        )}

        <p className="text-xs text-gray-400 mt-6">
          File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
        </p>
      </main>

      <Footer />
    </div>
  );
}