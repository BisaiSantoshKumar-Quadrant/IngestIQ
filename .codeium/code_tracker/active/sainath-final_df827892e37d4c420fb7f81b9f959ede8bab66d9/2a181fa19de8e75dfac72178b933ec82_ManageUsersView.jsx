˜Ýimport React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};


const ManageUsersView = () => {
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterRoles, setFilterRoles] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilterSearch, setCategoryFilterSearch] = useState("");
  const [userSortColumn, setUserSortColumn] = useState(null);
  const [userSortDirection, setUserSortDirection] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedRole, setSelectedRole] = useState({});
  const [lastFetched, setLastFetched] = useState({
    users: null,
    categories: null,
    roles: null,
  });

  const userSearchRef = useRef(null);
  const filterRef = useRef(null);
  const userSearchInputRef = useRef(null);

  const isDataFresh = (timestamp) => {
    if (!timestamp) return false;
    const now = new Date();
    const lastFetchedTime = new Date(timestamp);
    return now - lastFetchedTime < 300000; // 5 minutes
  };

  const debouncedSetUserSearchTerm = useCallback(
    debounce((value) => setUserSearchTerm(value), 300),
    []
  );

  const fetchUsers = useCallback(async (force = false) => {
    if (!force && isDataFresh(lastFetched.users)) return;
    setIsUsersLoading(true);
    try {
      const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const usersData = response.data.map((user) => ({
        ...user,
        lastActive: user.lastActive || new Date().toISOString(),
        dateJoined: user.dateJoined || new Date().toISOString(),
      }));
      setUsers(usersData);
      const initialCategories = {};
      const initialRoles = {};
      usersData.forEach((emp) => {
        initialCategories[emp.email] = emp.category || "";
        initialRoles[emp.email] = emp.roleName || "";
      });
      setSelectedCategory(initialCategories);
      setSelectedRole(initialRoles);
      setLastFetched((prev) => ({ ...prev, users: new Date().toISOString() }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users data");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (force = false) => {
    if (!force && isDataFresh(lastFetched.categories)) return;
    try {
      const response = await axios.get(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/getCategories",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const filteredCategories = Array.isArray(response.data)
        ? response.data.filter((cat) => cat !== "Management")
        : [];
      filteredCategories.unshift("All");
      setCategories(filteredCategories);
      setLastFetched((prev) => ({
        ...prev,
        categories: new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  const fetchRoles = useCallback(async (force = false) => {
    if (!force && isDataFresh(lastFetched.roles)) return;
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
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchUsers(true),
          fetchCategories(true),
          fetchRoles(true),
        ]);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching initial data:", error);
          toast.error("Failed to load initial data");
        }
      }
    };
    fetchInitialData();
    return () => controller.abort();
  }, [fetchUsers, fetchCategories, fetchRoles]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        event.target.closest(".delete-button") ||
        event.target.closest("select") ||
        event.target.closest(".user-row") ||
        event.target.closest(".filter-dropdown")
      )
        return;

      if (
        userSearchRef.current &&
        !userSearchRef.current.contains(event.target)
      ) {
        setUserSearchTerm("");
      }
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
        setCategoryFilterSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isFilterOpen]);

  const filteredUsers = useMemo(() => {
    const lowerSearchTerm = userSearchTerm.toLowerCase();
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        user.username.toLowerCase().includes(lowerSearchTerm);
      const matchesCategoryFilter =
        filterCategories.length === 0 ||
        filterCategories.includes(user.category);
      const matchesRoleFilter =
        filterRoles.length === 0 || filterRoles.includes(user.roleName);
      return matchesSearch && matchesCategoryFilter && matchesRoleFilter;
    });

    if (userSortColumn) {
      filtered.sort((a, b) => {
        let valueA = a[userSortColumn] || "";
        let valueB = b[userSortColumn] || "";
        if (typeof valueA === "string") valueA = valueA.toLowerCase();
        if (typeof valueB === "string") valueB = valueB.toLowerCase();
        return userSortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }
    return filtered;
  }, [
    users,
    userSearchTerm,
    userSortColumn,
    userSortDirection,
    filterCategories,
    filterRoles,
  ]);

  const filteredFilterCategories = useMemo(
    () =>
      categories
        .filter(
          (cat) =>
            cat !== "All" &&
            cat.toLowerCase().includes(categoryFilterSearch.toLowerCase())
        )
        .filter((cat) => cat !== "Management"),
    [categories, categoryFilterSearch]
  );

  const handleDeleteUser = useCallback(
    async (email) => {
      if (!window.confirm(`Are you sure you want to delete user ${email}?`))
        return;
      try {
        const response = await axios.delete(
          `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/DeleteEmployee/${email}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200 || response.status === 204) {
          toast.success(response.data?.message || "User deleted successfully!");
          setUsers((prev) => prev.filter((user) => user.email !== email));
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    },
    []
  );

  const handleCategoryChange = useCallback(
    (email, category) =>
      setSelectedCategory((prev) => ({ ...prev, [email]: category })),
    []
  );

  const handleRoleChange = useCallback(
    (email, roleName) =>
      setSelectedRole((prev) => ({ ...prev, [email]: roleName })),
    []
  );

  const handleSubmitCategoryChange = useCallback(
    async (email) => {
      const category = selectedCategory[email];
      if (!category) {
        toast.error("Please select a category");
        return;
      }
      try {
        const response = await axios.put(
          "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/update-category",
          { Email: email, CategoryName: category },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (response.status === 204) {
          toast.success("Category updated successfully!");
          setUsers((prev) =>
            prev.map((emp) => (emp.email === email ? { ...emp, category } : emp))
          );
        }
      } catch (error) {
        console.error("Error updating category:", error);
        toast.error(error.response?.data?.message || "Failed to update category");
      }
    },
    [selectedCategory]
  );

  const handleSubmitRoleChange = useCallback(
    async (email) => {
      const roleName = selectedRole[email];
      if (!roleName) {
        toast.error("Please select a role");
        return;
      }
      try {
        const response = await axios.put(
          "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/submit",
          { Email: email, RoleName: roleName },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        if (response.status === 204) {
          toast.success("Role updated successfully!");
          setUsers((prev) =>
            prev.map((emp) => (emp.email === email ? { ...emp, roleName } : emp))
          );
        }
      } catch (error) {
        console.error("Error updating role:", error);
        toast.error(error.response?.data?.message || "Failed to update role");
      }
    },
    [selectedRole]
  );

  const handleSubmit = useCallback(
    async (email) => {
      const currentUser = users.find((emp) => emp.email === email);
      const newCategory = selectedCategory[email];
      const newRole = selectedRole[email];
      const currentCategory = currentUser.category || "";
      const currentRole = currentUser.roleName || "";

      if (newCategory && newCategory !== currentCategory)
        await handleSubmitCategoryChange(email);
      if (newRole && newRole !== currentRole) await handleSubmitRoleChange(email);
      if (
        (!newCategory || newCategory === currentCategory) &&
        (!newRole || newRole === currentRole)
      ) {
        toast.info(
          "No changes detected. Please select a different category or role to update."
        );
      }
    },
    [
      users,
      selectedCategory,
      selectedRole,
      handleSubmitCategoryChange,
      handleSubmitRoleChange,
    ]
  );

  const toggleUserSearch = useCallback(() => {
    setUserSearchTerm("");
    setTimeout(() => userSearchInputRef.current?.focus(), 0);
  }, []);

  const handleUserSort = useCallback(
    (column) => {
      if (userSortColumn === column) {
        setUserSortDirection(userSortDirection === "asc" ? "desc" : "asc");
      } else {
        setUserSortColumn(column);
        setUserSortDirection("asc");
      }
    },
    [userSortColumn, userSortDirection]
  );

  const toggleFilter = useCallback(() => setIsFilterOpen((prev) => !prev), []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Manage Users</h3>
        <div className="flex items-center gap-4">
          <div className="relative" ref={filterRef}>
            <button
              onClick={toggleFilter}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm h-10 flex items-center justify-center gap-2"
            >
              <FaFilter className="w-4 h-4" /> Filter by
              {(filterCategories.length + filterRoles.length > 0) && (
                <span className="bg-green-500 text-white rounded-full p-1 px-2 flex items-center justify-center text-xs">
                  {filterCategories.length + filterRoles.length}
                </span>
              )}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg p-4 z-10 filter-dropdown">
                <div className="absolute bottom-2 right-2">
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => {
                      setFilterCategories([]);
                      setFilterRoles([]);
                      setCategoryFilterSearch("");
                    }}
                  >
                    Clear
                  </span>
                </div>
                <div className="mb-2">
                  <h4 className="font-semibold">Categories</h4>
                  <input
                    type="text"
                    value={categoryFilterSearch}
                    onChange={(e) => setCategoryFilterSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="max-h-40 overflow-y-auto">
                    {filteredFilterCategories.map((cat) => (
                      <div key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filterCategories.includes(cat)}
                          onChange={() => {
                            setFilterCategories((prev) =>
                              prev.includes(cat)
                                ? prev.filter((c) => c !== cat)
                                : [...prev, cat]
                            );
                          }}
                          className="mr-2"
                        />
                        <label>{cat}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Roles</h4>
                  {roles.map((role) => (
                    <div key={role.roleName} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filterRoles.includes(role.roleName)}
                        onChange={() => {
                          setFilterRoles((prev) =>
                            prev.includes(role.roleName)
                              ? prev.filter((r) => r !== role.roleName)
                              : [...prev, role.roleName]
                          );
                        }}
                        className="mr-2"
                      />
                      <label>{role.roleName}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div ref={userSearchRef} className="relative w-64">
            <input
              ref={userSearchInputRef}
              type="text"
              value={userSearchTerm}
              onChange={(e) => debouncedSetUserSearchTerm(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
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
            {userSearchTerm && (
              <button
                onClick={toggleUserSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                âœ•
              </button>
            )}
          </div>
        </div>
      </div>
      {isUsersLoading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <>
          <div className="shadow-lg rounded-lg overflow-hidden hidden md:block">
            <div className="overflow-y-auto max-h-96">
              <table className="w-full bg-white">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-gray-600 text-sm uppercase tracking-wider">
                    <th
                      className="p-4 text-left font-semibold cursor-pointer"
                      onClick={() => handleUserSort("username")}
                    >
                      Name{" "}
                      {userSortColumn === "username" &&
                        (userSortDirection === "asc" ? "â†‘" : "â†“")}
                    </th>
                    <th
                      className="p-4 text-left font-semibold cursor-pointer"
                      onClick={() => handleUserSort("email")}
                    >
                      Email{" "}
                      {userSortColumn === "email" &&
                        (userSortDirection === "asc" ? "â†‘" : "â†“")}
                    </th>
                    <th
                      className="p-4 text-left font-semibold cursor-pointer"
                      onClick={() => handleUserSort("category")}
                    >
                      Category{" "}
                      {userSortColumn === "category" &&
                        (userSortDirection === "asc" ? "â†‘" : "â†“")}
                    </th>
                    <th
                      className="p-4 text-left font-semibold cursor-pointer"
                      onClick={() => handleUserSort("roleName")}
                    >
                      Role{" "}
                      {userSortColumn === "roleName" &&
                        (userSortDirection === "asc" ? "â†‘" : "â†“")}
                    </th>
                    <th className="p-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const hasChanges =
                      (selectedCategory[user.email] &&
                        selectedCategory[user.email] !== (user.category || "")) ||
                      (selectedRole[user.email] &&
                        selectedRole[user.email] !== (user.roleName || ""));
                    return (
                      <tr
                        key={user.email}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="p-4">{user.username}</td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4">
                          <select
                            value={selectedCategory[user.email] || ""}
                            onChange={(e) =>
                              handleCategoryChange(user.email, e.target.value)
                            }
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories
                              .filter((cat) => cat !== "All")
                              .map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={selectedRole[user.email] || ""}
                            onChange={(e) =>
                              handleRoleChange(user.email, e.target.value)
                            }
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {roles.map((role) => (
                              <option
                                key={role.roleName}
                                value={role.roleName}
                              >
                                {role.roleName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => handleSubmit(user.email)}
                            className={`${
                              hasChanges
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 hover:bg-gray-500"
                            } text-white p-2 rounded transition duration-200`}
                            disabled={isUsersLoading}
                            title="Submit Changes"
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
                          <button
                            onClick={() => handleDeleteUser(user.email)}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-200"
                            title="Delete User"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:hidden max-h-96 overflow-y-scroll space-y-4">
            {filteredUsers.map((user) => {
              const hasChanges =
                (selectedCategory[user.email] &&
                  selectedCategory[user.email] !== (user.category || "")) ||
                (selectedRole[user.email] &&
                  selectedRole[user.email] !== (user.roleName || ""));
              return (
                <div
                  key={user.email}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200 user-row"
                >
                  <div className="mb-2">
                    <span className="font-semibold">Email: </span>
                    {user.email}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Name: </span>
                    {user.username}
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Update Category:
                    </label>
                    <select
                      value={selectedCategory[user.email] || ""}
                      onChange={(e) =>
                        handleCategoryChange(user.email, e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                    >
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="font-semibold block mb-1">
                      Update Role:
                    </label>
                    <select
                      value={selectedRole[user.email] || ""}
                      onChange={(e) =>
                        handleRoleChange(user.email, e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded w-full"
                    >
                      {roles.map((role) => (
                        <option key={role.roleName} value={role.roleName}>
                          {role.roleName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSubmit(user.email)}
                      className={`${
                        hasChanges
                          ? "bg-blue-500 hover:bg-blue-700"
                          : "bg-gray-500 hover:bg-gray-600"
                      } text-white px-4 py-2 rounded flex-1 flex items-center justify-center`}
                      disabled={isUsersLoading}
                      title="Submit Changes"
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
                    <button
                      onClick={() => handleDeleteUser(user.email)}
                      className="delete-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1 flex items-center justify-center"
                      title="Delete User"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-2">
          {userSearchTerm
            ? "No users found matching your search."
            : "No users found."}
        </p>
      )}
    </div>
  );
};

export default ManageUsersView;˜Ý"(df827892e37d4c420fb7f81b9f959ede8bab66d92­file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Admin/ManageUsersView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final