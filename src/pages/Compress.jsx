import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

export default function Compress() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [level, setLevel] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const originalSize = file
    ? (file.size / 1024 / 1024).toFixed(2)
    : null;

  const compress = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("level", level);

      // ✅ đúng endpoint backend
      const res = await fetch(`${API_URL}/compress/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Nén PDF thất bại, vui lòng thử lại.");
      }

      const data = await res.json();

      // ✅ backend trả preview_url thì dùng luôn
      navigate(`/preview/compress/${data.file_id}`);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-xl mx-auto mt-20 bg-white rounded-lg shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Nén PDF
        </h1>

        <p className="text-gray-500 mb-8">
          Giảm kích thước tệp PDF của bạn nhanh chóng và dễ dàng.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Upload */}
        {!file && (
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold">
              Chọn tệp PDF để nén
            </div>
          </label>
        )}

        {/* File selected */}
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

            {/* Compression level */}
            <div className="mb-6">
              <p className="text-left text-sm font-semibold text-gray-700 mb-2">
                Mức độ nén
              </p>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "low", label: "Thấp" },
                  { value: "medium", label: "Cơ bản" },
                  { value: "high", label: "Mạnh" },
                ].map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`border rounded py-2 text-sm font-medium transition
                      ${
                        level === l.value
                          ? "border-red-600 text-red-600 bg-red-50"
                          : "border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Compress button */}
            <button
              onClick={compress}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold"
            >
              {loading ? "Đang nén..." : "Nén PDF"}
            </button>
          </>
        )}

        <p className="text-xs text-gray-400 mt-6">
          File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
        </p>
      </main>
    </div>
  );
}
