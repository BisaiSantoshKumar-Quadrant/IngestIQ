§Ù// UploadView_WithAI.jsx
import { useRef, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";

const UploadView = ({
  topic,
  setTopic,
  description,
  setDescription,
  category,
  setCategory,
  categories,
  file,
  setFile,
  preview,
  setPreview,
  isUploading,
  setIsUploading,
  isUploaded,
  setIsUploaded,
  examDuration,
  setExamDuration,
  passPercentage,
  setPassPercentage,
  reattemptCount,
  setReattemptCount,
  totalQuestions,
  setTotalQuestions,
  showUploadedExams,
  setShowUploadedExams,
  allExams,
  setAllExams,
  examSearchTerm,
  setExamSearchTerm,
  isExamSearchOpen,
  setIsExamSearchOpen,
  editingExamId,
  setEditingExamId,
  questionsToEdit,
  setQuestionsToEdit,
  handleFileChange,
  handleUpload,
  handleSliderChange,
  handleDurationChange,
  handlePassPercentageChange,
  toggleUploadedExams,
  toggleExamSearch,
  fetchQuestionsToEdit,
  saveEditedQuestions,
  handleDeleteAssessment,
  isExamAttempted,
  examSearchRef,
  examSearchInputRef,
  loading,
}) => {
  const fileInputRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("easy");
  const [aiQuestionCount, setAiQuestionCount] = useState(5);

  const handleGenerateCSV = async () => {
    if (!aiTopic || aiQuestionCount <= 0) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          count: aiQuestionCount,
        }),
      });

      const data = await res.json();
      const questions = data.questions;

      const headers = ["question name", "option1", "option2", "option3", "option4", "solution"];
      const rows = questions.map((q) => [
        q.question,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        q.answer,
      ]);

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const generatedFile = new File([blob], `${aiTopic}_ai_questions.csv`, { type: "text/csv" });

      setFile(generatedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsed = text.split("\n").map((row) => row.split(","));
        setPreview(parsed);
      };
      reader.readAsText(generatedFile);

      toast.success("AI-generated questions loaded!");
      setShowGenerateForm(false);
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to generate questions with AI.");
    }
  };

  const filteredExams = allExams
    .filter(
      (exam) =>
        exam.topic.toLowerCase().includes(examSearchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(examSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === "createdAt") {
        const aValue = a.createdAt || a.assessmentId;
        const bValue = b.createdAt || b.assessmentId;
        return sortConfig.direction === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      } else {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
    });

  const requiredScore = totalQuestions > 0 ? Math.ceil((passPercentage / 100) * (totalQuestions - 1)) : 0;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Upload Exam Questions</h3>
        <button
          onClick={toggleUploadedExams}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showUploadedExams ? "Back to Upload" : "View Uploaded Exams"}
        </button>
      </div>

      {!showUploadedExams && !editingExamId ? (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <button
            onClick={() => setShowGenerateForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
          >
            Generate Questions using AI
          </button>

          {showGenerateForm && (
            <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
              <h4 className="font-semibold text-lg mb-2">AI Question Generator</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Enter Topic"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="p-2 border rounded"
                />
                <select
                  value={aiDifficulty}
                  onChange={(e) => setAiDifficulty(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={aiQuestionCount}
                  onChange={(e) => setAiQuestionCount(Number(e.target.value))}
                  className="p-2 border rounded"
                  placeholder="No. of Questions"
                />
              </div>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={handleGenerateCSV}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Generate & Upload
                </button>
                <button
                  onClick={() => setShowGenerateForm(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="topic" className="block mb-2 font-medium">
              Exam Topic:
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter exam topic"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">
              Description:
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter exam description"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block mb-2 font-medium">
              Select Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="fileInput" className="block mb-2 font-medium">
              Select CSV File:
            </label>
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="duration" className="block mb-2 font-medium">
              Exam Duration (minutes):
            </label>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={examDuration}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 min</span>
                  <span>45 min</span>
                  <span>80 min</span>
                  <span>120 min</span>
                </div>
              </div>
              <div className="w-20">
                <input
                  id="duration"
                  type="number"
                  min="5"
                  max="120"
                  value={examDuration}
                  onChange={handleDurationChange}
                  className="w-full p-2 border border-gray-300 rounded text-center"
                />
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-blue-800">Exam Duration</p>
                  <p className="text-sm text-gray-600">
                    Students will have {examDuration} minutes to complete this exam.
                  </p>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.floor(examDuration / 60) > 0 ? `${Math.floor(examDuration / 60)}h ` : ""}
                  {examDuration % 60}m
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="passPercentage" className="block mb-2 font-medium">
              Pass Percentage (%):
            </label>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="w-20">
                <input
                  id="passPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={passPercentage}
                  onChange={handlePassPercentageChange}
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  placeholder="%"
                />
              </div>
              <div className="flex-1">
                {totalQuestions > 0 && (
                  <p className="text-sm text-gray-600">
                    Required Score: {requiredScore} out of {totalQuestions - 1} questions
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">Passing Criteria</p>
                  <p className="text-sm text-gray-600">
                    Students need {passPercentage}% ({requiredScore}/{totalQuestions === 0 ? 0 : totalQuestions - 1}) to pass this exam
                  </p>
                </div>
                <div className="text-2xl font-bold text-green-700">{passPercentage}%</div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="reattemptCount" className="block mb-2 font-medium">
              Attempt Count:
            </label>
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div className="w-20">
                <input
                  id="reattemptCount"
                  type="number"
                  min="1"
                  max="10"
                  value={reattemptCount}
                  onChange={(e) => setReattemptCount(Math.max(0, Math.min(10, Number(e.target.value))))}
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Students can attempt this exam {reattemptCount} time{reattemptCount !== 1 ? "s" : ""}.
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-yellow-800">Attempt Limit</p>
                  <p className="text-sm text-gray-600">
                    Total number of attempts allowed: {reattemptCount}
                  </p>
                </div>
                <div className="text-2xl font-bold text-yellow-700">{reattemptCount}</div>
              </div>
            </div>
          </div>

          {preview.length > 0 && !isUploaded && (
            <div className="mt-4 mb-4 overflow-x-auto">
              <h4 className="font-medium mb-2">File Preview:</h4>
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    {preview[0].map((header, index) => (
                      <th key={index} className="border p-2 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(1, 11).map(
                    (row, rowIndex) =>
                      row.some((cell) => cell.trim() !== "") && (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : ""}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border p-2">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || isUploading || isUploaded}
            className="mt-4 px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : isUploaded ? "Uploaded Successfully" : "Upload Questions"}
          </button>
        </div>
      ) : showUploadedExams && !editingExamId ? (
        <div>
          <div className="relative mb-4">
            <h3 className="text-xl font-semibold">Uploaded Exams</h3>
            <div className="flex justify-end mt-2">
              {!isExamSearchOpen ? (
                <button
                  onClick={toggleExamSearch}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
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
                  Search
                </button>
              ) : (
                <div ref={examSearchRef} className="relative w-64">
                  <input
                    ref={examSearchInputRef}
                    type="text"
                    value={examSearchTerm}
                    onChange={(e) => setExamSearchTerm(e.target.value)}
                    placeholder="Search by topic or description..."
                    className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <button
                    onClick={toggleExamSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    âœ•
                  </button>
                </div>
              )}
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : filteredExams.length > 0 ? (
            <>
              <div className="hidden md:block overflow-y-scroll max-h-96 mt-4">
                <table className="w-full border-collapse rounded-lg border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-center">
                      <th
                        className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSort("topic")}
                      >
                        Topic{" "}
                        {sortConfig.key === "topic" &&
                          (sortConfig.direction === "asc" ? "â†‘" : "â†“")}
                      </th>
                      <th
                        className="p-3 font-semibold text-gray-700 border-b border-gray-200 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSort("description")}
                      >
                        Description{" "}
                        {sortConfig.key === "description" &&
                          (sortConfig.direction === "asc" ? "â†‘" : "â†“")}
                      </th>
                      <th className="p-3 font-semibold text-gray-700 border-b border-gray-200">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExams.map((exam) => (
                      <tr
                        key={exam.assessmentId}
                        className="border-b border-gray-200 text-center hover:bg-gray-50"
                      >
                        <td className="p-3 text-gray-800">{exam.topic}</td>
                        <td className="p-3 text-gray-800">{exam.description}</td>
                        <td className="p-3">
                          {!isExamAttempted(exam.assessmentId) && (
                            <button
                              onClick={() => fetchQuestionsToEdit(exam.assessmentId)}
                              className="inline-flex items-center justify-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              title="Edit Exam"
                            >
                              <MdEdit className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDeleteAssessment(exam.assessmentId, e)}
                            className="inline-flex items-center justify-center bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Delete Exam"
                          >
                            <MdDelete className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden max-h-96 overflow-y-scroll space-y-4">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.assessmentId}
                    className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    <div className="mb-2">
                      <span className="font-semibold">Topic: </span>
                      <span>{exam.topic}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Description: </span>
                      <span>{exam.description}</span>
                    </div>
                    <div className="flex gap-2">
                      {!isExamAttempted(exam.assessmentId) && (
                        <button
                          onClick={() => fetchQuestionsToEdit(exam.assessmentId)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteAssessment(exam.assessmentId, e)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 mt-2">
              {examSearchTerm ? "No exams found matching your search." : "No exams found in the database."}
            </p>
          )}
        </div>
      ) : editingExamId ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Questions</h3>
          {questionsToEdit.map((question, index) => (
            <div key={question.questionID} className="mb-4 p-4 border rounded">
              <h4 className="font-semibold mb-2">Question {index + 1}</h4>
              <div className="flex items-center mb-2">
                <label className="font-medium w-12">Qns:</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => {
                    const newQuestions = [...questionsToEdit];
                    newQuestions[index].questionText = e.target.value;
                    setQuestionsToEdit(newQuestions);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter question text"
                />
              </div>
              {["optionA", "optionB", "optionC", "optionD"].map((option, optIndex) => (
                <div key={option} className="flex items-center mb-2">
                  <label className="font-medium w-12">{String.fromCharCode(65 + optIndex)}:</label>
                  <input
                    type="text"
                    value={question[option]}
                    onChange={(e) => {
                      const newQuestions = [...questionsToEdit];
                      newQuestions[index][option] = e.target.value;
                      setQuestionsToEdit(newQuestions);
                    }}
                    className="flex-1 p-2 border rounded"
                    placeholder={`Enter option ${String.fromCharCode(65 + optIndex)}`}
                  />
                </div>
              ))}
              <div className="flex items-center mb-2">
                <label className="font-medium w-12">Ans:</label>
                <input
                  type="text"
                  value={question.correctAns}
                  onChange={(e) => {
                    const newQuestions = [...questionsToEdit];
                    newQuestions[index].correctAns = e.target.value;
                    setQuestionsToEdit(newQuestions);
                  }}
                  className="flex-1 p-2 border rounded"
                  placeholder="Enter correct answer"
                />
              </div>
            </div>
          ))}
          <div className="flex gap-4">
            <button
              onClick={saveEditedQuestions}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingExamId(null);
                setQuestionsToEdit([]);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadView;• •œ
œ¦ ¦¨
¨ñ ñó
óÇ# Ç#È#
È#¸4 ¸4§Ù 2Gfile:///c:/Users/BisaiSantoshKumar%28Qu/Downloads/UploadView_WithAI.jsx