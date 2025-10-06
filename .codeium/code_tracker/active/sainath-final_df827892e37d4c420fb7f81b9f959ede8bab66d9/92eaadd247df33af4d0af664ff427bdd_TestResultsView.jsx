†.import React, { useState, useEffect } from "react";

const TestResultsView = ({ selectedTestResults, setSelectedTestResults }) => {
  const [showScrollButton, setShowScrollButton] = useState(false); 


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) { 
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          {selectedTestResults.assessmentDetails.topic} - Assessment Results
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Score:</span>
              <span className="text-lg font-semibold text-gray-800">
                {selectedTestResults.assessmentDetails.score}/{selectedTestResults.assessmentDetails.questionConduct} (
                {selectedTestResults.assessmentDetails.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Status:</span>
              <span
                className={`text-lg font-semibold ${
                  selectedTestResults.assessmentDetails.percentage >=
                  selectedTestResults.assessmentDetails.passingPercentage
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedTestResults.assessmentDetails.percentage >=
                selectedTestResults.assessmentDetails.passingPercentage
                  ? "Passed"
                  : "Failed"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Topic:</span>
              <span className="text-lg font-semibold text-gray-800">
                {selectedTestResults.assessmentDetails.description}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium mr-2">Date Taken:</span>
              <span className="text-lg font-semibold text-gray-800">
                {new Date(selectedTestResults.assessmentDetails.dateTaken).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {Object.values(
            selectedTestResults.responses.reduce((acc, response) => {
              const { questionId, attemptId } = response;
              if (!acc[questionId] || acc[questionId].attemptId < attemptId) {
                acc[questionId] = response;
              }
              return acc;
            }, {})
          ).map((response, index) => (
            <div
              key={`${response.questionId}`}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h4 className="text-lg font-medium text-gray-800 mb-3">
                <span className="text-gray-500 mr-2">{index + 1}.</span>
                {response.questionText}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Your Answer:</span>
                  <span
                    className={`ml-2 ${
                      response.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {response.employeeAnswer || "Not answered"}
                  </span>
                  {response.isCorrect ? (
                    <span className="ml-2 text-green-500">âœ“</span>
                  ) : response.employeeAnswer ? (
                    <span className="ml-2 text-red-500">âœ—</span>
                  ) : null}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Correct Answer:</span>
                  <span className="ml-2 text-green-600">{response.correctAnswer}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setSelectedTestResults(null)}
            className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium hover:bg-blue-700 transition duration-200 shadow-md"
          >
            Back to Completed Tests
          </button>
        </div>
      </div>
      {/* Up arrow button fixed to bottom-right */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-lg z-10"
          title="Scroll to Top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TestResultsView;†."(df827892e37d4c420fb7f81b9f959ede8bab66d92¬file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/components/User/TestResultsView.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final