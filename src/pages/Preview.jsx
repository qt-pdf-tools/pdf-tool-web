import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

// Tool name mapping
const toolTitles = {
  compress: "Nén PDF",
  merge: "Gộp PDF",
  split: "Cắt PDF",
  "delete-pages": "Xóa trang PDF",
  "xml-to-pdf": "XML → PDF",
};

export default function Preview() {
  const { tool, fileId } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

 const [fileSize, setFileSize] = useState("");
 
 useEffect(() => {
   if (!tool || !fileId) {
     navigate("/");
    }
  }, [tool, fileId, navigate]);
  
  if (!tool || !fileId) return null;
  
  const previewSrc = `${API_URL}/${tool}/preview/${fileId}`;
  const downloadSrc = `${API_URL}/${tool}/download/${fileId}`;
  
  useEffect(() => {
    const fetchFileSize = async () => {
      try {
        const res = await fetch(downloadSrc, {
          method: "GET",
        });
        console.log("res:", res);
  
        const size = res.headers.get("content-length");


        console.log("File size in bytes:", size);
  
        if (size) {
          const mb = (size / 1024 / 1024).toFixed(2);
          setFileSize(`${mb} MB`);
        }
      } catch (err) {
        console.log("Không lấy được dung lượng file");
      }
    };
  
    fetchFileSize();
  }, [downloadSrc]);

  const expireMinutes = 5;

  const title = toolTitles[tool] || "PDF Tool";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            {/* Loading */}
            {loading && (
              <div className="p-6 text-gray-500 text-center">
                Đang tải preview...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-6 text-red-600 text-center">
                {error}
              </div>
            )}

            {/* PDF iframe */}
            {!error && (
              <iframe
                src={previewSrc}
                title="PDF Preview"
                className="w-full h-[80vh]"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError("File không tồn tại hoặc đã hết hạn.");
                }}
              />
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {title} hoàn tất ✅
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Dung lượng file:</span>{" "}
                <span className="break-all">{fileSize}</span>
              </p>

              <p className="text-red-600">
                ⏳ File sẽ bị xoá sau {expireMinutes} phút
              </p>
            </div>

            {/* Download */}
            <a
              href={downloadSrc}
              target="_blank"
              rel="noreferrer"
              className="mt-6 text-center bg-red-600 hover:bg-red-700 transition text-white py-3 rounded font-semibold"
            >
              Tải xuống PDF
            </a>

            {/* Back */}
            <button
              onClick={() => navigate(`/${tool}`)}
              className="mt-3 border border-gray-300 hover:border-red-600 hover:text-red-600 transition py-3 rounded font-medium text-gray-600"
            >
              Làm file khác
            </button>

            {/* Home */}
            <button
              onClick={() => navigate("/")}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              ← Quay về trang chủ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
