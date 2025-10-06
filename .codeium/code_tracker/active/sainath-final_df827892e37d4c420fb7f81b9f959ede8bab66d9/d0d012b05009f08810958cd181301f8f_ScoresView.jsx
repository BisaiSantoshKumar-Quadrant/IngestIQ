¤€import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import Pagination from "./Pagination";
import { useDashboardContext } from "./DashboardContext";

const ScoresView = () => {
  const { allScores, categories, loading: contextLoading } = useDashboardContext();
  const [currentScores, setCurrentScores] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortColumn, setSortColumn] = useState("dateTaken");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const filterRef = useRef(null);
  const itemsPerPage = 5;

  // Reset currentPage to 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
    setPageInput("1");
  }, [searchUser, selectedDate, selectedCategories, selectedStatuses, sortColumn, sortOrder]);

  useEffect(() => {
    filterScores();
  }, [allScores, searchUser, selectedDate, selectedCategories, selectedStatuses, sortColumn, sortOrder, currentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filterScores = useCallback(() => {
    let filtered = [...allScores];

    if (searchUser) {
      const searchLower = searchUser.toLowerCase();
      filtered = filtered.filter(
        (score) =>
          (score.userName && score.userName.toLowerCase().includes(searchLower)) ||
          (score.userEmail && score.userEmail.toLowerCase().includes(searchLower)) ||
          (score.assignmentName && score.assignmentName.toLowerCase().includes(searchLower)) ||
          (score.description && score.description.toLowerCase().includes(searchLower))
      );
    }

    if (selectedDate) {
      filtered = filtered.filter((score) =>
        new Date(score.dateTaken).toISOString().split("T")[0] === selectedDate
      );
    }

    if (selectedCategories.length > 0 && !selectedCategories.includes("All")) {
      filtered = filtered.filter((score) =>
        selectedCategories.includes(score.category || "Uncategorized")
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((score) => {
        const percentage = score.questionConduct > 0 ? (score.score / score.questionConduct) * 100 : 0;
        const status = percentage >= (score.passPercentage || 70) ? "passed" : "failed";
        return selectedStatuses.includes(status);
      });
    }

    filtered.sort((a, b) => {
      if (sortColumn === "userName") {
        return sortOrder === "asc"
          ? (a.userName || "").localeCompare(b.userName || "")
          : (b.userName || "").localeCompare(a.userName || "");
      } else if (sortColumn === "userEmail") {
        return sortOrder === "asc"
          ? (a.userEmail || "").localeCompare(b.userEmail || "")
          : (b.userEmail || "").localeCompare(a.userEmail || "");
      } else if (sortColumn === "dateTaken") {
        const dateA = new Date(a.dateTaken || 0);
        const dateB = new Date(b.dateTaken || 0);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });
   
    const totalFiltered = filtered.length;
    setTotalPages(Math.max(1, Math.ceil(totalFiltered / itemsPerPage)));

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFiltered);
    setCurrentScores(filtered.slice(startIndex, endIndex));
    setPageInput(currentPage.toString());
  }, [
    allScores,
    searchUser,
    selectedDate,
    selectedCategories,
    selectedStatuses,
    sortColumn,
    sortOrder,
    currentPage,
  ]);

  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInput(currentPage.toString());
      toast.error("Invalid page number");
    }
  };

  return (
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-4">Assessment Scores</h3>
      {contextLoading && <p className="text-gray-500">Loading...</p>}
      <div className="flex justify-between items-center mb-4">
        <div className="w-1/4">
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search by user, email, or assessment..."
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterModal((prev) => !prev)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm h-10 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v3.586a1 1 0 01-1.414.414l-2-1a1 1 0 01-.586-1v-2.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
              {selectedCategories.length + selectedStatuses.length > 0 && (
                <span className="bg-green-500 text-white rounded-full p-1 px-2 flex items-center justify-center text-xs">
                  {selectedCategories.length + selectedStatuses.length}
                </span>
              )}
            </button>
            {showFilterModal && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded shadow-lg z-20">
                <div className="p-4">
                  <h4 className="font-semibold mb-2">Filter Scores</h4>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Search Categories:</label>
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Categories:</label>
                    <div className="max-h-40 overflow-y-auto">
                      {categories
                        .filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                        .map((cat) => (
                          <div key={cat} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => {
                                setSelectedCategories((prev) =>
                                  prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
                                );
                              }}
                              className="mr-2"
                            />
                            <span>{cat}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Status:</label>
                    {["passed", "failed"].map((status) => (
                      <div key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes(status)}
                          onChange={() => {
                            setSelectedStatuses((prev) =>
                              prev.includes(status)
                                ? prev.filter((s) => s !== status)
                                : [...prev, status]
                            );
                          }}
                          className="mr-2"
                        />
                        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span
                      className="text-blue-500 cursor-pointer hover:underline"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedStatuses([]);
                        setCategorySearch("");
                      }}
                    >
                      Clear
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {currentScores.length > 0 ? (
        <div>
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full border-collapse rounded-lg border border-gray-200 table-fixed">
              <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
                <tr className="text-center">
                  <th
                    className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer min-w-[120px]"
                    onClick={() => handleSort("userName")}
                  >
                    User Name
                    {sortColumn === "userName" && (
                      <span className="ml-1">{sortOrder === "asc" ? "â†‘" : "â†“"}</span>
                    )}
                  </th>
                  <th
                    className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer min-w-[150px]"
                    onClick={() => handleSort("userEmail")}
                  >
                    User Email
                    {sortColumn === "userEmail" && (
                      <span className="ml-1">{sortOrder === "asc" ? "â†‘" : "â†“"}</span>
                    )}
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[130px]">
                    Assessment
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[130px]">
                    Topic
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[120px]">
                    Category
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[100px]">
                    Score
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[100px]">
                    Percentage
                  </th>
                  <th
                    className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer min-w-[140px]"
                    onClick={() => handleSort("dateTaken")}
                  >
                    Date Taken
                    {sortColumn === "dateTaken" && (
                      <span className="ml-1">{sortOrder === "asc" ? "â†‘" : "â†“"}</span>
                    )}
                  </th>
                  <th className="p-3 font-semibold text-gray-700 border-b border-gray-200 min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log(currentScores)}
                {currentScores.map((score) => (
                 
                  <tr
                    key={score.uniqueKey}
                    className="border-b border-gray-200 text-center hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-800 truncate">{score.userName}</td>
                    <td className="p-3 text-gray-800 truncate">{score.userEmail}</td>
                    <td className="p-3 text-gray-800 truncate">{score.assignmentName}</td>
                    <td className="p-3 text-gray-800 truncate">{score.description}</td>
                    <td className="p-3 text-gray-800 truncate">{score.category || "Uncategorized"}</td>
                    <td className="p-3 text-gray-800">
                      {score.score}/{score.questionConduct}
                    </td>
                    <td className="p-3 text-gray-800">
                      {score.questionConduct > 0
                        ? ((score.score / score.questionConduct) * 100).toFixed(2) + "%"
                        : "0.00%"}
                    </td>
                    <td className="p-3 text-gray-800">
                      {new Date(score.dateTaken).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-800">
                      {score.questionConduct > 0 &&
                      score.score >= 0 &&
                      ((score.score / score.questionConduct) * 100) >= (score.passPercentage || 70)
                        ? "Passed"
                        : "Failed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageInput={pageInput}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handlePageInputChange={handlePageInputChange}
            handlePageSubmit={handlePageSubmit}
          />
        </div>
      ) : (
        <p className="text-gray-500">
          {searchUser ||
          selectedDate ||
          selectedCategories.length > 0 ||
          selectedStatuses.length > 0
            ? "No scores match the current filters."
            : "No scores available."}
        </p>
      )}
      <style jsx>{`
        table {
          table-layout: fixed;
        }
        td, th {
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};

export default ScoresView;¤€"(df827892e37d4c420fb7f81b9f959ede8bab66d92ªfile:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/manager/ScoresView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final