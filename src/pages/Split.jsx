import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

export default function Split() {
  const navigate = useNavigate();

  const [fileId, setFileId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const uploadFile = async (selectedFile) => {
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${API_URL}/split/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload thất bại.");

      const data = await res.json();

      setFileId(data.file_id);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  // ✅ Process Split
  const processSplit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/split/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_id: fileId,
          pages: selectedPages,
        }),
      });

      if (!res.ok) throw new Error("Cắt PDF thất bại.");

      const data = await res.json();

      navigate(`/preview/split/${data.file_id}`);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto mt-16 bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Cắt PDF
        </h1>

        <p className="text-gray-500 mb-8 text-center">
          Chọn trang bạn muốn lấy và tạo file PDF mới.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mb-6">
            Đang xử lý...
          </p>
        )}

        {/* Upload */}
        {!fileId && !loading && (
          <div className="text-center">
            <label className="block cursor-pointer mb-6">
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) => {
                  const selected = e.target.files[0];
                  if (selected) {
                    uploadFile(selected); // ✅ auto upload
                  }
                }}
              />

              <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold inline-block px-10">
                Chọn file PDF để cắt
              </div>
            </label>
          </div>
        )}

        
        {fileId && !loading && (
          <>
            <iframe
              src={`${API_URL}/split/pdf/${fileId}`}
              className="w-full h-[70vh] border rounded mb-6"
              title="Preview PDF"
            />

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Nhập trang cần lấy (VD: 1,3,5)
              </label>

              <input
                value={pagesText}
                onChange={(e) => setPagesText(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            {/* Action Button */}
            <button
              onClick={processSplit}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold"
            >
              {loading
                ? "Đang xử lý..."
                : `Cắt PDF (${selectedPages.length} trang)`}
            </button>
          </>
        )}

        <p className="text-xs text-gray-400 mt-6 text-center">
          File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
        </p>
      </main>
    </div>
  );
}
