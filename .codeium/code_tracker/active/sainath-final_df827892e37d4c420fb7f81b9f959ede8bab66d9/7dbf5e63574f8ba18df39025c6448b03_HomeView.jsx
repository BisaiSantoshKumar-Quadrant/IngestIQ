–7import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { useDashboardContext } from "./DashboardContext";


const HomeView = ({ managerName, timeOfDay }) => {
  const { allScores, employees, allExams } = useDashboardContext();
  const [averageScore, setAverageScore] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [recentExams, setRecentExams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const itemsPerPage = 5;

  useEffect(() => {
    calculateMetrics();
    getRecentExams(currentPage);
  }, [allScores, employees, allExams, currentPage]);

  const calculateMetrics = () => {
    // Average Score
    if (allScores.length > 0) {
      const totalPercentage = allScores.reduce((sum, score) => {
        const percentage = (score.score / score.totalQuestions) * 100;
        return sum + percentage;
      }, 0);
      setAverageScore((totalPercentage / allScores.length).toFixed(2));
    } else {
      setAverageScore(0);
    }

    // Total Users
    setTotalUsers(
      employees.filter((emp) => emp.roleName !== "Admin" && emp.roleName !== "Manager").length
    );

    // Total Assessments
    setTotalAssessments([...new Set(allExams.map((exam) => exam.assessmentId))].length);
  };

  const getRecentExams = (page) => {
    if (!allScores || allScores.length === 0) {
      setRecentExams([]);
      setTotalPages(1);
      return;
    }

    const sortedScores = [...allScores].sort(
      (a, b) => new Date(b.dateTaken || 0) - new Date(a.dateTaken || 0)
    );
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedScores.length);

    const currentPageExams = sortedScores
      .slice(startIndex, endIndex)
      .map((exam, index) => ({
        ...exam,
        uniqueKey: `${exam.userEmail}-${exam.dateTaken}-${exam.assignmentName}-${startIndex + index}`,
      }));

    setRecentExams(currentPageExams);
    setTotalPages(Math.ceil(sortedScores.length / itemsPerPage));
    setCurrentPage(page);
    setPageInput(page.toString());
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      getRecentExams(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getRecentExams(currentPage + 1);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      getRecentExams(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-900">Welcome, {managerName}</h2>
      <p className="text-gray-500 mt-2 mb-6">{timeOfDay}! Here's Users performance overview.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">{averageScore}%</p>
          <p className="text-sm text-gray-500 mt-2">Across all assessments</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-green-600">{totalUsers}</p>
          <p className="text-sm text-gray-500 mt-2">Total No. of users available</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-violet-500">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Assessments</h3>
          <p className="text-3xl font-bold text-violet-600">{totalAssessments}</p>
          <p className="text-sm text-gray-500 mt-2">Unique exams available</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Exams</h3>
        {recentExams.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left text-sm font-medium text-gray-500">User Name</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">User Mail</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">Assessment</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">Topic</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">Score</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">Percentage</th>
                    <th className="p-2 text-left text-sm font-medium text-gray-500">Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExams.map((exam) => (
                    <tr key={exam.uniqueKey} className="border-b border-gray-200">
                      <td className="p-2 text-sm text-gray-700">{exam.userName}</td>
                      <td className="p-2 text-sm text-gray-700">{exam.userEmail}</td>
                      <td className="p-2 text-sm text-gray-700">{exam.assignmentName}</td>
                      <td className="p-2 text-sm text-gray-700">{exam.description}</td>
                      <td className="p-2 text-sm text-gray-700">
  {exam.score}/{exam.questionConduct}
</td>
<td className="p-2 text-sm text-gray-700">
  {exam.questionConduct > 0
    ? ((exam.score / exam.questionConduct) * 100).toFixed(2) + "%"
    : "0.00%"}
</td>

                      <td className="p-2 text-sm text-gray-700">
                        {new Date(exam.dateTaken).toLocaleString()}
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
          <p className="text-gray-500">No recent exams available.</p>
        )}
      </div>
    </div>
  );
};

export default HomeView;–7"(df827892e37d4c420fb7f81b9f959ede8bab66d92¨file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Manager/HomeView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final