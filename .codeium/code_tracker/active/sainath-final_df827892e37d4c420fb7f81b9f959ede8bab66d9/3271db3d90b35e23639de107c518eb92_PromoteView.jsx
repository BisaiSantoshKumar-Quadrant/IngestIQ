ðaimport React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDashboardContext } from "./DashboardContext";

const PromoteView = () => {
  const { employees, setEmployees, fetchSharedData, loading: contextLoading } = useDashboardContext();
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState({});
  const [roles, setRoles] = useState([]);
  const [sortColumn, setSortColumn] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    // Fetch roles and employees on mount
    const now = Date.now();
    if (now - lastFetchTime > 5000) { // Avoid fetching too often
      fetchRoles();
      fetchSharedData().catch((error) => {
        console.warn("Failed to fetch employees on mount:", error);
        toast.error("Failed to refresh employee data");
      });
      setLastFetchTime(now);
    }
  }, []); // Run once on mount

  useEffect(() => {
    // Initialize selectedRole
    const initialRoles = {};
    employees.forEach((emp) => {
      if (emp.email) {
        initialRoles[emp.email] = emp.roleName || "";
      }
    });
    setSelectedRole(initialRoles);
  }, [employees]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/roles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  const handleRoleChange = (email, roleName) => {
    setSelectedRole((prev) => ({ ...prev, [email]: roleName }));
  };

  const handleSubmit = async (email) => {
    const newRole = selectedRole[email];
    const currentEmployee = employees.find((emp) => emp.email === email);
    const currentRole = currentEmployee?.roleName || "";

    if (!newRole || newRole === currentRole) {
      toast.info("No role changes detected");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/submit",
        { Email: email, RoleName: newRole },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.status === 204) {
        toast.success("Role updated successfully!");
        // Update employees locally as fallback
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.email === email ? { ...emp, roleName: newRole } : emp
          )
        );
        // Refresh from API
        try {
          await fetchSharedData();
          setLastFetchTime(Date.now());
        } catch (fetchError) {
          console.warn("Failed to refresh employees:", fetchError);
          // Local update already applied, so no error toast
        }
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees
    .filter(
      (employee) =>
        (employee.username?.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
          employee.email?.toLowerCase().includes(employeeSearchTerm.toLowerCase())) &&
        employee.roleName !== "Admin" &&
        employee.roleName !== "Manager"
    )
    .sort((a, b) => {
      const fieldA = a[sortColumn] || "";
      const fieldB = b[sortColumn] || "";
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Manage Users</h3>
        <div ref={searchRef} className="relative w-48">
          <input
            type="text"
            value={employeeSearchTerm}
            onChange={(e) => setEmployeeSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg
            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {contextLoading || loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredEmployees.length > 0 ? (
        <>
          <div className="shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-y-auto max-h-96">
              <table className="w-full bg-white">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-600 text-sm uppercase tracking-wider">
                    <th
                      className="p-4 text-left font-semibold cursor-pointer hover:text-blue-500"
                      onClick={() => handleSort("username")}
                    >
                      Name
                      {sortColumn === "username" && sortOrder !== null && (
                        <span className="ml-1">{sortOrder === "asc" ? "â†‘" : "â†“"}</span>
                      )}
                    </th>
                    <th
                      className="p-4 text-left font-semibold cursor-pointer hover:text-blue-500"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortColumn === "email" && sortOrder !== null && (
                        <span className="ml-1">{sortOrder === "asc" ? "â†‘" : "â†“"}</span>
                      )}
                    </th>
                    <th className="p-4 text-left font-semibold">Current Role</th>
                    <th className="p-4 text-left font-semibold">Update Role</th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.email} className="hover:bg-gray-50 transition duration-150">
                      <td className="p-4">{employee.username || "N/A"}</td>
                      <td className="p-4 text-gray-600">{employee.email}</td>
                      <td className="p-4">{employee.roleName || "None"}</td>
                      <td className="p-4">
                        <select
                          value={selectedRole[employee.email] || ""}
                          onChange={(e) => handleRoleChange(employee.email, e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {roles.map((role) => (
                            <option key={role.roleName} value={role.roleName}>
                              {role.roleName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleSubmit(employee.email)}
                          className={`${
                            selectedRole[employee.email] && selectedRole[employee.email] !== employee.roleName
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-400 hover:bg-gray-500"
                          } text-white p-2 rounded transition duration-200`}
                          disabled={loading}
                          title="Submit Changes"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden max-h-96 overflow-y-scroll space-y-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.email}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="mb-2">
                  <span className="font-semibold">Email: </span>
                  <span className="text-gray-600">{employee.email}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Name: </span>
                  <span>{employee.username || "N/A"}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Current Role: </span>
                  <span>{employee.roleName || "None"}</span>
                </div>
                <div className="mb-2">
                  <label className="font-semibold block mb-1">Update Role:</label>
                  <select
                    value={selectedRole[employee.email] || ""}
                    onChange={(e) => handleRoleChange(employee.email, e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role.roleName} value={role.roleName}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleSubmit(employee.email)}
                  className={`${
                    selectedRole[employee.email] && selectedRole[employee.email] !== employee.roleName
                      ? "bg-blue-500 hover:bg-blue-700"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white px-4 py-2 rounded flex-1 flex items-center justify-center`}
                  disabled={loading}
                  title="Submit Changes"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-2">
          {employeeSearchTerm ? "No employees found matching your search." : "No employees available."}
        </p>
      )}
    </div>
  );
};

export default PromoteView;
ða"(df827892e37d4c420fb7f81b9f959ede8bab66d92«file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Manager/PromoteView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final