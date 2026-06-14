/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { RootLayout } from "./components/layout/RootLayout";
import { AnalyzeInput } from "./pages/AnalyzeInput";
import { Dashboard } from "./pages/Dashboard";
import { Architecture } from "./pages/Architecture";
import { Roadmap } from "./pages/Roadmap";
import { Recommendations } from "./pages/Recommendations";
import { Profile } from "./pages/Profile";
import { ShareViewer } from "./pages/ShareViewer";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/share/:reportId" element={<ShareViewer />} />
        
        {/* App Routes with Sidebar/Navbar */}
        <Route element={<RootLayout />}>
          <Route path="/analyze" element={<AnalyzeInput />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
