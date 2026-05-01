import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeetCodeTracker, Patterns, InterviewRoadmap } from "./pages";
import { Navbar, SakuraBackground } from "./components";

const App = () => {
  return (
    <BrowserRouter>
      <SakuraBackground />
      <div className="relative z-10 min-h-screen transition-colors">
        <Navbar />
        <Routes>
          <Route path="/" element={<LeetCodeTracker />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/roadmap" element={<InterviewRoadmap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
