�nimport { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { validateField } from './FormValidation';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [values, setValues] = useState({
    username: "",
    category: "",
    password: "",
    confirmPassword: "",
  });
  const [categories, setCategories] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/getCategories");
        const filteredCategories = Array.isArray(response.data)
          ? response.data.filter((category) => category !== "Management")
          : [];
        setCategories(filteredCategories);
      } catch (error) {
        toast.error("Failed to fetch categories", {
          position: "top-right",
          autoClose: 4000,
        });
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Extract username from email (part before @) and replace dots with spaces
    const usernameFromEmail = newEmail.split("@")[0]?.replace(/\./g, " ") || "";
    setValues((prev) => ({ ...prev, username: usernameFromEmail }));
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailErrors = validateField('Email', email, { email: true });
    if (emailErrors) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    // Check if email ends with @quadranttechnologies.com
    if (!email.toLowerCase().endsWith("@quadranttechnologies.com")) {
      toast.error("Only Quadrant Technologies emails are allowed", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Auth/send-otp", email, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("OTP sent to your email!", {
        position: "top-right",
        autoClose: 4000,
      });
      setIsOTPSent(true);
      setTimeout(() => document.getElementById("otp")?.focus(), 100);
    } catch (error) {
      toast.error(error.response?.data || "Failed to send OTP", {
        position: "top-right",
        autoClose: 4000,
      });
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Auth/verify-otp",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setIsOTPVerified(true);
        toast.success("Email verified!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (error) {
      toast.error("Invalid or expired OTP", {
        position: "top-right",
        autoClose: 4000,
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (name === "password") {
      setPasswordErrors({
        length: value.length < 8,
        uppercase: !/[A-Z]/.test(value),
        lowercase: !/[a-z]/.test(value),
        number: !/\d/.test(value),
        specialChar: !/[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isOTPVerified) {
      toast.error("Please verify your email with OTP first!", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    if (
      !values.username ||
      !email ||
      !values.category ||
      passwordErrors.length ||
      passwordErrors.uppercase ||
      passwordErrors.lowercase ||
      passwordErrors.number ||
      passwordErrors.specialChar ||
      values.password !== values.confirmPassword
    ) {
      toast.error("Please fill all fields correctly", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Auth/register", {
        username: values.username,
        email: email,
        categoryName: values.category,
        password: values.password,
      });

      toast.success("Registration successful! Please log in.", {
        position: "top-right",
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists. Use a different email.", {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.error("Registration failed. Please try again later.", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src="logo.png" alt="logo" />
          Assessment
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Create an Account
            </h1>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={isOTPVerified}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="name@quadranttechnologies.com"
                  />
                  {!isOTPSent && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || !email}
                      className="bg-violet-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm px-4 py-2.5"
                    >
                      {loading ? "Sending..." : "Verify"}
                    </button>
                  )}
                </div>
                {isOTPSent && !isOTPVerified && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Enter OTP"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOTP}
                      disabled={loading || !otp}
                      className="bg-violet-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm px-4 py-2.5"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </div>
                )}
                {isOTPVerified && (
                  <span className="text-green-500 text-sm mt-1">✔ Email Verified</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  disabled
                  value={values.username}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Your username"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-line-height: normalmedium text-gray-900 dark:text-white"
                >
                  Select Category
                </label>
                <select
                  name="category"
                  id="category"
                  value={values.category}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="••••••••"
                />
                <div className="text-sm text-gray-600 mt-2">
                  <ul className="list-disc pl-5 text-xs">
                    <li className={passwordErrors.length ? "text-red-500" : "text-green-500"}>
                      At least 8 characters
                    </li>
                    <li className={passwordErrors.uppercase ? "text-red-500" : "text-green-500"}>
                      At least one uppercase letter
                    </li>
                    <li className={passwordErrors.lowercase ? "text-red-500" : "text-green-500"}>
                      At least one lowercase letter
                    </li>
                    <li className={passwordErrors.number ? "text-red-500" : "text-green-500"}>
                      At least one number
                    </li>
                    <li className={passwordErrors.specialChar ? "text-red-500" : "text-green-500"}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !isOTPVerified}
                className="w-full bg-violet-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-gray-400"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-violet-600 hover:underline dark:text-violet-500">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;�n"(df827892e37d4c420fb7f81b9f959ede8bab66d92�file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Register.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final