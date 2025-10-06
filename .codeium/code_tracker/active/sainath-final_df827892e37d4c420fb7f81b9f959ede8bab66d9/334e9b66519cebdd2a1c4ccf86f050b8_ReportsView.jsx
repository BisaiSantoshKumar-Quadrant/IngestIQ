�import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { useDashboardContext } from "./DashboardContext";
import Chart from 'chart.js/auto';



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const ReportsView = () => {
  const { employees, loading: contextLoading } = useDashboardContext();
  const [selectedUserReport, setSelectedUserReport] = useState(null);
  const [isTestsVisible, setIsTestsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "dateTaken",
    direction: "desc",
  });

  const generateUserReport = async (employeeId) => {
    if (!employeeId || isNaN(employeeId)) {
      toast.error("Invalid employee ID");
      console.error("Invalid employeeId:", employeeId);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [availableRes, completedRes] = await Promise.all([
        axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/user-assessments/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/completed-assessments/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log(availableRes.data, completedRes.data);
  
      const availableTests = availableRes.data.availableTests || [];
      const completedTests = completedRes.data.completedTests || [];

      // Calculate average score based on percentage
      const avgScore =
        completedTests.length > 0
          ? (
              completedTests.reduce((sum, test) => {
                const percentage = test.questionsConduct > 0 ? (test.score / test.questionsConduct) * 100 : 0;
                return sum + percentage;
              }, 0) / completedTests.length
            ).toFixed(2)
          : 0;

      // Calculate pass rate
      const passRate =
        completedTests.length > 0
          ? (
              (completedTests.filter(
                (test) => test.questionsConduct > 0 && (test.score / test.questionsConduct) * 100 >= (test.passingPercentage || 70)
              ).length / completedTests.length) * 100
            ).toFixed(2)
          : 0;

      // Sort tests by dateTaken (descending)
      const sortedCompletedTests = [...completedTests].sort(
        (a, b) => new Date(b.dateTaken) - new Date(a.dateTaken)
      );

      // Find top performed exam based on percentage
      const topPerformed = sortedCompletedTests.length > 0
        ? sortedCompletedTests.reduce((max, test) => {
            const maxPercentage = max.questionsConduct > 0 ? (max.score / max.questionsConduct) * 100 : -Infinity;
            const testPercentage = test.questionsConduct > 0 ? (test.score / test.questionsConduct) * 100 : -Infinity;
            if (testPercentage > maxPercentage) return test;
            if (testPercentage === maxPercentage) {
              return new Date(test.dateTaken) > new Date(max.dateTaken) ? test : max;
            }
            return max;
          }, sortedCompletedTests[0])
        : {};

      // Find least performed exam based on percentage
      const leastPerformed = sortedCompletedTests.length > 0
        ? sortedCompletedTests.reduce((min, test) => {
            const minPercentage = min.questionsConduct > 0 ? (min.score / min.questionsConduct) * 100 : Infinity;
            const testPercentage = test.questionsConduct > 0 ? (test.score / test.questionsConduct) * 100 : Infinity;
            if (testPercentage < minPercentage) return test;
            if (testPercentage === minPercentage) {
              return new Date(test.dateTaken) > new Date(min.dateTaken) ? test : min;
            }
            return min;
          }, sortedCompletedTests[0])
        : {};

      setSelectedUserReport({
        employeeId,
        availableTests,
        completedTests: sortedCompletedTests,
        avgScore,
        passRate,
        topPerformed,
        leastPerformed,
      });
      toast.success("User report generated!");
    } catch (error) {
      console.error("Error generating user report:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
      setSelectedUserReport(null);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedTests = (tests) => {
    return [...tests].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "topic":
          aValue = a.topic.toLowerCase();
          bValue = b.topic.toLowerCase();
          break;
        case "description":
          aValue = a.description ? a.description.toLowerCase() : "";
          bValue = b.description ? b.description.toLowerCase() : "";
          break;
        case "score":
          aValue = a.questionsConduct > 0 ? (a.score / a.questionsConduct) * 100 : 0;
          bValue = b.questionsConduct > 0 ? (b.score / b.questionsConduct) * 100 : 0;
          break;
        case "status":
          aValue = (a.questionsConduct > 0 && ((a.score / a.questionsConduct) * 100) >= (a.passingPercentage || 70)) ? 1 : 0;
          bValue = (b.questionsConduct > 0 && ((b.score / b.questionsConduct) * 100) >= (b.passingPercentage || 70)) ? 1 : 0;
          break;
        case "dateTaken":
          aValue = new Date(a.dateTaken);
          bValue = new Date(b.dateTaken);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getUserPieChartData = (report) => ({
    labels: ["Available Tests", "Completed Tests"],
    datasets: [
      {
        data: [report.availableTests.length, report.completedTests.length],
        backgroundColor: ["rgba(142, 77, 182, 0.6)", "rgba(86, 182, 194, 0.6)"],
        borderColor: ["rgba(142, 77, 182, 1)", "rgba(86, 182, 194, 1)"],
        borderWidth: 1,
      },
    ],
  });

  const userPieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Tests Overview" },
    },
    layout: {
      padding: 20,
    },
  };

  const getUserLineChartData = (report, selectedExam = "") => {
    let filteredTests = report.completedTests;
    if (selectedExam) {
      filteredTests = report.completedTests.filter((test) => test.topic === selectedExam);
    }

    return {
      labels: filteredTests.map((test) =>
        selectedExam
          ? test.description
            ? `${test.description}`
            : `Test ${test.assessmentID.slice(-4)}`
          : test.topic.length > 10
          ? test.topic.substring(0, 10) + "..."
          : test.topic
      ),
      datasets: [
        {
          label: "Score (%)",
          data: filteredTests.map((test) => (test.questionsConduct > 0 ? ((test.score / test.questionsConduct) * 100).toFixed(1) : 0)),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          fill: false,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const userLineChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Completed Test Scores",
      },
      datalabels : {
        display : false,
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          // `context.dataIndex` points to the test in your filtered list:
          const test = getPaginatedCompletedTests()[context.dataIndex];
          const percentage = ((test.score / test.questionsConduct) * 100).toFixed(1);

          return [
            `Score: ${test.score}/${test.questionsConduct} (${percentage}%)`,
            `Description: ${test.description}`,
          ];
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: { display: true, text: "Percentage (%)" },
      },
      x: {
        title: { display: true, text: "Tests" },
      },
    },
    layout: {
      padding: 20,
    },
  };
  

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">User Reports</h3>
      </div>

      {(contextLoading || loading) && <p className="text-gray-500">Loading...</p>}

      {!contextLoading && !loading && !selectedUserReport && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Search User by Name or Email:</label>
          <Select
            options={employees
              .filter((emp) => emp.roleName !== "Admin" && emp.roleName !== "Manager")
              .map((employee) => ({
                value: employee.employeeId,
                label: `${employee.username} (${employee.email})`,
                username: employee.username,
                email: employee.email,
              }))}
            onChange={(selectedOption) => {
              if (selectedOption) {
                generateUserReport(selectedOption.value);
              }
            }}
            filterOption={(option, inputValue) => {
              const searchLower = inputValue.toLowerCase();
              return (
                option.data.username.toLowerCase().includes(searchLower) ||
                option.data.email.toLowerCase().includes(searchLower)
              );
            }}
            placeholder="Type to generate user report..."
            className="w-full max-w-md"
            classNamePrefix="react-select"
            isClearable
            noOptionsMessage={() => "No users found"}
          />
        </div>
      )}

      {!contextLoading && !loading && selectedUserReport && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">
            Report for {employees.find((emp) => emp.employeeId === selectedUserReport.employeeId)?.username}
          </h3>

          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full max-w-[300px] h-[300px] mx-auto">
                <Pie data={getUserPieChartData(selectedUserReport)} options={userPieChartOptions} />
              </div>
              <div className="w-full max-w-[500px] h-[300px] mx-auto">
                <Line data={getUserLineChartData(selectedUserReport)} options={userLineChartOptions} />
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">Average Score:</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedUserReport.avgScore}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">Pass Rate:</p>
                  <p className="text-2xl font-bold text-green-600">{selectedUserReport.passRate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">Top Performed Exam:</p>
                  {selectedUserReport.completedTests.length > 0 ? (
                    (() => {
                      const topExam = selectedUserReport.topPerformed;
                      const percentage =
                        topExam.questionsConduct > 0
                          ? ((topExam.score / topExam.questionsConduct) * 100).toFixed(1)
                          : '0';
                      return (
                        <p className="text-lg font-bold text-purple-600">
                          {topExam.topic} {topExam.description ? `(${topExam.description})` : ""}: {percentage}%
                        </p>
                      );
                    })()
                  ) : (
                    <p className="text-gray-500">N/A</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">Least Performed Exam:</p>
                  {selectedUserReport.completedTests.length > 0 ? (
                    (() => {
                      const leastExam = selectedUserReport.leastPerformed;
                      const percentage =
                        leastExam.questionsConduct > 0
                          ? ((leastExam.score / leastExam.questionsConduct) * 100).toFixed(1)
                          : '0';
                      return (
                        <p className="text-lg font-bold text-orange-600">
                          {leastExam.topic} {leastExam.description ? `(${leastExam.description})` : ""}: {percentage}%
                        </p>
                      );
                    })()
                  ) : (
                    <p className="text-gray-500">N/A</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsTestsVisible(!isTestsVisible)}
            >
              <h4 className="text-xl font-semibold">Completed Tests Details</h4>
              <span className="ml-2 text-xl">{isTestsVisible ? "▼" : "▶"}</span>
            </div>
            {isTestsVisible && (
              <div className="hidden md:block overflow-y-scroll max-h-96 mt-4">
                {selectedUserReport.completedTests.length > 0 ? (
                  <table className="w-full border-collapse rounded-lg border border-gray-200">
                    <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
                      <tr className="text-center">
                        <th
                          className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer"
                          onClick={() => sortData("topic")}
                        >
                          Exam Name
                          {sortConfig.key === "topic" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th
                          className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer"
                          onClick={() => sortData("description")}
                        >
                          Description
                          {sortConfig.key === "description" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th
                          className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer"
                          onClick={() => sortData("score")}
                        >
                          Score
                          {sortConfig.key === "score" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th
                          className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer"
                          onClick={() => sortData("status")}
                        >
                          Status
                          {sortConfig.key === "status" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                        <th
                          className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer"
                          onClick={() => sortData("dateTaken")}
                        >
                          Date Taken
                          {sortConfig.key === "dateTaken" && (
                            <span className="ml-1">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedTests(selectedUserReport.completedTests).map((test) => {
                        const percentage =
                          test.questionsConduct > 0
                            ? ((test.score / test.questionsConduct) * 100).toFixed(1)
                            : '0';
                        const passCriteria = test.passingPercentage || 70;
                        const hasPassed = parseFloat(percentage) >= passCriteria;
                        return (
                          <tr
                            key={test.assessmentID}
                            className="border-b border-gray-200 text-center hover:bg-gray-50"
                          >
                            <td className="p-3 text-gray-800">{test.topic}</td>
                            <td className="p-3 text-gray-800">{test.description || "N/A"}</td>
                            <td className="p-3 text-gray-800">
                              {test.score}/{test.questionsConduct} ({percentage}%)
                            </td>
                            <td className="p-3">
                              <span className={hasPassed ? "text-green-600" : "text-red-600"}>
                                {hasPassed ? "Passed" : "Failed"}
                              </span>
                            </td>
                            <td className="p-3 text-gray-800">
                              {new Date(test.dateTaken).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 mt-2">No completed tests available.</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setSelectedUserReport(null)}
            className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Reports
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportsView;�"(df827892e37d4c420fb7f81b9f959ede8bab66d92�file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Manager/ReportsView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final