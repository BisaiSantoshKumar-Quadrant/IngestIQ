 ximport React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdSearch } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { useUserDashboardContext } from "./UserDashboardContext";
import TestResultsView from "./TestResultsView";

const CompletedTestsView = () => {
  const { employeeId, token, navigate } = useUserDashboardContext();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [search, setSearch] = useState(localStorage.getItem("searchCompleted") || "");
  const [reattemptCounts, setReattemptCounts] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTestResults, setSelectedTestResults] = useState(null);
  const testsPerPage = 10;
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const filterDropdownRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        setError("");
        if (!employeeId || !token) throw new Error("Authentication required");
        const response = await axios.get(
          `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/completed-assessments/${employeeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data)
        const tests = response.data.completedTests || [];
        setTests(tests);
        const counts = {};
        tests.forEach((test) => {
          counts[test.assessmentID] = { current: test.currentAttempts || 0, max: test.maxReattempts || 0 };
        });
        setReattemptCounts(counts);
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
    let filtered = tests
      .filter((test) =>
        search
          ? test.topic.toLowerCase().startsWith(search.toLowerCase()) ||
            test.description.toLowerCase().startsWith(search.toLowerCase())
          : true
      )
      
      .filter((test) => {
        
        const percentage = ((test.score /test.questionsConduct ) * 100).toFixed(1);
     
        const passCriteria = test.passingPercentage !== undefined ? test.passingPercentage : 70;
        const hasPassed = percentage >= passCriteria;
        console.log(passCriteria);
        


        if (filterStatus === "passed") return hasPassed;
        if (filterStatus === "failed") return !hasPassed;
        return true;
      })
      .sort((a, b) => new Date(b.dateTaken || 0) - new Date(a.dateTaken || 0));
    setFilteredTests(filtered);
    localStorage.setItem("searchCompleted", search);
  }, [search, filterStatus, tests]);

  useEffect(() => {
    const handleClickOutsideResults = (event) => {
      if (selectedTestResults && resultsRef.current && !resultsRef.current.contains(event.target)) {
        setSelectedTestResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideResults);
    return () => document.removeEventListener("mousedown", handleClickOutsideResults);
  }, [selectedTestResults]);

  const reAttemptExam = async (assessmentId) => {
    try {
      const currentCount = reattemptCounts[assessmentId]?.current || 0;
      const maxCount = reattemptCounts[assessmentId]?.max || 0;
      if (currentCount >= maxCount) {
        toast.error("Reattempt limit finished. You cannot attempt this exam again.");
        return;
      }
      navigate(`/exam/${assessmentId}`);
    } catch (err) {
      toast.error("Error checking reattempt status: " + err.message);
    }
  };

  const viewResults = async (assessmentId) => {
    setResultsLoading(true);
    try {
      if (!token || !employeeId) throw new Error("Authentication required");
      const response = await axios.get(
        `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/employee-responses/${employeeId}/${assessmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedTestResults(response.data);
      console.log(response.data)
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Failed to fetch results: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setResultsLoading(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const getPaginatedTests = () => {
    const startIndex = (currentPage - 1) * testsPerPage;
    const endIndex = startIndex + testsPerPage;
    return filteredTests.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredTests.length / testsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageInputChange = (e) => setPageInput(e.target.value);

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      setPageInput(currentPage);
    } else {
      setCurrentPage(pageNum);
    }
  };

  const [pageInput, setPageInput] = useState(currentPage);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  if (resultsLoading) {
    return <p className="text-gray-500 text-center">Loading results...</p>;
  }

  if (selectedTestResults) {
    if (!selectedTestResults?.assessmentDetails) {
      return <p className="text-red-500 text-center">No results available.</p>;
    }
    return (
      <div ref={resultsRef}>
        <TestResultsView
          selectedTestResults={selectedTestResults}
          setSelectedTestResults={setSelectedTestResults}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Completed Tests</h3>
        <div className="flex items-center gap-4">
          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm h-10 flex items-center justify-center gap-2"
            >
              <FaFilter className="w-4 h-4" /> Filter by
              {filterStatus !== "all" && (
                <span className="bg-green-500 text-white rounded-full p-1 px-2 flex items-center justify-center text-xs">1</span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-10">
                {["all", "passed", "failed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setCurrentPage(1);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm capitalize ${
                      filterStatus === status ? "bg-blue-100 text-blue-800" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          {getPaginatedTests().map((test) => {
            const percentage = ((test.score / test.questionsConduct) * 100).toFixed(1);
            const passCriteria = test.passingPercentage !== undefined ? test.passingPercentage : 70;
            const hasPassed = percentage >= passCriteria;
            const currentCount = reattemptCounts[test.assessmentID]?.current || 0;
            const maxCount = reattemptCounts[test.assessmentID]?.max || 0;
            const isReattemptDisabled = currentCount >= maxCount;

            return (
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
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      <span className="font-medium text-gray-700">Score: </span>{test.score}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium text-gray-700">Status: </span>
                      <span className={hasPassed ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {hasPassed ? "Passed" : "Failed"}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-center">
                    {hasPassed ? (
                      <button
                        className="w-32 bg-blue-500 text-white py-1.5 px-3 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm mx-2"
                        onClick={() => viewResults(test.assessmentID)}
                      >
                        View Results
                      </button>
                    ) : (
                      <button
                        className={`w-32 py-1.5 px-3 rounded-lg font-medium transition-all duration-200 shadow-sm mx-2 ${
                          isReattemptDisabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={() => reAttemptExam(test.assessmentID)}
                        disabled={isReattemptDisabled}
                      >
                        Re-attempt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          {search || filterStatus !== "all" ? "No matching tests found." : "No completed tests at the moment."}
        </p>
      )}
      {filteredTests.length > testsPerPage && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`p-1 rounded ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <form onSubmit={handlePageSubmit} className="flex items-center">
            <span className="text-gray-700 font-medium">Page</span>
            <input
              type="number"
              value={pageInput}
              onChange={handlePageInputChange}
              className="w-16 mx-2 p-1 border border-gray-300 rounded text-center"
              min="1"
              max={totalPages}
            />
            <span className="text-gray-700 font-medium">of {totalPages}</span>
          </form>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default CompletedTestsView; x"(df827892e37d4c420fb7f81b9f959ede8bab66d92¯file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/User/CompletedTestsView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final