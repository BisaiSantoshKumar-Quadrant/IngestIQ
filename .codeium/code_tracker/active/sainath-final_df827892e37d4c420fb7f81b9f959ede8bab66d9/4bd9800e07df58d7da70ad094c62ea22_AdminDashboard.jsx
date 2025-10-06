èimport React, { useState, useCallback } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Admin/Sidebar";
import ManageUsersView from "../components/Admin/ManageUsersView";
import ManageCategoriesView from "../components/Admin/ManageCategoriesView";
import ManageRolesView from "../components/Admin/ManageRolesView";

const AdminDashboard = () => {
  const [view, setView] = useState("manage");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
    setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar role="Admin" />
      <ToastContainer position="top-right" autoClose={1000} />
      <div className="flex flex-1 md:flex-row min-h-screen">
        <Sidebar
          view={view}
          setView={handleViewChange}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-violet-600 mb-2 border-b-2 border-violet-300 pb-2">
            Admin Workspace
          </h1>
          {view === "manage" && <ManageUsersView />}
          {view === "manageCategories" && <ManageCategoriesView />}
          {view === "manageRoles" && <ManageRolesView />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;è"(df827892e37d4c420fb7f81b9f959ede8bab66d92¡file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/pages/AdminDashboard.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final