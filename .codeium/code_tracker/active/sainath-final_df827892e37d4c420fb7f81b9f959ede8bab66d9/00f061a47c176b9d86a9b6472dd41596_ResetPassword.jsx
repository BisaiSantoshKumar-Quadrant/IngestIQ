—$import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormValidation, FormError } from "./FormValidation";
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const validationRules = {
    newPassword: {
      required: true,
      password: true,
      minLength: 8
    },
    confirmPassword: {
      required: true,
      match: {
        name: "New Password",
        value: ""
      }
    }
  };

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    setValues
  } = useFormValidation(
    { newPassword: "", confirmPassword: "" },
    validationRules
  );

  if (validationRules.confirmPassword.match.value !== values.newPassword) {
    validationRules.confirmPassword.match.value = values.newPassword;
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/auth/reset-password", {
        email,
        token,
        newPassword: values.newPassword
      });

      toast.success(response.data.message || "Password has been reset successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 4000
      });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center">
              Reset Password
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-50 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  required
                />
                <FormError errors={errors.newPassword} />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  required
                />
                <FormError errors={errors.confirmPassword} />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;—$"(df827892e37d4c420fb7f81b9f959ede8bab66d92¥file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/ResetPassword.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final