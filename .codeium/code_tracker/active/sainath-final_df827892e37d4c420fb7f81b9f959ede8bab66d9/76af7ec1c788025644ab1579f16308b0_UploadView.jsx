’Óimport React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdEdit } from "react-icons/md";
import { useDashboardContext } from "./DashboardContext";

// QuestionGenerator Component
const QuestionGenerator = ({ setFile, setPreview, setGeneratedQuestions, examTopic, examDescription, generatedQuestions, setTotalQuestions }) => {
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false); // Track generation status

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!examTopic || !examDescription || numQuestions <= 0) {
      toast.error("Please fill in all fields with valid values.");
      return;
    }

    setIsGenerating(true); // Disable button
    try {
      const generatedQuestions = await generateQuestions();
      if (generatedQuestions.length === 0) {
        toast.error("No valid questions generated. Please try again.");
        return;
      }
      setGeneratedQuestions(generatedQuestions);

      // Generate CSV with single header
      const headers = ["Question", "Option A", "Option B", "Option C", "Option D", "Answer"];
      const rows = generatedQuestions.map((q) => [
        q.question,
        q.options[0],
        q.options[1],
        q.options[2],
        q.options[3],
        q.answer,
      ]);
      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const generatedFile = new File([blob], `${examTopic}_${examDescription}_ai_questions.csv`, { type: "text/csv" });

      setFile(generatedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsed = text.split("\n").map((row) => row.split(","));
        setPreview(parsed);
        setTotalQuestions(parsed.length - 1);
      };
      reader.readAsText(generatedFile);

      toast.success("AI-generated questions loaded!");
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions with AI.");
    } finally {
      setIsGenerating(false); // Re-enable button
    }
  };

  const generateQuestions = async () => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyASNovrify6psaE2v3py_GInJIuuDNET5M",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Generate ${numQuestions} multiple-choice questions on ${examTopic} focusing on ${examDescription} at ${difficulty} level. Each question should have four options and one correct answer. Format the output as plain CSV text with the following columns: Question,Option A,Option B,Option C,Option D,Answer. Enclose each field in double quotes to handle commas within the text. Each row should represent one question, with the Answer column containing the correct option text. Do not include any headers, code blocks, or extra formatting in the response. Only include the question data rows. Example:
