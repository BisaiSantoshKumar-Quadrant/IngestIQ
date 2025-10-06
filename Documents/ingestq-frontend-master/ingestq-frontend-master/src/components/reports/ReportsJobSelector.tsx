
// import { useState } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

// interface Job {
//   id: string;
//   name: string;
//   status: 'running' | 'completed' | 'failed' | 'pending';
//   category: string;
//   lastRun: string;
// }

// interface JobSelectorProps {
//   selectedJobId: string;
//   onJobSelect: (jobId: string) => void;
// }

// const mockJobs: Job[] = [
//   {
//     id: '1',
//     name: "Customer Data ETL",
//     status: 'running',
//     category: 'Glue Jobs',
//     lastRun: '2024-01-31 10:30:00'
//   },
//   {
//     id: '2',
//     name: "Sales Analytics",
//     status: 'completed',
//     category: 'Glue Jobs',
//     lastRun: '2024-01-31 09:45:00'
//   },
//   {
//     id: '3',
//     name: "Data Validation",
//     status: 'failed',
//     category: 'Lambda Jobs',
//     lastRun: '2024-01-31 11:15:00'
//   },
//   {
//     id: '4',
//     name: "Report Generation",
//     status: 'pending',
//     category: 'Batch Jobs',
//     lastRun: '2024-01-30 08:20:00'
//   }
// ];

// const getStatusIcon = (status: string) => {
//   switch (status) {
//     case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
//     case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//     case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
//     case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//     default: return <Clock className="w-4 h-4 text-gray-500" />;
//   }
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'running': return 'bg-blue-500 text-white';
//     case 'completed': return 'bg-green-500 text-white';
//     case 'failed': return 'bg-red-500 text-white';
//     case 'pending': return 'bg-yellow-500 text-white';
//     default: return 'bg-gray-500 text-white';
//   }
// };

// export default function ReportsJobSelector({ selectedJobId, onJobSelect }: JobSelectorProps) {
//   const selectedJob = mockJobs.find(job => job.id === selectedJobId);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Select Job to Monitor</CardTitle>
//         <CardDescription>Choose a job to view its detailed monitoring information</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Select value={selectedJobId} onValueChange={onJobSelect}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select a job to monitor" />
//           </SelectTrigger>
//           <SelectContent>
//             {mockJobs.map((job) => (
//               <SelectItem key={job.id} value={job.id}>
//                 <div className="flex items-center space-x-2">
//                   {getStatusIcon(job.status)}
//                   <span>{job.name}</span>
//                   <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         {selectedJob && (
//           <div className="mt-4 p-4 border rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">{selectedJob.name}</h3>
//                 <p className="text-sm text-muted-foreground">{selectedJob.category}</p>
//                 <p className="text-xs text-muted-foreground">Last run: {selectedJob.lastRun}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {getStatusIcon(selectedJob.status)}
//                 <Badge className={getStatusColor(selectedJob.status)}>
//                   {selectedJob.status}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// Updated reportsjobselector.tsx


// import { useState, useEffect } from "react";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
// import { getJobs, Job } from "@/lib/api"; // Adjust path to api.ts as needed

// interface JobSelectorProps {
//   selectedJobId: string;
//   onJobSelect: (jobId: string) => void;
// }

// const getStatusIcon = (status: string) => {
//   const lowerStatus = status.toLowerCase(); // Convert to lowercase for consistency
//   switch (lowerStatus) {
//     case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
//     case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//     case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
//     case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
//     default: return <Clock className="w-4 h-4 text-gray-500" />;
//   }
// };

// const getStatusColor = (status: string) => {
//   const lowerStatus = status.toLowerCase(); // Convert to lowercase for consistency
//   switch (lowerStatus) {
//     case 'running': return 'bg-blue-500 text-white';
//     case 'completed': return 'bg-green-500 text-white';
//     case 'failed': return 'bg-red-500 text-white';
//     case 'pending': return 'bg-yellow-500 text-white';
//     default: return 'bg-gray-500 text-white';
//   }
// };

