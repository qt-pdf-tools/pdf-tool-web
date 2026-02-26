import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

export default function Merge() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Thêm file (không overwrite)
  const handleAddFiles = (newFiles) => {
    if (!newFiles?.length) return;

    const pdfFiles = Array.from(newFiles).filter(
      (f) => f.type === "application/pdf"
    );

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  // ✅ Xoá file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Di chuyển lên
  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index - 1],
    ];
    setFiles(newFiles);
  };

  // ✅ Di chuyển xuống
  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [
      newFiles[index],
      newFiles[index + 1],
    ];
    setFiles(newFiles);
  };

  // ✅ Merge API
  const merge = async () => {
    if (files.length < 2) {
      setError("Vui lòng chọn ít nhất 2 file PDF để gộp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch(`${API_URL}/merge/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Gộp PDF thất bại.");

      const data = await res.json();
      navigate(`/preview/merge/${data.file_id}`);
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
          Gộp PDF
        </h1>

        <p className="text-gray-500 mb-8">
          Kết hợp nhiều file PDF thành một file duy nhất.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-5 text-sm">
            {error}
          </div>
        )}

        {/* Upload */}
        <label className="block cursor-pointer mb-6">
          <input
            type="file"
            accept="application/pdf"
            multiple
            hidden
            onChange={(e) => handleAddFiles(e.target.files)}
          />

          <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold">
            {files.length === 0
              ? "Chọn các file PDF"
              : "Chọn thêm file"}
          </div>
        </label>

        {/* File list */}
        {files.length > 0 && (
          <div className="border rounded p-4 mb-6 text-left text-sm">
            <p className="font-semibold mb-3">
              Thứ tự gộp (từ trên xuống dưới):
            </p>

            <ul className="space-y-2">
              {files.map((f, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="truncate flex-1 mr-2">
                    {index + 1}. {f.name}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>

                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === files.length - 1}
                      className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>

                    <button
                      onClick={() => removeFile(index)}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Merge button */}
        <button
          onClick={merge}
          disabled={loading || files.length < 2}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold"
        >
          {loading
            ? "Đang gộp..."
            : `Gộp PDF (${files.length} file)`}
        </button>

        <p className="text-xs text-gray-400 mt-6">
          File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
        </p>
      </main>

      <Footer />
    </div>
  );
}