"If What is the capital of France?","London","Paris","Berlin","Rome","Paris"
"If What is 2 + 2?","3","4","5","6","4"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.status === 404) {
        alert("API endpoint not found. Please check the Gemini API endpoint and model name.");
        return [];
      }

      if (response.status === 429) {
        alert("Too many requests. Please try again later.");
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error("No content returned from Gemini API.");
      }

      // Parse the CSV-like response into question objects, filtering out header row
      const lines = generatedText.trim().split("\n");
      const headerPattern = /^Question,Option A,Option B,Option C,Option D,Answer$/;
      return lines
        .filter((line) => !headerPattern.test(line.trim())) // Skip header row
        .map((line) => {
          const [question, optionA, optionB, optionC, optionD, answer] = line.split(",");
          if (question && optionA && optionB && optionC && optionD && answer) {
            return {
              question,
              options: [optionA, optionB, optionC, optionD],
              answer,
            };
          }
          return null;
        })
        .filter((q) => q !== null); // Filter out invalid questions
    } catch (error) {
      console.error("Error generating questions:", error);
      alert(`Error generating questions: ${error.message}. Please check API key and endpoint.`);
      return [];
    }
  };

  const downloadCSV = () => {
    const headers = ["Question", "Option A", "Option B", "Option C", "Option D", "Answer"];
    const rows = generatedQuestions.map((q) => [
      q.question,
      q.options[0],
      q.options[1],
      q.options[2],
      q.options[3],
      q.answer,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${examTopic}_${examDescription}_questions.csv`;
    link.click();
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
      <h4 className="font-semibold text-lg mb-2">AI Question Generator</h4>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Topic Field */}
        <div>
          <label htmlFor="examTopic" className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <input
            id="examTopic"
            type="text"
            value={examTopic}
            readOnly
            className="mt-1 p-2 border rounded bg-gray-200 w-full"
            placeholder="Topic"
            aria-describedby="examTopicHelp"
          />
        </div>
        <div>
          <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            id="examDescription"
            type="text"
            value={examDescription}
            readOnly
            className="mt-1 p-2 border rounded bg-gray-200 w-full"
            placeholder="Description"
            aria-describedby="examDescriptionHelp"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            aria-describedby="difficultyHelp"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div>
          <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
            Number of Questions
          </label>
          <input
            id="numQuestions"
            type="number"
            min="1"
            max="50"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-full"
            placeholder="Enter 1-50"
            aria-describedby="numQuestionsHelp"
          />
        </div>
        <div className="mt-4 flex gap-4 md:col-span-3">
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-4 py-2 rounded font-medium text-white ${
              isGenerating ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
            title="Generate questions and upload them to the system"
          >
            {isGenerating ? "Generating..." : "Generate âœ¨"}
          </button>
          <button
            type="button"
            onClick={downloadCSV}
            disabled={generatedQuestions.length === 0}
            className={`px-4 py-2 rounded font-medium text-white ${
              generatedQuestions.length === 0 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            title="Download the generated questions as a CSV file"
          >
            Download CSV
          </button>
        </div>
      </form>
    </div>
  );
};

// Main UploadView Component
const UploadView = () => {
  const { categories, allExams, setAllExams, allScores, loading: contextLoading } = useDashboardContext();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [examDuration, setExamDuration] = useState(30);
  const [passPercentage, setPassPercentage] = useState(70);
  const [reattemptCount, setReattemptCount] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showUploadedExams, setShowUploadedExams] = useState(false);
  const [examSearchTerm, setExamSearchTerm] = useState("");
  const [isExamSearchOpen, setIsExamSearchOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [questionsToEdit, setQuestionsToEdit] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [examSortColumn, setExamSortColumn] = useState("createdAt"); // Default sort by creation date
  const [examSortDirection, setExamSortDirection] = useState("desc"); // Default descending for recent first
  const [questionConduct, setQuestionConduct] = useState("");
  const fileInputRef = useRef(null);
  const examSearchRef = useRef(null);
  const examSearchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (examSearchRef.current && !examSearchRef.current.contains(event.target)) {
        setIsExamSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== "text/csv") {
      toast.error("Please select a CSV file");
      return;
    }
    setFile(selectedFile);
    setIsUploaded(false);
    setGeneratedQuestions([]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const rows = csvText.split("\n").map((row) => row.split(","));
      setPreview(rows);
      setTotalQuestions(rows.length - 1);
    };
    reader.readAsText(selectedFile);
  }, []);

  const handleUpload = useCallback(async () => {
    if (
      !file ||
      !topic.trim() ||
      !description.trim() ||
      !category ||
      examDuration < 1 ||
      passPercentage < 0 ||
      passPercentage > 100 ||
      reattemptCount < 0
    ) {
      toast.error("Please fill all required fields with valid values");
      return;
    }

    // Validate questionConduct against totalQuestions
    const questionConductNum = Number(questionConduct);
    if (questionConductNum > 0 && questionConductNum > totalQuestions) {
      toast.error("You have exceeded number of questions to conduct compared to uploaded or generated questions.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic", topic);
    formData.append("description", description);
    formData.append("categoryName", category);
    formData.append("examDuration", examDuration);
    formData.append("passPercentage", passPercentage);
    formData.append("reattemptCount", reattemptCount);
    formData.append("questionConduct", questionConduct); // Added questionConduct to formData
    try {
      const response = await axios.post("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/question-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        toast.success("Questions uploaded successfully!");
        setTopic("");
        setDescription("");
        setCategory("");
        setFile(null);
        setExamDuration(30);
        setPassPercentage(70);
        setReattemptCount(1);
        setQuestionConduct(""); // Reset questionConduct
        setPreview([]);
        setGeneratedQuestions([]);
        setTotalQuestions(0);
        setIsUploaded(false);
        setShowGenerateForm(false);
        fileInputRef.current.value = "";
        const examsRes = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/all-assessments", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAllExams(examsRes.data);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed!");
    } finally {
      setIsUploading(false);
    }
  }, [file, topic, description, category, examDuration, passPercentage, reattemptCount, questionConduct, totalQuestions, setAllExams]);

  const fetchQuestionsToEdit = async (examId) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/EditAssessment/${examId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setQuestionsToEdit(response.data);
      setEditingExamId(examId);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to load questions for editing");
    } finally {
      setLoading(false);
    }
  };

  const saveEditedQuestions = async () => {
    if (!questionsToEdit || questionsToEdit.length === 0) {
      toast.error("No questions to save");
      return;
    }

    const formattedQuestions = questionsToEdit.map((q) => ({
      QuestionID: q.questionID || 0,
      ExamID: q.examID || editingExamId,
      QuestionText: q.questionText,
      OptionA: q.optionA,
      OptionB: q.optionB,
      OptionC: q.optionC,
      OptionD: q.optionD,
      CorrectAns: q.correctAns,
    }));

    setLoading(true);
    try {
      const response = await axios.post(
        "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/updateQuestions",
        formattedQuestions,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      setEditingExamId(null);
      setQuestionsToEdit([]);
      const examsRes = await axios.get("https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/all-assessments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAllExams(examsRes.data);
    } catch (error) {
      console.error("Error updating questions:", error);
      toast.error(error.response?.data?.message || "Failed to update questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete assessment ID ${assessmentId}?`)) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api/assessment/deleteExam/${assessmentId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Assessment deleted successfully!");
        setAllExams((prev) => prev.filter((exam) => exam.assessmentId !== assessmentId));
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error(error.response?.data?.message || "Failed to delete assessment");
    } finally {
      setLoading(false);
    }
  };

  const isExamAttempted = (examId) => {
    return allScores.some((score) => score.assessmentID === examId);
  };

  const toggleUploadedExams = () => {
    setShowUploadedExams((prev) => !prev);
    setEditingExamId(null);
    setQuestionsToEdit([]);
  };

  const toggleExamSearch = () => {
    setIsExamSearchOpen((prev) => !prev);
    if (!isExamSearchOpen) setTimeout(() => examSearchInputRef.current?.focus(), 0);
  };

  const handleSliderChange = (e) => setExamDuration(Number(e.target.value));
  const handleDurationChange = (e) =>
    setExamDuration(Math.max(5, Math.min(120, Number(e.target.value))));
  const handlePassPercentageChange = (e) =>
    setPassPercentage(Math.max(0, Math.min(100, Number(e.target.value))));

  const handleExamSort = (column) => {
    if (examSortColumn === column) {
      setExamSortDirection(examSortDirection === "asc" ? "desc" : "asc");
    } else {
      setExamSortColumn(column);
      setExamSortDirection("asc");
    }
  };

  const sortedExams = [...allExams].sort((a, b) => {
    const direction = examSortDirection === "asc" ? 1 : -1;
    if (examSortColumn === "topic") {
      return direction * a.topic.localeCompare(b.topic);
    } else if (examSortColumn === "description") {
      return direction * a.description.localeCompare(b.description);
    } else if (examSortColumn === "createdAt") {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : a.assessmentId;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : b.assessmentId;
      return direction * (bTime - aTime); // Descending for recent first
    }
    return 0;
  });

  const filteredExams = sortedExams.filter(
    (exam) =>
      exam.topic.toLowerCase().includes(examSearchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(examSearchTerm.toLowerCase())
  );

  const requiredScore = totalQuestions > 0 ? Math.ceil((passPercentage / 100) * totalQuestions) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {editingExamId ? "Edit Exam Questions" : "Upload Exam Questions"}
        </h3>
        <button
          onClick={toggleUploadedExams}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showUploadedExams ? "Back to Upload" : "View Uploaded Exams"}
        </button>
      </div>
      {(contextLoading || loading) && <p className="text-gray-500">Loading...</p>}
      {!contextLoading && !loading && !showUploadedExams && !editingExamId ? (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
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
              {categories
                .filter((cat) => cat !== "All")
                .map((cat) => (
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
            <div className="flex items-center gap-4">
              <input
                id="fileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <button
                onClick={() => setShowGenerateForm(true)}
                className="py-2 px-4 rounded border-0 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100"
              >
                Generate Questions using AI âœ¨
              </button>
            </div>
          </div>
          {showGenerateForm && (
            <QuestionGenerator
              setFile={setFile}
              setPreview={setPreview}
              setGeneratedQuestions={setGeneratedQuestions}
              examTopic={topic}
              examDescription={description}
              generatedQuestions={generatedQuestions}
              setTotalQuestions={setTotalQuestions}
            />
          )}
          <div className="mb-4">
            <label htmlFor="questionConduct" className="block mb-2 font-medium">
              Number of Questions to Conduct:
            </label>
            <input
              id="questionConduct"
              type="number"
              min="0"
              value={questionConduct}
              onChange={(e) => setQuestionConduct(Number(e.target.value))}
              className="block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter number of questions to conduct"
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
                    Required Score: {requiredScore} out of {totalQuestions} questions
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-800">Passing Criteria</p>
                  <p className="text-sm text-gray-600">
                    Students need {passPercentage}% ({requiredScore}/{totalQuestions}) to pass this exam
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
                  min="0"
                  max="10"
                  value={reattemptCount}
                  onChange={(e) =>
                    setReattemptCount(Math.max(0, Math.min(10, Number(e.target.value))))
                  }
                  className="w-full p-2 border border-gray-300 rounded text-center"
                  placeholder="1"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Students can attempt this exam {reattemptCount} time
                  {reattemptCount !== 1 ? "s" : ""}.
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
          {preview.length > 0 && (
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
            disabled={!file || isUploading}
            className="mt-4 px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : "Upload Questions"}
          </button>
        </div>
      ) : !contextLoading && !loading && showUploadedExams && !editingExamId ? (
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
          {filteredExams.length > 0 ? (
            <>
              <div className="shadow-lg rounded-lg overflow-hidden hidden md:block">
                <div className="overflow-y-auto max-h-96">
                  <table className="w-full bg-white">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr className="text-gray-600 text-sm uppercase tracking-wider">
                        <th
                          className="p-4 text-left font-semibold cursor-pointer"
                          onClick={() => handleExamSort("topic")}
                        >
                          Topic{" "}
                          {examSortColumn === "topic" &&
                            (examSortDirection === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th
                          className="p-4 text-left font-semibold cursor-pointer"
                          onClick={() => handleExamSort("description")}
                        >
                          Description{" "}
                          {examSortColumn === "description" &&
                            (examSortDirection === "asc" ? "â†‘" : "â†“")}
                        </th>
                        <th className="p-4 text-center font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredExams.map((exam) => (
                        <tr
                          key={exam.assessmentId}
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="p-4">{exam.topic}</td>
                          <td className="p-4 text-gray-600">{exam.description}</td>
                          <td className="p-4 text-center flex justify-center gap-2">
                            {!isExamAttempted(exam.assessmentId) && (
                              <button
                                onClick={() => fetchQuestionsToEdit(exam.assessmentId)}
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
                                title="Edit Exam"
                              >
                                <MdEdit className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDeleteAssessment(exam.assessmentId, e)}
                              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition duration-200"
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
      ) : !contextLoading && !loading && editingExamId ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Questions</h3>
          {questionsToEdit.map((question, index) => (
            <div key={question.questionID} className="mb-4 p-4 border border-gray-200 rounded">
              <div className="mb-2">
                <label className="block mb-1 font-medium">Question {index + 1}:</label>
                <input
                  type="text"
                  value={question.questionText}
                  onChange={(e) => {
                    const updated = [...questionsToEdit];
                    updated[index].questionText = e.target.value;
                    setQuestionsToEdit(updated);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              {["optionA", "optionB", "optionC", "optionD"].map((opt, optIndex) => (
                <div key={opt} className="mb-2">
                  <label className="block mb-1 font-medium">
                    Option {String.fromCharCode(65 + optIndex)}:
                  </label>
                  <input
                    type="text"
                    value={question[opt]}
                    onChange={(e) => {
                      const updated = [...questionsToEdit];
                      updated[index][opt] = e.target.value;
                      setQuestionsToEdit(updated);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
              <div className="mb-2">
                <label className="block mb-1 font-medium">Correct Option:</label>
                <select
                  value={question.correctAns}
                  onChange={(e) => {
                    const updated = [...questionsToEdit];
                    updated[index].correctAns = e.target.value;
                    setQuestionsToEdit(updated);
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {["A", "B", "C", "D"].map((letter) => (
                    <option key={letter} value={letter}>
                      {letter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="flex gap-4">
            <button
              onClick={saveEditedQuestions}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditingExamId(null);
                setQuestionsToEdit([]);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UploadView;’Ó"(df827892e37d4c420fb7f81b9f959ede8bab66d92ªfile:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/Manager/UploadView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final