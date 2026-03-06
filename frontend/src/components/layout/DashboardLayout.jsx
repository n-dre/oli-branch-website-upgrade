import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function DashboardLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const activePage = location.pathname.split("/")[1] || "dashboard";

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden sticky top-0 z-50 bg-surface border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-light text-text"
            aria-label="Toggle menu"
            type="button"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-text truncate">{title}</h1>
            {subtitle && <p className="text-sm text-text-muted truncate">{subtitle}</p>}
          </div>
        </div>
      </header>

      <div className="hidden lg:block sticky top-0 z-30">
        <Header title={title} subtitle={subtitle} />
      </div>

      <div className="flex">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        <aside
          className={`
            fixed lg:sticky lg:top-0 top-0 left-0 z-50
            h-screen flex-shrink-0
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            activePage={activePage}
          />
        </aside>

        <main className="flex-1 min-w-0 p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}