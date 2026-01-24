import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* MOBILE HEADER - Show only on mobile/tablet */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
            aria-label="Toggle menu"
            type="button" // ✅ Explicitly set type="button"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-[#2E2E2E] truncate">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
      </header>

      {/* DESKTOP HEADER - Show only on desktop */}
      <div className="hidden lg:block sticky top-0 z-30">
        <Header title={title} subtitle={subtitle} />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <button
            type="button" // ✅ Explicitly set type="button"
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Sidebar */}
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
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}