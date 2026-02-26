import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL;

export default function Split() {
  const navigate = useNavigate();

  const [fileId, setFileId] = useState("");
  const [pagesText, setPagesText] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Validate & parse pages
  const { selectedPages, isValid } = useMemo(() => {
    if (!pagesText?.trim()) {
      return { selectedPages: [], isValid: false };
    }

    let valid = true;
    const pages = [];
    const parts = pagesText.split(",");

    for (let raw of parts) {
      const part = raw.trim();

      if (!part) {
        valid = false;
        continue;
      }

      // Range: 1-5
      if (part.includes("-")) {
        const pieces = part.split("-");

        if (pieces.length !== 2) {
          valid = false;
          continue;
        }

        const start = Number(pieces[0]);
        const end = Number(pieces[1]);

        if (
          Number.isInteger(start) &&
          Number.isInteger(end) &&
          start > 0 &&
          end > 0 &&
          start <= end
        ) {
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        } else {
          valid = false;
        }
      } else {
        const num = Number(part);

        if (Number.isInteger(num) && num > 0) {
          pages.push(num);
        } else {
          valid = false;
        }
      }
    }

    return {
      selectedPages: [...new Set(pages)].sort((a, b) => a - b),
      isValid: valid,
    };
  }, [pagesText]);

  // ✅ Upload file
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
    if (!fileId) {
      setError("Chưa có file PDF.");
      return;
    }

    if (!isValid || selectedPages.length === 0) {
      setError("Danh sách trang không hợp lệ.");
      return;
    }

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

      {!fileId && (
        <main className="max-w-xl mx-auto mt-20 bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Cắt PDF
          </h1>

          <p className="text-gray-500 mb-8 text-center">
            Chọn trang bạn muốn lấy và tạo file PDF mới.
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {loading && (
            <p className="text-center text-gray-500 mb-6">Đang xử lý...</p>
          )}

          {!loading && (
            <div className="text-center">
              <label className="block cursor-pointer mb-6">
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) uploadFile(selected);
                  }}
                />

                <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold">
                  Chọn file PDF để cắt
                </div>
              </label>

              <p className="text-xs text-gray-400 mt-6">
                File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
              </p>
            </div>
          )}
        </main>
      )}

      {fileId && !loading && (
        <main className="max-w-7xl mx-auto p-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PDF Preview */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <iframe
                src={`${API_URL}/split/pdf/${fileId}`}
                className="w-full h-[80vh]"
                title="Preview PDF"
              />
            </div>

            {/* Control Panel */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tải lên hoàn tất
              </h2>

              <label className="block font-semibold mb-2">
                Nhập trang cần lấy (VD: 1,3,5-7)
              </label>

              <input
                value={pagesText}
                onChange={(e) => {
                  setPagesText(e.target.value);
                  setError("");
                }}
                className={`w-full border rounded px-3 py-2 ${
                  !isValid ? "border-red-500" : ""
                }`}
              />

              {!isValid && (
                <p className="text-red-500 text-sm mt-2">
                  Định dạng trang không hợp lệ.
                </p>
              )}

              {selectedPages.length > 0 && isValid && (
                <p className="text-sm text-gray-500 mt-2">
                  Trang đã chọn:{" "}
                  <span className="font-medium">
                    {selectedPages.join(", ")}
                  </span>
                </p>
              )}

              <button
                onClick={processSplit}
                disabled={loading || !isValid || selectedPages.length === 0}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold"
              >
                {loading
                  ? "Đang xử lý..."
                  : `Cắt PDF (${selectedPages.length} trang)`}
              </button>

              <p className="text-xs text-gray-400 mt-6 text-center">
                File sẽ tự động bị xóa khỏi máy chủ sau 5 phút.
              </p>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}