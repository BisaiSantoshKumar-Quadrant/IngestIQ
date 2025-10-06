û
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import "./index.css"
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ExamPage from "./components/ExamPage"; 
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import LandingPage from "./pages/LandingPage";
import ManagerRegister from "./components/ManagerRegister";


function App() {
  return (    
      <Router>
        <ToastContainer/>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/manager-register" element={<ManagerRegister />} />


          {/* Protected routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Protected routes for Manager */}
          <Route element={<ProtectedRoute allowedRoles={["Manager"]} />}>
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          </Route>

          {/* Protected routes for User */}
          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/exam/:examId" element={<ExamPage />} /> {/* Add the exam route here */}
          </Route>
        </Routes>
      </Router>
  );
}

export default App;û"(df827892e37d4c420fb7f81b9f959ede8bab66d92êfile:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/App.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final