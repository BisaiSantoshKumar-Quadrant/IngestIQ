
// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ReportsJobSelector from "@/components/reports/ReportsJobSelector";
// import JobMetrics from "@/components/reports/JobMetrics";
// import SystemMonitor from "@/components/reports/SystemMonitor";
// import PreviousRuns from "@/components/reports/PreviousRuns";

// export default function Reports() {
//   const [searchParams] = useSearchParams();
//   const [selectedJobId, setSelectedJobId] = useState<string>('');

//   // Check if a job ID was passed via URL parameters
//   useEffect(() => {
//     const jobId = searchParams.get('jobId');
//     if (jobId) {
//       setSelectedJobId(jobId);
//     }
//   }, [searchParams]);

//   return (
//     <div className="max-w-7xl mx-auto mt-14 p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Job Monitoring & Reports</h1>
//           <p className="text-muted-foreground">
//             Monitor job performance, system metrics, and view detailed logs
//           </p>
//         </div>
//       </div>

//       {/* Job Selection */}
//       <ReportsJobSelector 
//         selectedJobId={selectedJobId} 
//         onJobSelect={setSelectedJobId} 
//       />

//       {selectedJobId && (
//         <Tabs defaultValue="metrics" className="w-full">
//           <TabsList className="grid w-full grid-cols-4">
//             <TabsTrigger value="metrics">Job Metrics</TabsTrigger>
//             <TabsTrigger value="system">System Monitor</TabsTrigger>
//             <TabsTrigger value="history">Previous Runs</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="metrics" className="space-y-4">
//             <JobMetrics jobId={selectedJobId} />
//           </TabsContent>
          
//           <TabsContent value="system" className="space-y-4">
//             <SystemMonitor jobId={selectedJobId} />
//           </TabsContent>
          
          
//           <TabsContent value="history" className="space-y-4">
//             <PreviousRuns jobId={selectedJobId} />
//           </TabsContent>
//         </Tabs>
//       )}

//       {!selectedJobId && (
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">
//             Please select a job from the dropdown above to view its monitoring data and logs.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


// the abbove is my actual integrated code
//--------------------------------------------------------------------------------------------------------//



// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Cpu, MemoryStick } from "lucide-react";
// import ReportsJobSelector from "@/components/reports/ReportsJobSelector";
// import JobMetrics from "@/components/reports/JobMetrics";
// import SystemMonitor from "@/components/reports/SystemMonitor";
// import PreviousRuns from "@/components/reports/PreviousRuns";

// // Function to dynamically get the latest auth token
// const getAuthToken = () => {
//   // Implement your logic to fetch the latest token (e.g., from a secure storage or API)
//   // This is a placeholder - replace with actual token retrieval logic
//   return "latest-auth-token-from-your-system"; // Example
// };

// // Mock system metrics component with real data
// function SystemResourcesOverview() {
//   const [systemMetrics, setSystemMetrics] = useState({
//     cpu: { usage: 0, temperature: 0 },
//     memory: { used: 0, total: 0, percentage: 0 },
//     performance: { used: 0, total: 0, percentage: 0 }
//   });

