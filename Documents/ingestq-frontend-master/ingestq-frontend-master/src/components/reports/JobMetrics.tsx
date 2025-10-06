
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Clock, CheckCircle, AlertCircle, XCircle, PlayCircle } from "lucide-react";

// interface JobMetricsProps {
//   jobId: string;
// }

// const mockJobData = {
//   '1': {
//     status: 'running',
//     duration: '00:15:32',
//     progress: 65,
//     issues: 2,
//     startTime: '2024-01-31 10:30:00',
//     expectedCompletion: '2024-01-31 10:45:00',
//     recordsProcessed: 15420,
//     totalRecords: 23680,
//     errors: ['Data format issue in row 1250', 'Connection timeout at 10:40:15'],
//     warnings: 5
//   },
//   '2': {
//     status: 'completed',
//     duration: '00:08:45',
//     progress: 100,
//     issues: 0,
//     startTime: '2024-01-31 09:45:00',
//     expectedCompletion: '2024-01-31 09:54:00',
//     recordsProcessed: 12300,
//     totalRecords: 12300,
//     errors: [],
//     warnings: 0
//   },
//   '3': {
//     status: 'failed',
//     duration: '00:12:18',
//     progress: 45,
//     issues: 8,
//     startTime: '2024-01-31 11:15:00',
//     expectedCompletion: '2024-01-31 11:30:00',
//     recordsProcessed: 5600,
//     totalRecords: 12400,
//     errors: ['Database connection failed', 'Invalid schema detected'],
//     warnings: 3
//   },
//   '4': {
//     status: 'pending',
//     duration: '00:00:00',
//     progress: 0,
//     issues: 0,
//     startTime: '-',
//     expectedCompletion: '-',
//     recordsProcessed: 0,
//     totalRecords: 8900,
//     errors: [],
//     warnings: 0
//   }
// };

// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case 'running': return <PlayCircle className="w-5 h-5 text-blue-500" />;
//     case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
//     case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
//     case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
//     default: return <Clock className="w-5 h-5 text-gray-500" />;
//   }
// };

// export default function JobMetrics({ jobId }: JobMetricsProps) {
//   const data = mockJobData[jobId as keyof typeof mockJobData];
  
//   if (!data) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <p className="text-muted-foreground text-center">Select a job to view metrics</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* Job Status Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             {getStatusIcon(data.status)}
//             <span>Job Status</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Current Status:</span>
//             <Badge className={`${
//               data.status === 'running' ? 'bg-blue-500 text-white' :
//               data.status === 'completed' ? 'bg-green-500 text-white' :
//               data.status === 'failed' ? 'bg-red-500 text-white' :
//               'bg-yellow-500 text-white'
//             }`}>
//               {data.status.toUpperCase()}
//             </Badge>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Duration:</span>
//             <span className="text-sm">{data.duration}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Start Time:</span>
//             <span className="text-sm">{data.startTime}</span>
//           </div>
//           {data.status === 'running' && (
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Expected Completion:</span>
//               <span className="text-sm">{data.expectedCompletion}</span>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Progress Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Progress & Records</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium">Progress:</span>
//               <span className="text-sm font-medium">{data.progress}%</span>
//             </div>
//             <Progress value={data.progress} className="h-2" />
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Records Processed:</span>
//             <span className="text-sm">{data.recordsProcessed.toLocaleString()} / {data.totalRecords.toLocaleString()}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Issues Card */}
//       <Card className="md:col-span-2">
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <AlertCircle className="w-5 h-5 text-orange-500" />
//             <span>Issues & Warnings</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Total Issues:</span>
//               <Badge variant={data.issues > 0 ? "destructive" : "default"}>
//                 {data.issues}
//               </Badge>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Warnings:</span>
//               <Badge variant={data.warnings > 0 ? "secondary" : "default"}>
//                 {data.warnings}
//               </Badge>
//             </div>
//           </div>
          
//           {data.errors.length > 0 && (
//             <div>
//               <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
//               <div className="space-y-1">
//                 {data.errors.map((error, index) => (
//                   <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-500">
//                     {error}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Updated jobmetrics.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, XCircle, PlayCircle } from "lucide-react";
import { getJobMetrics } from "@/lib/api"; // Import only the function
import type { JobMetrics } from "@/lib/api"; // Type-only import for the interface

interface JobMetricsProps {
  jobId: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running': return <PlayCircle className="w-5 h-5 text-blue-500" />;
    case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
    case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
    default: return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

export default function JobMetrics({ jobId }: JobMetricsProps) {
  const [data, setData] = useState<JobMetrics | null>(null);

  useEffect(() => {
    if (jobId) {
      getJobMetrics(jobId)
        .then((res) => {
          console.log("Job Metrics API Response:", res); // Log the response for debugging
          if (res.success) {
            setData(res.metrics);
          } else {
            console.error("API Error Message:", res.message);
            setData(null); // Explicitly set to null on failure
          }
        })
        .catch((error) => {
          console.error("API Call Failed:", error);
          setData(null); // Explicitly set to null on error
        });
    }
  }, [jobId]);

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading job metrics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Job Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getStatusIcon(data.currentStatus)}
            <span>Job Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Status:</span>
            <Badge className={`${
              data.currentStatus === 'running' ? 'bg-blue-500 text-white' :
              data.currentStatus === 'completed' ? 'bg-green-500 text-white' :
              data.currentStatus === 'failed' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {data.currentStatus.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Duration:</span>
            <span className="text-sm">{data.duration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Start Time:</span>
            <span className="text-sm">{data.startTime}</span>
          </div>
          {data.expectedCompletion && data.currentStatus === 'running' && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expected Completion:</span>
              <span className="text-sm">{data.expectedCompletion}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress & Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm font-medium">{data.progress}%</span>
            </div>
            <Progress value={data.progress} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Records Processed:</span>
            <span className="text-sm">{data.recordsProcessed}</span>
          </div>
        </CardContent>
      </Card>

      {/* Issues Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>Issues & Warnings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Issues:</span>
              <Badge variant={data.issues > 0 ? "destructive" : "default"}>
                {data.issues}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Warnings:</span>
              <Badge variant={data.warnings > 0 ? "secondary" : "default"}>
                {data.warnings}
              </Badge>
            </div>
          </div>
          
          {data.errors && data.errors.length > 0 && ( // Add check for undefined errors
            <div>
              <h4 className="font-semibold text-red-600 mb-2">Errors:</h4>
              <div className="space-y-1">
                {data.errors.map((error, index) => (
                  <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-500">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}