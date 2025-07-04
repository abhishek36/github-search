import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "./ScrollToTop";
import Spinner from "./Spinner";

// ✅ Lazy load components
const Home = lazy(() => import("./Home"));
const UserDetail = lazy(() => import("./UserDetail"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className=" flex justify-center items-center h-screen bg-black">
            <Spinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:username" element={<UserDetail />} />
        </Routes>
      </Suspense>
    </>
  );
}
