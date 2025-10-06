èimport React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/User/Sidebar";
import HomeView from "../components/User/HomeView";
import AvailableTestsView from "../components/User/AvailableTestsView";
import CompletedTestsView from "../components/User/CompletedTestsView";
import { UserDashboardProvider } from "../components/User/UserDashboardContext";

const UserDashboard = () => {
  const [view, setView] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        const token = localStorage.getItem("token");
        if (!employeeId || !token) {
          toast.error("Authentication required. Please log in.");
          setTimeout(() => window.location.href = "/login", 1000);
          return;
        }
        const response = await axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.roleName?.toLowerCase() !== "user") {
          toast.info("Your role has changed. Redirecting...");
          setTimeout(() => window.location.href = "/manager-dashboard", 1000);
        }
      } catch (error) {
        console.error("Error checking role:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.clear();
          setTimeout(() => window.location.href = "/login", 1000);
        } else {
          console.warn("Role check failed, continuing as User:", error.message);
        }
      }
    };

    checkRole();

   
  }, []);


  return (
    <UserDashboardProvider>
      <div className="flex flex-col min-h-screen relative">
        <Navbar role="User" />
        <ToastContainer position="top-right" autoClose={1000} />
        <div className="flex flex-1 flex-col md:flex-row">
          <Sidebar
            view={view}
            setView={setView}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
          <div className="flex-1 p-6">
            {view === "home" && <HomeView />}
            {view === "available" && <AvailableTestsView />}
            {view === "completed" && <CompletedTestsView />}
          </div>
        </div>
        
        <Footer />
      </div>
    </UserDashboardProvider>
  );
};

export default UserDashboard;è"(df827892e37d4c420fb7f81b9f959ede8bab66d92 file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/pages/UserDashboard.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final