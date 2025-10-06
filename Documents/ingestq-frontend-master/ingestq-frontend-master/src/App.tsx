
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Login from "@/components/Login";
import Dashboard from "@/pages/Dashboard";
import Upload from "@/pages/Upload";
import Schema from "@/pages/Schema";
import Rules from "@/pages/Rules";
import Reports from "@/pages/Reports";
import NamedEntityResolution from "@/pages/NamedEntityResolution";
import BusinessLogic from "@/pages/BusinessLogic";
import ETL from "@/pages/ETL";
import NotFound from "@/pages/NotFound";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/hooks/useTheme";
import QueryClient from "@/components/QueryClient";
import Pipelines from "@/pages/Pipelines";

import Jobs from "@/pages/Jobs";
import ScheduleJob from "@/pages/ScheduleJob";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><AuthenticatedLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="jobs" replace />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="reports" element={<Reports />} />
              <Route path="upload" element={<Upload />} />
              <Route path="schema" element={<Schema />} />
              <Route path="rules" element={<Rules />} />
              <Route path="ner" element={<NamedEntityResolution />} />
              <Route path="business-logic" element={<BusinessLogic />} />
              <Route path="etl" element={<ETL />} />
              <Route path="schedule-job" element={<ScheduleJob />} />
              <Route path = "pipelines" element = {<Pipelines />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
