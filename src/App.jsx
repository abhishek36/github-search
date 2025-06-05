import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import UserDetail from "./UserDetail";
import ScrollToTop from "./ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:username" element={<UserDetail />} />
      </Routes>
    </>
  );
}
