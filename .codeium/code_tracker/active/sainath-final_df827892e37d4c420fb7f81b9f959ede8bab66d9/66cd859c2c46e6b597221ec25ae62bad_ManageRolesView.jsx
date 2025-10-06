Ԇimport React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MdAdd, MdSearch, MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

// Inline debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ManageRolesView = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [isRolesLoading, setIsRolesLoading] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [showRoleSearch, setShowRoleSearch] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [editedRoleName, setEditedRoleName] = useState("");
  const [lastFetched, setLastFetched] = useState({
    roles: null,
    users: null,
  });

  const roleSearchRef = useRef(null);
  const roleAddRef = useRef(null);
  const roleSearchInputRef = useRef(null);
  const roleAddInputRef = useRef(null);

  const isDataFresh = (timestamp) => {
    if (!timestamp) return false;
    const now = new Date();
    const lastFetchedTime = new Date(timestamp);
    return now - lastFetchedTime < 300000; // 5 minutes
  };

  const debouncedSetRoleSearchTerm = useCallback(
    debounce((value) => setRoleSearchTerm(value), 300),
    []
  );

  const fetchRoles = useCallback(async (force = false) => {
    if (!force && isDataFresh(lastFetched.roles)) return;
    setIsRolesLoading(true);
    try {
      const response = await axios.get(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/roles",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRoles(response.data);
      setLastFetched((prev) => ({ ...prev, roles: new Date().toISOString() }));
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    } finally {
      setIsRolesLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (force = false) => {
    if (!force && isDataFresh(lastFetched.users)) return;
    try {
      const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(response.data);
      setLastFetched((prev) => ({ ...prev, users: new Date().toISOString() }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users data");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchRoles(true), fetchUsers(true)]);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching initial data:", error);
          toast.error("Failed to load initial data");
        }
      }
    };
    fetchInitialData();
    return () => controller.abort();
  }, [fetchRoles, fetchUsers]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        roleSearchRef.current &&
        !roleSearchRef.current.contains(event.target)
      ) {
        setRoleSearchTerm("");
        setShowRoleSearch(false);
      }
      if (
        roleAddRef.current &&
        !roleAddRef.current.contains(event.target)
      ) {
        setNewRole("");
        setShowRoleInput(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((role) =>
      role.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase())
    );
  }, [roles, roleSearchTerm]);

  const handleAddRole = useCallback(async () => {
    if (!newRole) {
      toast.error("Please enter a role name");
      return;
    }
    if (
      filteredRoles.some(
        (role) => role.roleName.toLowerCase() === newRole.toLowerCase()
      )
    ) {
      toast.error("Role already exists");
      return;
    }
    try {
      await axios.post(
        `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/addRole/${newRole}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Role added successfully!");
      setRoles((prev) => [...prev, { roleName: newRole }]);
      setNewRole("");
      setShowRoleInput(false);
      setEditingRole(null);
      setEditedRoleName("");
      setRoleSearchTerm("");
      setShowRoleSearch(false);
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error(
        `Failed to add role: ${error.response?.data || error.message}`
      );
    }
  }, [newRole, filteredRoles]);

  const handleDeleteRole = useCallback(
    async (roleName) => {
      if (!roleName) {
        toast.error("Cannot delete this role");
        return;
      }
      if (users.some((emp) => emp.roleName === roleName)) {
        toast.error("Cannot delete role with assigned employees");
        return;
      }
      if (
        !window.confirm(
          `Are you sure you want to delete the role "${roleName}"?`
        )
      )
        return;
      try {
        await axios.delete(
          `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/deleteRole/${roleName}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        toast.success("Role deleted successfully!");
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.roleName !== roleName)
        );
        setEditingRole(null);
        setEditedRoleName("");
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error(
          `Failed to delete role: ${error.response?.data || error.message}`
        );
      }
    },
    [users]
  );

  const handleEditRole = useCallback(
    (roleName) => {
      setEditingRole(roleName);
      setEditedRoleName(roleName);
    },
    []
  );

  const handleSaveRoleEdit = useCallback(
    async (originalRoleName) => {
      if (!editedRoleName || editedRoleName === originalRoleName) {
        toast.error("Please enter a new role name different from the original");
        return;
      }
      if (
        filteredRoles.some(
          (role) =>
            role.roleName.toLowerCase() === editedRoleName.toLowerCase() &&
            role.roleName !== originalRoleName
        )
      ) {
        toast.error("Role name already exists");
        return;
      }
      try {
        await axios.put(
          "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/updateRole",
          {
            OldRoleName: originalRoleName,
            NewRoleName: editedRoleName,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        toast.success("Role updated successfully!");
        setRoles((prev) =>
          prev.map((role) =>
            role.roleName === originalRoleName
              ? { ...role, roleName: editedRoleName }
              : role
          )
        );
        setEditingRole(null);
        setEditedRoleName("");
      } catch (error) {
        console.error("Error updating role:", error);
        toast.error(
          `Failed to update role: ${error.response?.data?.message || error.message}`
        );
      }
    },
    [editedRoleName, filteredRoles]
  );

  const handleCancelRoleEdit = useCallback(() => {
    setEditingRole(null);
    setEditedRoleName("");
    setShowRoleInput(false);
    setShowRoleSearch(false);
  }, []);

  const toggleRoleSearch = useCallback(() => {
    setShowRoleSearch((prev) => !prev);
    setShowRoleInput(false);
    if (!showRoleSearch) {
      setTimeout(() => roleSearchInputRef.current?.focus(), 0);
    } else {
      setRoleSearchTerm("");
    }
  }, [showRoleSearch]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 mt-6">
        <h3 className="text-2xl font-semibold text-gray-800">Manage Roles</h3>
        <div className="flex items-center gap-4">
          {!showRoleInput ? (
            <button
              onClick={() => {
                setShowRoleInput(true);
                setShowRoleSearch(false);
                setTimeout(() => roleAddInputRef.current?.focus(), 0);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center gap-2"
              disabled={isRolesLoading}
            >
              <MdAdd className="w-5 h-5" /> Add
            </button>
          ) : (
            <div ref={roleAddRef} className="relative">
              <div className="flex items-center gap-2">
                <input
                  ref={roleAddInputRef}
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddRole()}
                  placeholder="Enter role name"
                  className="p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {newRole && (
                  <button
                    onClick={() => setNewRole("")}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear input"
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={handleAddRole}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  disabled={isRolesLoading}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          {!showRoleSearch ? (
            <button
              onClick={toggleRoleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 font-medium flex items-center gap-2"
              disabled={isRolesLoading}
            >
              <MdSearch className="w-5 h-5" /> Search
            </button>
          ) : (
            <div ref={roleSearchRef} className="relative w-64">
              <input
                ref={roleSearchInputRef}
                type="text"
                value={roleSearchTerm}
                onChange={(e) => debouncedSetRoleSearchTerm(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                aria-label="Search roles"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                onClick={() => {
                  setRoleSearchTerm("");
                  setShowRoleSearch(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {isRolesLoading ? (
          <p>Loading roles...</p>
        ) : filteredRoles.length > 0 ? (
          <div className="overflow-x-auto shadow-md rounded-lg max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider sticky top-0">
                  <th className="p-3 text-left font-semibold">Role Name</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr
                    key={role.roleName}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-gray-800">
                      {editingRole === role.roleName ? (
                        <input
                          type="text"
                          value={editedRoleName}
                          onChange={(e) => setEditedRoleName(e.target.value)}
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isRolesLoading}
                        />
                      ) : (
                        role.roleName
                      )}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      {editingRole === role.roleName ? (
                        <>
                          <button
                            onClick={() => handleSaveRoleEdit(role.roleName)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200 save-button"
                            disabled={isRolesLoading}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelRoleEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition duration-200 cancel-button"
                            disabled={isRolesLoading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditRole(role.roleName)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center justify-center edit-button"
                            disabled={isRolesLoading}
                          >
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.roleName)}
                            className={`bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200 delete-button ${
                              isRolesLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isRolesLoading}
                            aria-label={`Delete role ${role.roleName}`}
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            {roleSearchTerm
              ? "No roles match your search."
              : "No roles available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageRolesView;Ԇ"(df827892e37d4c420fb7f81b9f959ede8bab66d92�file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Admin/ManageRolesView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final