±Šimport React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ExamPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [examStarted, setExamStarted] = useState(false);
  const [readyToStart, setReadyToStart] = useState(false);
  const [examTopic, setExamTopic] = useState("");
  const [passingPercentage, setPassingPercentage] = useState(null);
  const [isPassed, setIsPassed] = useState(false);
  const [result, setResult] = useState(null);
  const examContainerRef = useRef(null);
  const API_BASE_URL = "https://qassessment-backend-hwc4f6abh7cgadh9.centralindia-01.azurewebsites.net/api";

  

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token not found. Please log in again.");
          navigate("/login");
          return;
        }

        if (state?.reAttempt && state?.questions) {
          const randomizedQuestions = shuffleArray(state.questions);
          setQuestions(randomizedQuestions);
          setTimeLeft(state.duration * 60 || 30 * 60);
          setExamTopic(state.topic);
          setPassingPercentage(state.passingPercentage);
          const initialAnswers = {};
          randomizedQuestions.forEach((q) => {
            initialAnswers[q.questionID] = "";
          });
          setAnswers(initialAnswers);
          setLoading(false);
          setReadyToStart(true);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/assessment/questions/${examId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.message === "You have already passed this exam.") {
          setIsPassed(true);
          setResult({
            score: response.data.score,
            totalQuestions: response.data.totalQuestions,
            percentage: response.data.percentage,
            dateTaken: response.data.dateTaken,
            topic: response.data.topic,
            description: response.data.description,
          });
          console.log(percentage);
          setExamTopic(response.data.topic);
          setLoading(false);
          return;
        }

        const { questions, duration, topic, passingPercentage } = response.data;
        console.log(response.data);
        const randomizedQuestions = shuffleArray(questions);
        setQuestions(randomizedQuestions);
        setTimeLeft(duration * 60 || 30 * 60);
        setExamTopic(topic);
        setPassingPercentage(passingPercentage); 

        const initialAnswers = {};
        randomizedQuestions.forEach((q) => {
          initialAnswers[q.questionID] = "";
        });
        setAnswers(initialAnswers);

        setLoading(false);
        setReadyToStart(true);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error(error.response?.data?.message || "Failed to load exam questions");
        navigate("/user-dashboard");
      }
    };

    fetchQuestions();
  }, [examId, navigate, state]);

  const startExam = () => {
    if (!readyToStart || isPassed) return;

    try {
      if (examContainerRef.current) {
        examContainerRef.current.requestFullscreen().then(() => {
          setExamStarted(true);
          toast.info("Exam started! Press Escape to exit fullscreen and submit.");
        }).catch((err) => {
          console.error("Fullscreen error:", err);
          toast.error("Could not enter fullscreen mode. Please allow fullscreen.");
        });
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
      toast.error("Could not enter fullscreen mode.");
      setExamStarted(true);
    }
  };

  useEffect(() => {
    if (!examStarted) return;

    const preventCopyPaste = (e) => {
      e.preventDefault();
      toast.warn("Copying is disabled during the exam!");
    };

    const preventTextSelection = (e) => {
      if (examStarted) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventCopyPaste);
    document.addEventListener("cut", preventCopyPaste);
    document.addEventListener("paste", preventCopyPaste);
    document.addEventListener("selectstart", preventTextSelection);

    return () => {
      document.removeEventListener("copy", preventCopyPaste);
      document.removeEventListener("cut", preventCopyPaste);
      document.removeEventListener("paste", preventCopyPaste);
      document.removeEventListener("selectstart", preventTextSelection);
    };
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted) return;

    const handleBeforeUnload = (event) => {
      if (examStarted) {
        event.preventDefault();
        event.returnValue = "Navigation and refresh are blocked during the exam!";
        toast.warn("Navigation and refresh are blocked! Complete the exam.");
      }
    };

    const handlePopState = (event) => {
      if (examStarted) {
        event.preventDefault();
        toast.warn("Navigation is blocked! Complete the exam.");
        window.history.pushState(null, null, window.location.href);
      }
    };

    const handleKeyDownNavigation = (e) => {
      if (examStarted) {
        if (
          e.key === "F5" ||
          (e.ctrlKey && e.key === "r") ||
          (e.metaKey && e.key === "r")
        ) {
          e.preventDefault();
          toast.warn("Refresh is disabled during the exam!");
        }
        if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          toast.warn("Navigation is blocked during the exam!");
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDownNavigation);

    const historyBlocker = setInterval(() => {
      if (examStarted) {
        window.history.pushState(null, null, window.location.href);
      }
    }, 50);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDownNavigation);
      clearInterval(historyBlocker);
    };
  }, [examStarted]);

  useEffect(() => {
    if (!examStarted) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && examStarted && !submitting) {
        toast.warn("Fullscreen exited! Submitting exam...");
        submitExam();
      }
    };

    const handleKeyDown = (e) => {
      if (examStarted) {
        if (e.key === "Escape") {
          if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
              console.error("Error exiting fullscreen:", err);
            });
          }
        } else if (e.key === "F12" || e.ctrlKey || e.altKey) {
          e.preventDefault();
          toast.warn("Shortcut keys are unavailable during the test.");
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && examStarted) {
        toast.warn("Tab switch detected! Please stay on the exam page.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [examStarted, submitting]);

  useEffect(() => {
    if (!examStarted || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const handleAnswerChange = (questionId, optionValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue,
    }));
  };

  const submitExam = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employeeId");

      if (!token || !employeeId) {
        toast.error("Missing authentication information.");
        navigate("/login");
        return;
      }

      const submissionData = {
        assessmentId: parseInt(examId),
        employeeId: parseInt(employeeId),
        employeeResponses: Object.keys(answers).map((questionId) => ({
          questionID: parseInt(questionId),
          selectedOption: answers[questionId] || "",
        })),
      };

      const response = await axios.post(
        `${API_BASE_URL}/assessment/submit`,
        submissionData,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success("Exam submitted successfully!");

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error submitting exam:", error);
      toast.error("Failed to submit exam.");
      setSubmitting(false);
    }
  };

  const handleSubmit = () => {
    submitExam();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar role="User" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isPassed) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar role="User" />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">{examTopic}</h1>
            <p className="text-green-600 font-bold mb-4">You have already passed this exam!</p>
            <p>Score: {result.score}/{result.totalQuestions} ({result.percentage.toFixed(1)}%)</p>
            <p>Date Taken: {new Date(result.dateTaken).toLocaleString()}</p>
            <p>Description: {result.description}</p>
            <button
              onClick={() => navigate("/user-dashboard")}
              className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="flex flex-col min-h-screen" ref={examContainerRef}>
        <Navbar role="User" />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">{examTopic}</h1>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                You are about to start an exam with <span className="font-bold">{questions.length}</span> questions.
              </p>
              <p className="text-gray-700 mb-2">
                You will have <span className="font-bold">{Math.floor(timeLeft / 60)}</span> minutes to complete it.
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-bold">Passing Criteria:</span> You need to score <b>{passingPercentage}% </b>or higher to pass this exam.
              </p>
              <p className="font-medium text-gray-800 mb-4">Important instructions:</p>
              <ul className="list-disc pl-5 mb-4 text-gray-700 space-y-1">
                <li>The exam will be in fullscreen mode</li>
                <li>Press Escape to exit fullscreen and submit the exam</li>
                <li>Navigation and refresh are permanently blocked during the exam</li>
                <li>Questions will be presented in random order</li>
                <li>Once submitted, you cannot retake the exam unless you fail</li>
              </ul>
            </div>
            <button
              onClick={startExam}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition duration-200"
            >
              Start Exam
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen overflow-auto"
      ref={examContainerRef}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
        WebkitUserDrag: "none",
        userDrag: "none",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{examTopic}</h1>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div
          className="bg-white shadow-md rounded-lg p-6"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            WebkitUserDrag: "none",
            userDrag: "none",
          }}
        >
          {questions.length === 0 ? (
            <p className="text-center text-gray-500">No questions available for this exam.</p>
          ) : (
            <div>
              {questions.map((question, index) => (
                <div
                  key={question.questionID}
                  className="mb-8 pb-6 border-b border-gray-200"
                >
                  <h3 className="text-lg font-medium mb-4">
                    {index + 1}. {question.questionText}
                  </h3>
                  <div className="space-y-3">
                    {Object.values(question.options).map((value, i) => (
                      <div key={i} className="flex items-center">
                        <input
                          type="radio"
                          id={`q${question.questionID}-${i}`}
                          name={`question-${question.questionID}`}
                          value={value}
                          checked={answers[question.questionID] === value}
                          onChange={() => handleAnswerChange(question.questionID, value)}
                          className="h-4 w-4 text-blue-600"
                        />
                        <label
                          htmlFor={`q${question.questionID}-${i}`}
                          className="ml-2 block text-gray-700"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-6 py-2 rounded-md font-medium ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;±Š"(df827892e37d4c420fb7f81b9f959ede8bab66d92 file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/ExamPage.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final