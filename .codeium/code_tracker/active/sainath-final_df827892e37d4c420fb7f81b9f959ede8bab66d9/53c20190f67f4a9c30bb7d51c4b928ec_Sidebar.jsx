Åimport React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

const Sidebar = ({ view, setView, isSidebarOpen, setIsSidebarOpen, toggleSidebar }) => {
  const sidebarItems = [
    { id: "home", label: "Home", icon: <IoHomeOutline className="text-xl flex-shrink-0" /> },
    { id: "available", label: "Available Tests", icon: <FaRegPenToSquare className="text-xl flex-shrink-0" /> },
    { id: "completed", label: "Completed Tests", icon: <FaRegCheckCircle className="text-xl flex-shrink-0" /> },
  ];

  return (
    <>
      <div className="md:hidden p-4">
        <button className="focus:outline-none" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-100 p-4 transform transition-transform duration-300 ease-in-out z-20 md:static md:w-1/6 md:translate-x-0 md:h-screen ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col space-y-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`w-full p-3 flex items-center gap-3 rounded transition-colors duration-200 ${
                view === item.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
              onClick={() => {
                setView(item.id);
                setIsSidebarOpen(false);
              }}
            >
              {item.icon}
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;Å"(df827892e37d4c420fb7f81b9f959ede8bab66d92¤file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/User/Sidebar.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final