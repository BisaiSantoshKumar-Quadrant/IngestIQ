�>import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormValidation, FormError } from "./FormValidation";
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  
  const validationRules = {
    email: {
      required: true,
      email: true
    },
    password: {
      required: true
    }
  };
  
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm
  } = useFormValidation(
    { email: "", password: "" },
    validationRules
  );

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/auth/login", {
        email: values.email,
        password: values.password
      });
    
      const { token, role, employeeId, name, email } = response.data;
    
      if (!token || !employeeId) {
        throw new Error("Invalid response from server");
      }
    
      console.log("Employee ID:", employeeId);
    
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("employeeId", employeeId);
      localStorage.setItem("name", name);
      localStorage.setItem("email",email);

      setTimeout(() => {
        if (role === "Admin") {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          navigate("/admin-dashboard");
        } else if (role === "Manager") {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          navigate("/manager-dashboard");
        } else if (role === "User") {
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          });
          navigate("/user-dashboard");
        } else if (role === "Guest") {
          toast.error("Your account is not yet activated by admin. Please contact admin.", {
            position: "top-right",
            autoClose: 4000
          });
          setTimeout(() => {
            navigate("/"); 
          }, 2000);
        }
      }, 1000);
    
    } catch (error) {
      console.error("Login error:", error);
    
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        const errorType = error.response.data.errorType;
        
        if (errorType === "unregistered") {
          toast.error("User not registered. Please register or Enter correct email.", {
            position: "top-right",
            autoClose: 4000
          });
        } else if (errorType === "invalid_credentials") {
          toast.error("Invalid credentials. Please enter correct password.", {
            position: "top-right",
            autoClose: 4000
          });
        } else {
          toast.error(errorMessage || "Authentication failed", {
            position: "top-right",
            autoClose: 4000
          });
        }
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 4000
        });
      } else if (!navigator.onLine) {
        toast.error("Network error. Please check your internet connection.", {
          position: "top-right",
          autoClose: 4000
        });
      } else {
        toast.error("Login failed. Please try again later.", {
          position: "top-right",
          autoClose: 4000
        });
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="logo.png" alt="logo" />
          Assessment
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Login to your account
            </h1>
            
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="name@company.com"
                />
                <FormError errors={errors.email} />
              </div>
              
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="••••••••"
                />
                <FormError errors={errors.password} />
              </div>
              
              <div className="flex items-center justify-between">
                <a href="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Forgot password?
                </a>
                <p className="text-sm font-light text-black-500 dark:text-gray-400">
                  Don't have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</a>
                </p>
              </div>
              
              <button 
                type="submit" 
                className="w-full text-white bg-violet-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                 Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;�>"(df827892e37d4c420fb7f81b9f959ede8bab66d92�file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Login.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final