// In DashboardLayout.jsx
import OpenSidebar from "./OpenSidebar"; // Changed from Sidebar
import Header from "./Header";

export default function DashboardLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header spans full width at top */}
      <Header title={title} subtitle={subtitle} />

      {/* Sidebar and main content side by side */}
      <div className="flex flex-1">
        <OpenSidebar /> {/* Changed from <Sidebar /> */}

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}