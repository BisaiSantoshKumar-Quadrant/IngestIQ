çimport { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; 
import { LuLogOut } from "react-icons/lu";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 3000, 
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setTimeout(() => {
      navigate("/"); 
    }, 3000);
  };

  return (
    <>
      <nav className="bg-violet-600 h-20 text-white p-4 flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center">
          <Link to="/" className="flex items-center text-2xl font-semibold text-white-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
            Assessment
          </Link>
        </div>
        <ul className="flex space-x-4 items-center">
          <li>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-violet-700 rounded-md transition-colors"
            >
              <LuLogOut className="w-5 h-5" />
            </button>
          </li>
        </ul>
      </nav>

      {/* ToastContainer to render all toasts */}
      <ToastContainer />
    </>
  );
};

export default Navbar;ç"(df827892e37d4c420fb7f81b9f959ede8bab66d92ûfile:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Navbar.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final