import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const tools = [
  {
    title: "Nén PDF",
    desc: "Giảm kích thước tệp PDF",
    path: "/compress",
    color: "red",
  },
  {
    title: "Gộp PDF",
    desc: "Kết hợp nhiều tệp PDF",
    path: "/merge",
    color: "blue",
  },
  {
    title: "Cắt PDF",
    desc: "Cắt trang PDF",
    path: "/split",
    color: "green",
  },
  {
    title: "Xóa trang PDF",
    desc: "Xóa trang không mong muốn",
    path: "/delete-pages",
    color: "purple",
  },
  {
    title: "XML sang PDF",
    desc: "Chuyển đổi XML sang PDF",
    path: "/xml-to-pdf",
    color: "yellow",
  },
];

// ✅ Tailwind color class map
const colorMap = {
  red: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  yellow: "bg-yellow-100 text-yellow-600",
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 mt-16">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Tất cả các công cụ PDF bạn cần trong một nơi
        </h1>

        <p className="text-gray-500 text-center mb-12">
          Sử dụng các công cụ PDF miễn phí để nén, gộp, cắt và chuyển đổi PDF dễ dàng.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.title}
              onClick={() => navigate(tool.path)}
              className="bg-white rounded-lg border hover:shadow-md transition cursor-pointer p-6 text-center"
            >
              {/* ✅ Fixed Color */}
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center font-bold ${
                  colorMap[tool.color]
                }`}
              >
                PDF
              </div>

              <h2 className="font-semibold text-gray-800 mb-1">
                {tool.title}
              </h2>

              <p className="text-sm text-gray-500">{tool.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
