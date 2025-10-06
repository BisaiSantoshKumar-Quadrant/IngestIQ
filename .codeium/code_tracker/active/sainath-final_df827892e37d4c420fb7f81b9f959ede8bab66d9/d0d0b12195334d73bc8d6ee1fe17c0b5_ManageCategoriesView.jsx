ƒ¤import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ManageCategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [sortColumn, setSortColumn] = useState("userCount");
  const [sortDirection, setSortDirection] = useState("desc");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const categoryAddRef = useRef(null);
  const categoryAddInputRef = useRef(null);
  const categorySearchInputRef = useRef(null);
  const tableRef = useRef(null);

  console.log("Render with categorySearchTerm:", categorySearchTerm, "editingCategory:", editingCategory, "users:", users);

  const debouncedSetCategorySearchTerm = useCallback(
    debounce((value) => {
      console.log("Debounced update to categorySearchTerm:", value);
      setCategorySearchTerm(value);
    }, 300),
    []
  );

  const fetchCategories = useCallback(async (force = false) => {
    if (!force) return;
    setIsCategoriesLoading(true);
    try {
      const response = await axios.get(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/getCategories",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Categories API response:", response.data);
      const filteredCategories = Array.isArray(response.data)
        ? response.data.filter((cat) => cat !== "Management")
        : [];
      filteredCategories.unshift("All");
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error.response ? error.response.data : error.message);
      toast.error("Failed to load categories");
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const response = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Users API response:", response.data);
      const formattedUsers = response.data.map((user) => ({
        ...user,
        lastActive: user.lastActive || new Date().toISOString(),
        dateJoined: user.dateJoined || new Date().toISOString(),
        categoryName: user.categoryName || user.CategoryName || user.category || "Unknown",
      }));
      console.log("Formatted users:", formattedUsers);
      if (formattedUsers.length === 0) {
        console.warn("No users fetched from API");
      }
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error.response ? error.response.data : error.message);
      toast.error("Failed to load users data");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInitialData = async () => {
      try {
        await Promise.all([fetchCategories(true), fetchUsers()]);
        console.log("Initial data fetch completed, users:", users, "categories:", categories);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching initial data:", error);
          toast.error("Failed to load initial data");
        }
      }
    };
    fetchInitialData();
    return () => controller.abort();
  }, [fetchCategories, fetchUsers]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const isClickInsideTable = tableRef.current && tableRef.current.contains(event.target);
      const isClickOnActionButton = event.target.closest('.edit-button') || event.target.closest('.delete-button') || event.target.closest('.save-button') || event.target.closest('.cancel-button');

      if (
        showCategoryInput &&
        categoryAddRef.current &&
        !categoryAddRef.current.contains(event.target) &&
        !isClickInsideTable &&
        !isClickOnActionButton
      ) {
        setNewCategory("");
        setShowCategoryInput(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showCategoryInput]);

  const filteredCategories = useMemo(() => {
    console.log("Re-computing filteredCategories with search term:", categorySearchTerm, "editingCategory:", editingCategory, "users:", users, "categories:", categories);
    let filtered = categories
      .filter(
        (cat) =>
          cat !== "All" &&
          cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
      )
      .map((cat) => ({
        name: cat,
        userCount: users.filter((user) =>
          user.categoryName && user.categoryName.toLowerCase() === cat.toLowerCase()
        ).length,
      }));

    filtered.sort((a, b) => {
      if (sortColumn === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortDirection === "asc"
        ? a.userCount - b.userCount
        : b.userCount - a.userCount;
    });
    return filtered;
  }, [categories, categorySearchTerm, users, sortColumn, sortDirection, refreshTrigger]);

  const handleAddCategory = useCallback(async () => {
    if (!newCategory) {
      toast.error("Please enter a category name");
      return;
    }
    if (
      categories.some(
        (cat) => cat.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      toast.error("Category already exists");
      return;
    }
    try {
      await axios.post(
        `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/addCategory/${newCategory}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Category added successfully!");
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory("");
      setShowCategoryInput(false);
      setEditingCategory(null);
      setEditedCategoryName("");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding category:", error.response ? error.response.data : error.message);
      toast.error(
        `Failed to add category: ${error.response?.data || error.message}`
      );
    }
  }, [newCategory, categories]);

  const handleDeleteCategory = useCallback(
    async (categoryName) => {
      if (
        !categoryName ||
        categoryName === "All" ||
        categoryName === "Management"
      ) {
        toast.error("Cannot delete this category");
        return;
      }
      if (users.some((emp) => emp.categoryName === categoryName)) {
        toast.error("Cannot delete category with assigned employees");
        return;
      }
      if (
        !window.confirm(
          `Are you sure you want to delete the category "${categoryName}"?`
        )
      )
        return;
      try {
        await axios.delete(
          `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/deleteCategory/${categoryName}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        toast.success("Category deleted successfully!");
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat !== categoryName)
        );
        setEditingCategory(null);
        setEditedCategoryName("");
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting category:", error.response ? error.response.data : error.message);
        toast.error(
          `Failed to delete category: ${error.response?.data || error.message}`
        );
      }
    },
    [users]
  );

  const handleEditCategory = useCallback(
    (categoryName) => {
      console.log("Starting edit for:", categoryName, "current search term:", categorySearchTerm);
      setEditingCategory(categoryName);
      setEditedCategoryName(categoryName);
    },
    [categorySearchTerm]
  );

  const handleSaveCategoryEdit = useCallback(
    async (originalCategoryName) => {
      if (!editedCategoryName || editedCategoryName === originalCategoryName) {
        toast.error(
          "Please enter a new category name different from the original"
        );
        return;
      }
      if (
        categories.some(
          (cat) =>
            cat.toLowerCase() === editedCategoryName.toLowerCase() &&
            cat !== originalCategoryName
        )
      ) {
        toast.error("Category name already exists");
        return;
      }
      try {
        await axios.put(
          "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/Employees/updateCategory",
          {
            OldCategoryName: originalCategoryName,
            NewCategoryName: editedCategoryName,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        toast.success("Category updated successfully!");
        setCategories((prev) =>
          prev.map((cat) =>
            cat === originalCategoryName ? editedCategoryName : cat
          )
        );
        // Update users' categoryName to reflect the new category name
        setUsers((prev) =>
          prev.map((user) =>
            user.categoryName === originalCategoryName
              ? { ...user, categoryName: editedCategoryName }
              : user
          )
        );
        setEditingCategory(null);
        setEditedCategoryName("");
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error updating category:", error.response ? error.response.data : error.message);
        toast.error(
          `Failed to update category: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    [editedCategoryName, categories]
  );

  const handleCancelCategoryEdit = useCallback(() => {
    setEditingCategory(null);
    setEditedCategoryName("");
    setShowCategoryInput(false);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleCategorySort = useCallback(
    (column) => {
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
      setRefreshTrigger((prev) => prev + 1);
    },
    [sortColumn, sortDirection]
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 mt-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Manage Categories
        </h3>
        <div className="flex items-center gap-4">
          {!showCategoryInput ? (
            <button
              onClick={() => {
                setShowCategoryInput(true);
                setTimeout(() => categoryAddInputRef.current?.focus(), 0);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center gap-2"
              disabled={isCategoriesLoading || isUsersLoading}
            >
              <MdAdd className="w-5 h-5" /> Add
            </button>
          ) : (
            <div ref={categoryAddRef} className="relative">
              <div className="flex items-center gap-2">
                <input
                  ref={categoryAddInputRef}
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Enter category name"
                  className="p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {newCategory && (
                  <button
                    onClick={() => setNewCategory("")}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Clear input"
                  >
                    âœ•
                  </button>
                )}
                <button
                  onClick={handleAddCategory}
                  className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                  disabled={isCategoriesLoading || isUsersLoading}
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
          <div className="relative w-64">
            <input
              ref={categorySearchInputRef}
              type="text"
              value={categorySearchTerm}
              onChange={(e) => debouncedSetCategorySearchTerm(e.target.value)}
              placeholder="Search categories..."
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
            {categorySearchTerm && (
              <button
                onClick={() => setCategorySearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                âœ•
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {isCategoriesLoading || isUsersLoading ? (
          <p>Loading categories and users...</p>
        ) : filteredCategories.length > 0 ? (
          <div ref={tableRef} className="overflow-x-auto shadow-md rounded-lg max-h-[300px] overflow-y-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider sticky top-0">
                  <th
                    className="p-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleCategorySort("name")}
                  >
                    Category Name{" "}
                    {sortColumn === "name" &&
                      (sortDirection === "asc" ? "â†‘" : "â†“")}
                  </th>
                  <th
                    className="p-3 text-left font-semibold cursor-pointer"
                    onClick={() => handleCategorySort("userCount")}
                  >
                    User Count{" "}
                    {sortColumn === "userCount" &&
                      (sortDirection === "asc" ? "â†‘" : "â†“")}
                  </th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.name}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-gray-800">
                      {editingCategory === cat.name ? (
                        <input
                          type="text"
                          value={editedCategoryName}
                          onChange={(e) => setEditedCategoryName(e.target.value)}
                          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isCategoriesLoading || isUsersLoading}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="p-3 text-gray-800">{cat.userCount}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      {editingCategory === cat.name ? (
                        <>
                          <button
                            onClick={() => handleSaveCategoryEdit(cat.name)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200 save-button"
                            disabled={isCategoriesLoading || isUsersLoading}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelCategoryEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition duration-200 cancel-button"
                            disabled={isCategoriesLoading || isUsersLoading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditCategory(cat.name)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center justify-center edit-button"
                            disabled={
                              isCategoriesLoading || isUsersLoading || cat.name === "Management"
                            }
                          >
                            <MdEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.name)}
                            className={`bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-200 delete-button ${
                              isCategoriesLoading || isUsersLoading || cat.name === "Management"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={
                              isCategoriesLoading || isUsersLoading || cat.name === "Management"
                            }
                            aria-label={`Delete category ${cat.name}`}
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
            {categorySearchTerm
              ? "No categories match your search."
              : "No categories available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageCategoriesView;ƒ¤"(df827892e37d4c420fb7f81b9f959ede8bab66d92²file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Admin/ManageCategoriesView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final