// export default function ReportsJobSelector({ selectedJobId, onJobSelect }: JobSelectorProps) {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true);
//     getJobs()
//       .then((res) => {
//         console.log("API Response:", res); // Log the response to inspect it
//         if (res.success) {
//           setJobs(res.jobs);
//         } else {
//           console.error("API Error Message:", res.message);
//         }
//       })
//       .catch((error) => {
//         console.error("API Call Failed:", error); // Log any errors
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const selectedJob = jobs.find(job => job.jobId === selectedJobId); // Use jobId instead of id

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <p className="text-muted-foreground text-center">Loading jobs...</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Select Job to Monitor</CardTitle>
//         <CardDescription>Choose a job to view its detailed monitoring information</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Select value={selectedJobId} onValueChange={onJobSelect}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select a job to monitor" />
//           </SelectTrigger>
//           <SelectContent>
//             {jobs.length === 0 ? (
//               <SelectItem value="" disabled>
//                 <span className="text-muted-foreground">No jobs available</span>
//               </SelectItem>
//             ) : (
//               jobs.map((job) => (
//                 <SelectItem key={job.jobId} value={job.jobId}> {/* Use jobId instead of id */}
//                   <div className="flex items-center space-x-2">
//                     {getStatusIcon(job.Status)} {/* Use Status instead of status */}
//                     <span>{job.jobName}</span> {/* Use jobName instead of name */}
//                     <Badge className={getStatusColor(job.Status)}>{job.Status}</Badge> {/* Use Status instead of status */}
//                   </div>
//                 </SelectItem>
//               ))
//             )}
//           </SelectContent>
//         </Select>

//         {selectedJob && (
//           <div className="mt-4 p-4 border rounded-lg">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">{selectedJob.jobName}</h3> {/* Use jobName instead of name */}
//                 <p className="text-sm text-muted-foreground">{selectedJob.category || 'N/A'}</p> {/* Use category, fallback to 'N/A' if undefined */}
//                 <p className="text-xs text-muted-foreground">Last run: {selectedJob.LastRun}</p> {/* Use LastRun instead of lastRun */}
//               </div>
//               <div className="flex items-center space-x-2">
//                 {getStatusIcon(selectedJob.Status)} {/* Use Status instead of status */}
//                 <Badge className={getStatusColor(selectedJob.Status)}>
//                   {selectedJob.Status} {/* Use Status instead of status */}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { getJobs, Job } from "@/lib/api"; // Adjust path to api.ts as needed

interface JobSelectorProps {
  selectedJobId: string;
  onJobSelect: (jobId: string) => void;
}

const getStatusIcon = (status: string) => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "running":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "running":
      return "bg-blue-500 text-white";
    case "completed":
      return "bg-green-500 text-white";
    case "failed":
      return "bg-red-500 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default function ReportsJobSelector({ selectedJobId, onJobSelect }: JobSelectorProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getJobs()
      .then((res) => {
        console.log("API Response:", res);
        if (res.success) {
          // Filter out jobs with invalid (empty or undefined) jobId
          setJobs(res.jobs.filter((job: Job) => job.jobId && job.jobId !== ""));
        } else {
          console.error("API Error Message:", res.message);
        }
      })
      .catch((error) => {
        console.error("API Call Failed:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const selectedJob = jobs.find((job) => job.jobId === selectedJobId);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading jobs...</p>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Job to Monitor</CardTitle>
          <CardDescription>Choose a job to view its detailed monitoring information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">No jobs available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Job to Monitor</CardTitle>
        <CardDescription>Choose a job to view its detailed monitoring information</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedJobId} onValueChange={onJobSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a job to monitor" />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((job) => (
              <SelectItem key={job.jobId} value={job.jobId}>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(job.Status)}
                  <span>{job.jobName}</span>
                  <Badge className={getStatusColor(job.Status)}>{job.Status}</Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedJob && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{selectedJob.jobName}</h3>
                <p className="text-sm text-muted-foreground">{selectedJob.category || "N/A"}</p>
                <p className="text-xs text-muted-foreground">Last run: {selectedJob.LastRun}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedJob.Status)}
                <Badge className={getStatusColor(selectedJob.Status)}>{selectedJob.Status}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}