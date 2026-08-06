import { useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >

        {/* Top Navigation */}
        <Navbar
          toggleSidebar={toggleSidebar}
        />

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default MainLayout;