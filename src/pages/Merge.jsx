import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const API_URL = import.meta.env.VITE_API_URL;

export default function Merge() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

        {/* Upload multiple */}
        {!files.length && (
          <label className="block cursor-pointer mb-6">
            <input
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />

            <div className="bg-red-600 hover:bg-red-700 transition text-white py-4 rounded text-lg font-semibold">
              Chọn các file PDF để gộp
            </div>
          </label>
        )}

        {/* File list */}
        {files.length > 0 && (
           <>
            <div className="border rounded p-4 mb-6 text-left text-sm">
            <p className="font-semibold mb-2">
              Đã chọn {files.length} file:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="truncate">
                  {f.name}
                </li>
              ))}
            </ul>
             {/* Merge button */}
          </div>
            <button
              onClick={merge}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded text-lg font-semibold radius-lg"
            >
              {loading ? "Đang gộp..." : "Gộp PDF"}
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