//   useEffect(() => {
//     const fetchSystemMonitorData = async () => {
//       try {
//         const token = getAuthToken();
//         const response = await fetch(`${BASE_URL}/get_system_monitor?job_id=all`, {
//           method: "GET",
//           headers: { "Authorization": `Bearer ${token}` },
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch system monitor: ${response.status} - ${errorText}`);
//         }

//         const data = await response.json();
//         const monitor = data.monitor;

//         // Calculate average CPU usage
//         const avgCpuUsage = monitor.cpu.usage / monitor.cpu.cores;
//         // Calculate average memory usage percentage
//         const avgMemoryUsage = (parseFloat(monitor.memory.usage) / parseFloat(monitor.memory.memory.split(' ')[0])) * 100;
//         // Calculate average performance percentage
//         const avgPerformance = monitor.performance.successRate;

//         setSystemMetrics({
//           cpu: { usage: avgCpuUsage, temperature: 62 },
//           memory: { used: parseFloat(monitor.memory.usage), total: parseFloat(monitor.memory.memory.split(' ')[0]), percentage: avgMemoryUsage },
//           performance: { used: avgPerformance, total: 100, percentage: avgPerformance }
//         });
//       } catch (error) {
//         console.error("Error fetching system monitor data:", error);
//       }
//     };

//     fetchSystemMonitorData();
//     const interval = setInterval(fetchSystemMonitorData, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
//           <Cpu className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{systemMetrics.cpu.usage.toFixed(1)}%</div>
//           <Progress value={systemMetrics.cpu.usage} className="mt-2" />
//           <p className="text-xs text-muted-foreground mt-2">
//             Temperature: {systemMetrics.cpu.temperature}°C
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
//           <MemoryStick className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{systemMetrics.memory.percentage.toFixed(1)}%</div>
//           <Progress value={systemMetrics.memory.percentage} className="mt-2" />
//           <p className="text-xs text-muted-foreground mt-2">
//             {systemMetrics.memory.used.toFixed(1)}GB / {systemMetrics.memory.total}GB
//           </p>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Performance</CardTitle>
//           <MemoryStick className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{systemMetrics.performance.percentage.toFixed(1)}%</div>
//           <Progress value={systemMetrics.performance.percentage} className="mt-2" />
//           <p className="text-xs text-muted-foreground mt-2">
//             {systemMetrics.performance.used.toFixed(1)}% / 100%
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default function Reports() {
//   const [searchParams] = useSearchParams();
//   const [selectedJobId, setSelectedJobId] = useState<string>('');

//   // Check if a job ID was passed via URL parameters
//   useEffect(() => {
//     const jobId = searchParams.get('jobId');
//     if (jobId) {
//       setSelectedJobId(jobId);
//     }
//   }, [searchParams]);

//   return (
//     <div className="max-w-7xl mx-auto mt-14 p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Job Monitoring & Reports</h1>
//           <p className="text-muted-foreground">
//             Monitor job performance, system metrics, and view detailed logs
//           </p>
//         </div>
//       </div>

//       {/* Job Selection */}
//       <ReportsJobSelector 
//         selectedJobId={selectedJobId} 
//         onJobSelect={setSelectedJobId} 
//       />

//       {selectedJobId && (
//         <Tabs defaultValue="metrics" className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="metrics">Job Metrics</TabsTrigger>
//             <TabsTrigger value="system">System Monitor</TabsTrigger>
//             <TabsTrigger value="history">Previous Runs</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="metrics" className="space-y-4">
//             <JobMetrics jobId={selectedJobId} />
//           </TabsContent>
          
//           <TabsContent value="system" className="space-y-4">
//             <SystemMonitor jobId={selectedJobId} />
//           </TabsContent>
          
//           <TabsContent value="history" className="space-y-4">
//             <PreviousRuns jobId={selectedJobId} />
//           </TabsContent>
//         </Tabs>
//       )}

//       {!selectedJobId && (
//         <div className="space-y-6">
//           <SystemResourcesOverview />
//         </div>
//       )}
//     </div>
//   );
// }

// // Assuming BASE_URL is defined elsewhere
// const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, MemoryStick } from "lucide-react";
import ReportsJobSelector from "@/components/reports/ReportsJobSelector";
import JobMetrics from "@/components/reports/JobMetrics";
import SystemMonitor from "@/components/reports/SystemMonitor";
import PreviousRuns from "@/components/reports/PreviousRuns";
import { getUserAggregatedMetrics, UserAggregatedMetricsResponse } from "@/lib/api"; // Adjust path to your api.ts file

// Function to dynamically get the latest auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken") || ""; // Fetch token from local storage
};

// Mock system metrics component with real data
function SystemResourcesOverview() {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: { usage: 0, temperature: 0 },
    memory: { used: 0, total: 0, percentage: 0 },
    performance: { used: 0, total: 0, percentage: 0 }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemMonitorData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          throw new Error("User data not found in local storage");
        }

        const user = JSON.parse(userData);
        const userId = user.user_id;
        if (!userId) {
          throw new Error("User ID not found in user data");
        }

        const data: UserAggregatedMetricsResponse = await getUserAggregatedMetrics(userId);

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch user aggregated metrics");
        }

        const { avg_cpu_usage, avg_memory_usage, avg_success_rate } = data.metrics;

        setSystemMetrics({
          cpu: { usage: avg_cpu_usage, temperature: 0 }, // Temperature not provided by API
          memory: { used: avg_memory_usage, total: 100, percentage: avg_memory_usage }, // Assuming total is 100 for percentage
          performance: { used: avg_success_rate, total: 100, percentage: avg_success_rate }
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching user aggregated metrics:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      }
    };

    fetchSystemMonitorData();
    const interval = setInterval(fetchSystemMonitorData, 3000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemMetrics.cpu.usage.toFixed(1)}%</div>
          <Progress value={systemMetrics.cpu.usage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Temperature: {systemMetrics.cpu.temperature}°C
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          <MemoryStick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemMetrics.memory.percentage.toFixed(1)}%</div>
          <Progress value={systemMetrics.memory.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {systemMetrics.memory.used.toFixed(1)}% / {systemMetrics.memory.total}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <MemoryStick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemMetrics.performance.percentage.toFixed(1)}%</div>
          <Progress value={systemMetrics.performance.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {systemMetrics.performance.used.toFixed(1)}% / 100%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Reports() {
  const [searchParams] = useSearchParams();
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // Check if a job ID was passed via URL parameters
  useEffect(() => {
    const jobId = searchParams.get('jobId');
    if (jobId) {
      setSelectedJobId(jobId);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto mt-14 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Monitoring & Reports</h1>
          <p className="text-muted-foreground">
            Monitor job performance, system metrics, and view detailed logs
          </p>
        </div>
      </div>

      {/* Job Selection */}
      <ReportsJobSelector 
        selectedJobId={selectedJobId} 
        onJobSelect={setSelectedJobId} 
      />

      {selectedJobId && (
        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Job Metrics</TabsTrigger>
            <TabsTrigger value="system">System Monitor</TabsTrigger>
            <TabsTrigger value="history">Previous Runs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-4">
            <JobMetrics jobId={selectedJobId} />
          </TabsContent>
          
          <TabsContent value="system" className="space-y-4">
            <SystemMonitor jobId={selectedJobId} />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <PreviousRuns jobId={selectedJobId} />
          </TabsContent>
        </Tabs>
      )}

      {!selectedJobId && (
        <div className="space-y-6">
          <SystemResourcesOverview />
        </div>
      )}
    </div>
  );
}

// Assuming BASE_URL is defined elsewhere
const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com";