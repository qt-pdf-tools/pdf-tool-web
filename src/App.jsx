import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compress from "./pages/Compress";
import Preview from "./pages/Preview";
import Merge from "./pages/Merge";
import Split from "./pages/Split";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/compress" element={<Compress />} />
      <Route path="/preview/:tool/:fileId" element={<Preview />} />
      <Route path="/merge" element={<Merge />} />
      <Route path="/split" element={<Split />} />
    </Routes>
  );
}
