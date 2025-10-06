áimport React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [allScores, setAllScores] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchSharedData = async () => {
    const now = Date.now();
    if (now - lastFetchTime < 5000) {
      console.log("Skipping fetch: too soon since last fetch");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [scoresRes, employeesRes, categoriesRes, examsRes] = await Promise.all([
        axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/all-scores", config),
        axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees", config),
        axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/getCategories", config),
        axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/all-assessments", config),
      ]);

      setAllScores(
        scoresRes.data.map((exam, index) => ({
          ...exam,
          uniqueKey: `${exam.userEmail}-${exam.dateTaken}-${exam.assignmentName}-${index}`,
          passPercentage: exam.passPercentage,
        }))
      );

      setEmployees(employeesRes.data || []);

      const filteredCategories = Array.isArray(categoriesRes.data)
        ? ["All", ...categoriesRes.data.filter((cat) => cat !== "Management")]
        : ["All"];
      setCategories(filteredCategories);

      setAllExams(examsRes.data || []);

      setLastFetchTime(now);
    } catch (error) {
      console.error("Error fetching shared data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        allScores,
        employees,
        setEmployees,
        categories,
        allExams,
        setAllExams,
        fetchSharedData, 
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
á"(df827892e37d4c420fb7f81b9f959ede8bab66d92°file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Manager/DashboardContext.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final