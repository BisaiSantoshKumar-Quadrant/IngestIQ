
// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Eye, Download, Calendar } from "lucide-react";

// interface JobRun {
//   id: string;
//   runDate: string;
//   duration: string;
//   status: 'completed' | 'failed' | 'cancelled';
//   recordsProcessed: number;
//   issues: number;
//   logSummary: string[];
// }

// interface PreviousRunsProps {
//   jobId: string;
// }

// const mockJobRuns: Record<string, JobRun[]> = {
//   '1': [
//     {
//       id: 'run-1-001',
//       runDate: '2024-01-31 10:30:00',
//       duration: '00:15:32',
//       status: 'completed',
//       recordsProcessed: 15420,
//       issues: 2,
//       logSummary: [
//         '2024-01-31 10:30:00 [INFO] Job execution started',
//         '2024-01-31 10:32:15 [WARN] Slow query detected',
//         '2024-01-31 10:35:22 [ERROR] Record validation failed for ID: 12345',
//         '2024-01-31 10:45:32 [INFO] Job completed successfully'
//       ]
//     },
//     {
//       id: 'run-1-002',
//       runDate: '2024-01-30 10:30:00',
//       duration: '00:12:45',
//       status: 'completed',
//       recordsProcessed: 14890,
//       issues: 0,
//       logSummary: [
//         '2024-01-30 10:30:00 [INFO] Job execution started',
//         '2024-01-30 10:35:12 [INFO] Processing batch 1 of 45',
//         '2024-01-30 10:42:45 [INFO] Job completed successfully'
//       ]
//     },
//     {
//       id: 'run-1-003',
//       runDate: '2024-01-29 10:30:00',
//       duration: '00:08:22',
//       status: 'failed',
//       recordsProcessed: 8420,
//       issues: 15,
//       logSummary: [
//         '2024-01-29 10:30:00 [INFO] Job execution started',
//         '2024-01-29 10:35:12 [ERROR] Database connection failed',
//         '2024-01-29 10:36:45 [ERROR] Multiple validation errors detected',
//         '2024-01-29 10:38:22 [ERROR] Job execution failed'
//       ]
//     }
//   ],
//   '2': [
//     {
//       id: 'run-2-001',
//       runDate: '2024-01-31 09:45:00',
//       duration: '00:08:45',
//       status: 'completed',
//       recordsProcessed: 12300,
//       issues: 0,
//       logSummary: [
//         '2024-01-31 09:45:00 [INFO] Job execution started',
//         '2024-01-31 09:50:30 [INFO] Data processing completed',
//         '2024-01-31 09:53:45 [INFO] Job completed successfully'
//       ]
//     }
//   ]
// };

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'completed': return 'bg-green-500 text-white';
//     case 'failed': return 'bg-red-500 text-white';
//     case 'cancelled': return 'bg-gray-500 text-white';
//     default: return 'bg-gray-500 text-white';
//   }
// };

// export default function PreviousRuns({ jobId }: PreviousRunsProps) {
//   const [selectedRun, setSelectedRun] = useState<JobRun | null>(null);
//   const runs = mockJobRuns[jobId] || [];

