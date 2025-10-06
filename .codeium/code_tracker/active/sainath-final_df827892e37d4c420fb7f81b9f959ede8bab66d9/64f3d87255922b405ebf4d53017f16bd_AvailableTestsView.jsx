´0import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdSearch } from "react-icons/md";
import { useUserDashboardContext } from "./UserDashboardContext";

const AvailableTestsView = () => {
  const { employeeId, token, navigate } = useUserDashboardContext();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [search, setSearch] = useState(localStorage.getItem("searchAvailable") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError("");
        if (!employeeId || !token) throw new Error("Authentication required");
        const response = await axios.get(
          `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/user-assessments/${employeeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const tests = response.data.availableTests || [];
        setTests(tests);
        setFilteredTests(
          tests.filter((test) =>
            search
              ? test.topic.toLowerCase().startsWith(search.toLowerCase()) ||
                test.description.toLowerCase().startsWith(search.toLowerCase())
              : true
          )
        );
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [employeeId, token]);

  useEffect(() => {
    setFilteredTests(
      tests.filter((test) =>
        search
          ? test.topic.toLowerCase().startsWith(search.toLowerCase()) ||
            test.description.toLowerCase().startsWith(search.toLowerCase())
          : true
      )
    );
    localStorage.setItem("searchAvailable", search);
  }, [search, tests]);

  const startExam = (assessmentId) => navigate(`/exam/${assessmentId}`);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Available Tests</h3>
        <div className="flex items-center gap-4">
          {!isSearchOpen ? (
            <button
              onClick={toggleSearch}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm w-24 h-10 flex items-center justify-center"
            >
              <MdSearch className="w-5 h-5 mr-1" />
              Search
            </button>
          ) : (
            <div ref={searchRef} className="relative w-64">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by topic or description..."
                className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                onClick={toggleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                âœ•
              </button>
            </div>
          )}
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500 text-center">Loading tests...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTests.map((test) => (
            <div
              key={test.assessmentID}
              className="bg-white rounded-lg shadow-md border border-blue-500 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="p-4 flex flex-col justify-between h-48">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{test.topic}</h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    <span className="font-medium text-gray-700">Topic: </span>{test.description}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-700">Time Limit: </span>
                    {test.timeLimit ? `${test.timeLimit} min` : "Not specified"}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    className="w-32 bg-blue-500 text-white py-1.5 px-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm mx-2"
                    onClick={() => startExam(test.assessmentID)}
                  >
                    Take Test
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          {search ? "No matching tests found." : "No available tests at the moment."}
        </p>
      )}
    </>
  );
};

export default AvailableTestsView;´0"(df827892e37d4c420fb7f81b9f959ede8bab66d92¯file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/User/AvailableTestsView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final