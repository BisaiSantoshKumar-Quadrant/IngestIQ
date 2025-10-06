Â'// ðŸ‘‡ Import useEffect, useState at the top (already done)
import React, { useState, useEffect } from "react";

// ...your other imports remain unchanged

const ManagerDashboard = () => {
  const [view, setView] = useState("home");
  const [managerName, setManagerName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ðŸ§  New states for AI feature
  const [aiUsername, setAiUsername] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  // ðŸ§  Function to call backend AI summary API
  const fetchAISummary = async () => {
    if (!aiUsername.trim()) return;
    try {
      setLoadingSummary(true);
      const response = await fetch(`/api/ai/user-summary/${aiUsername}`);
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (err) {
      setAiSummary("Failed to fetch AI summary.");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setManagerName(storedName || "Manager");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <DashboardProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar role="Manager" />
        <div className="flex flex-1 md:flex-row min-h-screen">
          <Sidebar
            view={view}
            handleViewChange={handleViewChange}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-violet-600 mb-6 border-b-2 border-violet-300 pb-2">
              Manager Workspace
            </h1>

            {view === "home" && (
              <>
                <HomeView
                  managerName={managerName}
                  timeOfDay={
                    new Date().getHours() < 12
                      ? "Good morning"
                      : new Date().getHours() < 18
                      ? "Good afternoon"
                      : "Good evening"
                  }
                />

                {/* ðŸ§  AI Summary UI */}
                <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-white shadow">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Ask AI: User Summary</h2>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={aiUsername}
                    onChange={(e) => setAiUsername(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md w-full md:w-1/2 mb-2"
                  />
                  <button
                    onClick={fetchAISummary}
                    className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
                  >
                    {loadingSummary ? "Fetching..." : "Get AI Summary"}
                  </button>

                  {aiSummary && (
                    <div className="mt-4 bg-gray-100 p-3 rounded border border-gray-300">
                      <strong>AI Summary:</strong>
                      <p className="mt-2 text-gray-800">{aiSummary}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {view === "scores" && <ScoresView />}
            {view === "promote" && <PromoteView />}
            {view === "upload" && <UploadView />}
            {view === "reports" && <ReportsView />}
          </div>
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-700"
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        <Footer />
      </div>
    </DashboardProvider>
  );
};

export default ManagerDashboard;
>>s swwx xyy{ {||} }~	~‚ ‚ƒ
ƒŒ Œ
 
‘ ‘”
”• •—
—˜ ˜š
š› ›œ
œ ¤
¤¦ ¦¨
¨¯ ¯³
³´ ´µ
µ· ·Â
ÂÄ ÄÇ
ÇÈ ÈÊ
ÊÌ ÌÏ
ÏÐ ÐÖ
ÖÚ ÚÛ
ÛÜ ÜÝ
ÝÞ Þà
àá áâ
âä äå
åæ æé
éí íî
î÷ ÷û
û ƒ
ƒ… …†
†‡ ‡ˆ
ˆ‘ ‘“
“• •›
›œ œ£
£¤ ¤¥
¥¨ ¨«
«¬ ¬®
®° °²
²³ ³´
´µ µ¶
¶· ·¹
¹º º»
»¾ ¾Â
ÂÃ ÃÄ
ÄÅ ÅÈ
ÈÉ ÉË
ËÌ ÌÍ
ÍÎ ÎÚ
ÚÛ Ûà
àâ âã
ãæ æé
éê êì
ìî îï
ïò òõ
õ÷ ÷ú
úû ûý
ýþ þ†
†‡ ‡ˆ
ˆ‰ ‰
Ž Ž”
”• •–
–˜ ˜™
™š šœ
œ ž
ž   ¡
¡¤ ¤¦
¦§ §±
±´ ´»
»¼ ¼½
½¿ ¿Ã
ÃÄ ÄÅ
ÅÆ ÆÇ
ÇË ËÍ
ÍÓ ÓÔ
ÔÕ ÕØ
ØÚ ÚÛ
ÛÜ Üà
àá áè
èé éî
îñ ñù
ùú úü
üý ýþ
þ‰ ‰Š
Š‹ ‹’
’— —˜
˜™ ™ 
 ¼ ¼¾
¾¿ ¿Á
ÁÃ ÃÅ
ÅÆ ÆÊ
ÊÏ ÏÑ
ÑÒ ÒÔ
ÔÖ ÖÙ
ÙÚ ÚÝ
Ýê êï
ïñ ñó
ó÷ ÷‚
‚ƒ ƒ…
…‡ ‡ˆ
ˆ‰ ‰Š
Š‹ ‹
’ ’”
”– –š
šœ œ±
±³ ³¶
¶· ·Â
ÂÃ ÃÔ
ÔÕ ÕÝ
ÝÞ Þà
àá áå
åæ æí
íî îñ
ñò òõ
õ÷ ÷†
†ˆ ˆ
‘ ‘˜
˜™ ™·
·¸ ¸»
»¼ ¼¾
¾¿ ¿Â
ÂÃ ÃÅ
ÅÆ ÆÍ
ÍÏ Ïç
çí íñ
ñ÷ ÷ÿ
ÿ€ €„
„… …ˆ
ˆ‰ ‰
 ›
›Ÿ Ÿ¡
¡¢ ¢Ã
ÃÄ ÄÙ
ÙÚ ÚÞ
Þß ßå
åæ æê
êì ìñ
ñò òö
ö÷ ÷™
™œ œž
žŸ Ÿª
ª± ±¾
¾ö öø
øª ª¾
¾Ø ØÚ
Ú… …‡
‡” ”•
•§ §¨
¨Ø ØÚ
Úì ìî
î´ ´¶
¶Ê ÊÌ
Ì‚ ‚„
„‡ ‡‹
‹‘ ‘ß
ßç çÙ 
Ù í  í ï 
ï á" á"ã"
ã"À' À'Â'"(df827892e37d4c420fb7f81b9f959ede8bab66d92£file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final/client/src/pages/ManagerDashboard.jsx:}file:///c:/Users/BisaiSantoshKumar%28Qu/OneDrive%20-%20Quadrant%20Resource%20LLC/Desktop/final_updated_frontend/sainath-final