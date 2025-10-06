ÍMimport React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import availabletestview from "./AvailableTestsView";
import CompletedTestsView from "./CompletedTestsView";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useUserDashboardContext } from "./UserDashboardContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const HomeView = () => {
  const { employeeId, token, navigate } = useUserDashboardContext();
  const [availableTests, setAvailableTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage);
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState(localStorage.getItem("name") || "User");
  const [timeOfDay, setTimeOfDay] = useState("");
  const testsPerPage = 10;
  const barChartRef = useRef(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setTimeOfDay(currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening");

    const fetchTests = async () => {
      try {
        setLoading(true);
        if (!employeeId || !token) throw new Error("Authentication required");
        const [availableRes, completedRes] = await Promise.all([
          axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/user-assessments/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/completed-assessments/${employeeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setAvailableTests(availableRes.data.availableTests || []);
        setCompletedTests(completedRes.data.completedTests || []);
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [employeeId, token]);

  const getPaginatedCompletedTests = () => {
    const startIndex = (currentPage - 1) * testsPerPage;
    const endIndex = startIndex + testsPerPage;
    return completedTests.slice(startIndex, endIndex);
  };

  const barChartData = {
    labels: getPaginatedCompletedTests().map((test) =>
      test.topic.length > 10 ? test.topic.substring(0, 10) + "..." : test.topic
    ),
    datasets: [
      {
        label: "Score (%)",
        data: getPaginatedCompletedTests().map((test) => ((test.score / test.questionsConduct) * 100).toFixed(1)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 30,
        minBarLength: 5,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 10, right: 10, bottom: 40 } },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Test Scores", position: "bottom", padding: { top: 10, bottom: 10 } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const test = getPaginatedCompletedTests()[context.dataIndex];
            const percentage = ((test.score / test.questionsConduct) * 100).toFixed(1);
            return [
              `Score: ${test.score}/${test.questionsConduct} (${percentage}%)`,
              `Description: ${test.description}`,
              `Date Taken: ${new Date(test.dateTaken).toLocaleDateString()}`,
            ];
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 100, title: { display: true, text: "Percentage (%)" } },
      x: { ticks: { autoSkip: false, maxRotation: 45, minRotation: 45, font: { size: 10 } }, grid: { display: false } },
    },
  };

  const pieChartData = {
    labels: ["Available Tests", "Completed Tests"],
    datasets: [
      {
        data: [availableTests.length, completedTests.length],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    layout: { padding: { left: 10, right: 10 } },
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 20, font: { size: 10 } } },
      title: { display: true, text: "Total Tests Overview", position: "bottom", padding: { top: 10, bottom: 10 } },
      datalabels: {
        color: "#fff",
        font: { size: 14, weight: "bold" },
        formatter: (value) => value,
        anchor: "center",
        align: "center",
      },
    },
    onClick: (e, els) => {
      if (els.length) navigate(els[0].index === 0 ? "/dashboard/available" : "/dashboard/completed");
    },
  };

  const totalPages = Math.ceil(completedTests.length / testsPerPage);

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

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-red-900">Welcome, {employeeName}</h2>
      <p className="text-gray-500 mt-4">{timeOfDay}</p>
      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 flex flex-col">
            <div className="flex-grow overflow-x-auto relative" style={{ height: "300px", width: "100%" }}>
              {completedTests.length > 0 ? (
                <div className="relative h-full w-full">
                  <Bar ref={barChartRef} data={barChartData} options={barChartOptions} />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center p-2 space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${
                        currentPage === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
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
                </div>
              ) : (
                <p className="text-gray-500 text-center">No completed tests yet.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/2 flex flex-col justify-center">
            <div style={{ height: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {availableTests.length > 0 || completedTests.length > 0 ? (
                <Pie
                  data={pieChartData}
                  options={pieChartOptions}
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                />
              ) : (
                <p className="text-gray-500 text-center">No tests available or completed.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeView;ÍM"(df827892e37d4c420fb7f81b9f959ede8bab66d92•file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/User/HomeView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final