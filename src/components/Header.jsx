import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-red-600 text-xl">
          <button onClick={() => navigate("/")}>
            PDF Tools
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 text-sm font-medium text-gray-600">
          <button
            onClick={() => navigate("/compress")}
            className="hover:text-red-600 transition"
          >
            Nén PDF
          </button>
          <button
            onClick={() => navigate("/merge")}
            className="hover:text-red-600 transition"
          >
            Gộp PDF
          </button>
          <button
            onClick={() => navigate("/split")}
            className="hover:text-red-600 transition"
          >
            Cắt PDF
          </button>
        </nav>
      </div>
    </header>
  );
}