//   if (!jobId) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <p className="text-muted-foreground text-center">Select a job to view previous runs</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Calendar className="w-5 h-5 text-purple-500" />
//           <span>Previous Job Runs</span>
//         </CardTitle>
//         <CardDescription>
//           Historical execution data and logs for the selected job
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {runs.length === 0 ? (
//           <p className="text-muted-foreground text-center py-8">No previous runs found for this job</p>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Run Date</TableHead>
//                 <TableHead>Duration</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Records</TableHead>
//                 <TableHead>Issues</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {runs.map((run) => (
//                 <TableRow key={run.id}>
//                   <TableCell className="font-mono text-sm">{run.runDate}</TableCell>
//                   <TableCell>{run.duration}</TableCell>
//                   <TableCell>
//                     <Badge className={getStatusColor(run.status)}>
//                       {run.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{run.recordsProcessed.toLocaleString()}</TableCell>
//                   <TableCell>
//                     <Badge variant={run.issues > 0 ? "destructive" : "default"}>
//                       {run.issues}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setSelectedRun(run)}
//                           >
//                             <Eye className="w-4 h-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="max-w-4xl">
//                           <DialogHeader>
//                             <DialogTitle>Job Run Details</DialogTitle>
//                             <DialogDescription>
//                               Execution details and logs for run on {run.runDate}
//                             </DialogDescription>
//                           </DialogHeader>
//                           {selectedRun && (
//                             <div className="space-y-4">
//                               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                 <div>
//                                   <span className="text-sm font-medium">Status:</span>
//                                   <Badge className={`${getStatusColor(selectedRun.status)} ml-2`}>
//                                     {selectedRun.status}
//                                   </Badge>
//                                 </div>
//                                 <div>
//                                   <span className="text-sm font-medium">Duration:</span>
//                                   <span className="ml-2">{selectedRun.duration}</span>
//                                 </div>
//                                 <div>
//                                   <span className="text-sm font-medium">Records:</span>
//                                   <span className="ml-2">{selectedRun.recordsProcessed.toLocaleString()}</span>
//                                 </div>
//                                 <div>
//                                   <span className="text-sm font-medium">Issues:</span>
//                                   <Badge className="ml-2" variant={selectedRun.issues > 0 ? "destructive" : "default"}>
//                                     {selectedRun.issues}
//                                   </Badge>
//                                 </div>
//                               </div>
                              
//                               <div>
//                                 <h4 className="font-semibold mb-2">Log Summary:</h4>
//                                 <ScrollArea className="h-64 w-full border rounded-lg p-4">
//                                   <div className="space-y-1">
//                                     {selectedRun.logSummary.map((log, index) => (
//                                       <div key={index} className="text-sm font-mono">
//                                         {log}
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </ScrollArea>
//                               </div>
//                             </div>
//                           )}
//                         </DialogContent>
//                       </Dialog>
                      
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           // Download logs functionality
//                           const logText = run.logSummary.join('\n');
//                           const blob = new Blob([logText], { type: 'text/plain' });
//                           const url = URL.createObjectURL(blob);
//                           const a = document.createElement('a');
//                           a.href = url;
//                           a.download = `job-${jobId}-run-${run.id}-logs.txt`;
//                           document.body.appendChild(a);
//                           a.click();
//                           document.body.removeChild(a);
//                           URL.revokeObjectURL(url);
//                         }}
//                       >
//                         <Download className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



// Updated previousruns.tsx

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Download, Calendar } from "lucide-react";
import { getPreviousRuns, PreviousRun } from "@/lib/api";  // Adjust path to api.ts as needed

interface PreviousRunsProps {
  jobId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-500 text-white';
    case 'failed': return 'bg-red-500 text-white';
    case 'cancelled': return 'bg-gray-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default function PreviousRuns({ jobId }: PreviousRunsProps) {
  const [runs, setRuns] = useState<PreviousRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<PreviousRun | null>(null);

  useEffect(() => {
    if (jobId) {
      getPreviousRuns(jobId)
        .then((res) => {
          if (res.success) {
            setRuns(res.runs);
          }
        })
        .catch(console.error);
    }
  }, [jobId]);

  if (!jobId) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Select a job to view previous runs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span>Previous Job Runs</span>
        </CardTitle>
        <CardDescription>
          Historical execution data and logs for the selected job
        </CardDescription>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No previous runs found for this job</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-sm">{run.runDate}</TableCell>
                  <TableCell>{run.duration}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{run.records.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={run.issues > 0 ? "destructive" : "default"}>
                      {run.issues}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRun(run)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Job Run Details</DialogTitle>
                            <DialogDescription>
                              Execution details and logs for run on {run.runDate}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRun && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <span className="text-sm font-medium">Status:</span>
                                  <Badge className={`${getStatusColor(selectedRun.status)} ml-2`}>
                                    {selectedRun.status}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Duration:</span>
                                  <span className="ml-2">{selectedRun.duration}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Records:</span>
                                  <span className="ml-2">{selectedRun.records.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Issues:</span>
                                  <Badge className="ml-2" variant={selectedRun.issues > 0 ? "destructive" : "default"}>
                                    {selectedRun.issues}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Warnings:</span>
                                  <Badge className="ml-2" variant={selectedRun.warnings > 0 ? "secondary" : "default"}>
                                    {selectedRun.warnings}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2">Log Summary:</h4>
                                <ScrollArea className="h-64 w-full border rounded-lg p-4">
                                  <div className="space-y-1">
                                    {selectedRun.logSummary.map((log, index) => (
                                      <div key={index} className="text-sm font-mono">
                                        {log}
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Download logs functionality
                          const logText = run.logSummary.join('\n');
                          const blob = new Blob([logText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `job-${jobId}-run-${run.id}-logs.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}