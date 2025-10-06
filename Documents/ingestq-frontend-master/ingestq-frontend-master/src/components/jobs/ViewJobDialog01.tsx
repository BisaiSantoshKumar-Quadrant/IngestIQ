// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface ViewJobDialogProps {
//   job: Job | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function ViewJobDialog({ job, open, onOpenChange }: ViewJobDialogProps) {
//   if (!job) return null;

//   const getStageIcon = (type: string) => {
//     switch (type) {
//       case 'extraction': return Database;
//       case 'transformation': return Settings;
//       case 'loading': return FileText;
//       case 'validation': return CheckCircle;
//       case 'processing': return Play;
//       case 'connection': return Database;
//       case 'transfer': return FileText;
//       case 'collection': return Database;
//       default: return Settings;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
//       case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return 'bg-green-100 text-green-800 border-green-200';
//       case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'failed': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Job Details - {job.name}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Job Information */}
//           <Card>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Job Information</h3>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm text-muted-foreground">Pipeline Name:</span>
//                       <p className="font-medium">{job.name}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2">Execution Details</h3>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm text-muted-foreground">Last Run:</span>
//                       <p className="font-medium">{job.lastRun}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Pipeline Connected:</span>
//                       <p className="font-medium">{job.isConnected ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Job Stages */}
//           {job.stages && job.stages.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Job Stages ({job.stages.length})</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {job.stages.map((stage, index) => {
//                   const StageIcon = getStageIcon(stage.type);
//                   return (
//                     <Card key={stage.id} className="hover:shadow-md transition-shadow">
//                       <CardContent className="p-4">
//                         <div className="flex items-start gap-3">
//                           <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                             <StageIcon className="w-5 h-5 text-primary" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2">
//                               <span className="text-xs font-medium text-muted-foreground">
//                                 Stage {index + 1}
//                               </span>
//                               {getStatusIcon(stage.status)}
//                             </div>
//                             <h4 className="font-medium text-sm mb-1 truncate">{stage.name}</h4>
//                             <Badge 
//                               variant="outline" 
//                               className={`text-xs ${getStatusColor(stage.status)}`}
//                             >
//                               {stage.status}
//                             </Badge>
//                             <p className="text-xs text-muted-foreground mt-2 capitalize">
//                               {stage.type.replace('_', ' ')}
//                             </p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
// }

// interface ScheduleDetails {
//   frequency?: string;
//   time?: string;
// }

// interface BusinessLogicRules {
//   [key: string]: string;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string | null;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
//   triggerType?: string;
//   email?: string;
//   glue_job_name?: string;
//   scheduleDetails?: ScheduleDetails;
//   datasource?: string;
//   datadestination?: string;
//   business_logic_rules?: BusinessLogicRules;
//   folderName?: string;
//   pipelineName?: string;
// }

// interface ViewJobDialogProps {
//   job: Job | null;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export default function ViewJobDialog01({ job, open, onOpenChange }: ViewJobDialogProps) {
//   if (!job) return null;

//   const getStageIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'extraction': return Database;
//       case 'transformation': return Settings;
//       case 'loading': return FileText;
//       case 'validation': return CheckCircle;
//       case 'processing': return Play;
//       case 'connection': return Database;
//       case 'transfer': return FileText;
//       case 'collection': return Database;
//       case 'rules': return Settings;
//       case 'ner': return Settings;
//       case 'etl': return Settings;
//       case 'businesslogic': return Settings;
//       default: return Settings;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
//       case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case 'completed': return 'bg-green-100 text-green-800 border-green-200';
//       case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'failed': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Job Details - {job.name}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Job Overview Cards */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <Card className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                       <Settings className="w-5 h-5 text-primary" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-sm mb-1">Pipeline Name</h4>
//                       <p className="text-sm text-muted-foreground">{job.pipelineName || 'Unknown'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                       <Clock className="w-5 h-5 text-primary" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-sm mb-1">Last Run</h4>
//                       <p className="text-sm text-muted-foreground">{job.lastRun || 'Never'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="hover:shadow-md transition-shadow">
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-3">
//                     <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                       <Database className="w-5 h-5 text-primary" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-sm mb-1">Connected Jobs</h4>
//                       <p className="text-sm text-muted-foreground">{job.isConnected ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Job Information */}
//           <Card>
//             <CardContent className="p-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="font-semibold mb-2">Job Information</h3>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm text-muted-foreground">Job Name:</span>
//                       <p className="font-medium">{job.name}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Category:</span>
//                       <p className="font-medium">{job.category}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Description:</span>
//                       <p className="font-medium">{job.description || 'No description available'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Glue Job Name:</span>
//                       <p className="font-medium">{job.glue_job_name || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Data Source:</span>
//                       <p className="font-medium">{job.datasource || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Data Destination:</span>
//                       <p className="font-medium">{job.datadestination || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold mb-2">Execution Details</h3>
//                   <div className="space-y-2">
//                     <div>
//                       <span className="text-sm text-muted-foreground">Status:</span>
//                       <Badge className={`${getStatusColor(job.status)} ml-2`}>
//                         {job.status}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Trigger Type:</span>
//                       <p className="font-medium">{job.triggerType || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Email:</span>
//                       <p className="font-medium">{job.email || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Schedule Details:</span>
//                       <p className="font-medium">
//                         {job.scheduleDetails?.frequency
//                           ? `${job.scheduleDetails.frequency} at ${job.scheduleDetails.time || 'N/A'}`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Folder Name:</span>
//                       <p className="font-medium">{job.folderName || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Job Stages */}
//           {job.stages && job.stages.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Job Stages ({job.stages.length})</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {job.stages.map((stage, index) => {
//                   const StageIcon = getStageIcon(stage.type);
//                   return (
//                     <Card key={stage.id} className="hover:shadow-md transition-shadow">
//                       <CardContent className="p-4">
//                         <div className="flex items-start gap-3">
//                           <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                             <StageIcon className="w-5 h-5 text-primary" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center gap-2 mb-2">
//                               <span className="text-xs font-medium text-muted-foreground">
//                                 Stage {index + 1}
//                               </span>
//                               {getStatusIcon(stage.status)}
//                             </div>
//                             <h4 className="font-medium text-sm mb-1 truncate">{stage.name}</h4>
//                             <Badge 
//                               variant="outline" 
//                               className={`text-xs ${getStatusColor(stage.status)}`}
//                             >
//                               {stage.status}
//                             </Badge>
//                             <p className="text-xs text-muted-foreground mt-2 capitalize">
//                               {stage.type.replace('_', ' ')}
//                             </p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Business Logic Rules */}
//           {job.business_logic_rules && Object.keys(job.business_logic_rules).length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Business Logic Rules</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Object.entries(job.business_logic_rules).map(([ruleName, ruleValue], index) => (
//                   <Card key={ruleName} className="hover:shadow-md transition-shadow">
//                     <CardContent className="p-4">
//                       <div className="flex items-start gap-3">
//                         <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                           <Settings className="w-5 h-5 text-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <h4 className="font-medium text-sm mb-1 truncate">{ruleName}</h4>
//                           <p className="text-xs text-muted-foreground">{ruleValue}</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from "react";
import { getPipelineJobs } from "@/lib/api"; // Adjust the import path as needed

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ScheduleDetails {
  frequency?: string;
  time?: string;
}

interface BusinessLogicRules {
  [key: string]: string;
}

interface Job {
  id: string;
  name: string;
  category: string;
  lastRun: string | null;
  status: string;
  description?: string;
  isConnected?: boolean;
  stages?: JobStage[];
  triggerType?: string;
  email?: string;
  glue_job_name?: string;
  scheduleDetails?: ScheduleDetails;
  datasource?: string;
  datadestination?: string;
  business_logic_rules?: BusinessLogicRules;
  folderName?: string;
  pipelineName?: string;
}

interface PipelineJob {
  createdAt: string;
  datadestination: string;
  jobId: string;
  triggerType: "SCHEDULE" | "File";
  Status: string;
  email: string;
  scheduleDetails: ScheduleDetails | {};
  jobName: string;
  user_id: string;
  glue_job_name?: string;
  steps: Record<string, string> | {};
  business_logic_rules: Record<string, string>;
  datasource: string;
  LastRun: string | null;
  FolderName?: string;
  FileName?: string;
  BucketName?: string;
  updatedAt?: string;
  etag?: string;
}

interface ViewJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewJobDialog01({ job, open, onOpenChange }: ViewJobDialogProps) {
  const [connectedJobsCount, setConnectedJobsCount] = useState<number>(0);

  useEffect(() => {
    const fetchConnectedJobs = async () => {
      if (job?.pipelineName && open) {
        try {
          // Assuming pipelineName follows a pattern like "pipeline-<uuid>"
          const pipelineIdMatch = job.pipelineName.match(/pipeline-(.+)/);
          if (pipelineIdMatch) {
            const pipelineId = pipelineIdMatch[1];
            const response = await getPipelineJobs(pipelineId);
            if (response.success) {
              const connectedCount = response.jobs.filter((j) => j.datadestination && j.datadestination.trim() !== "").length;
              setConnectedJobsCount(connectedCount);
            }
          }
        } catch (error) {
          console.error("Error fetching pipeline jobs:", error);
        }
      }
    };
    fetchConnectedJobs();
  }, [job?.pipelineName, open]);

  if (!job) return null;

  const getStageIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'extraction': return Database;
      case 'transformation': return Settings;
      case 'loading': return FileText;
      case 'validation': return CheckCircle;
      case 'processing': return Play;
      case 'connection': return Database;
      case 'transfer': return FileText;
      case 'collection': return Database;
      case 'rules': return Settings;
      case 'ner': return Settings;
      case 'datatransformations': return Settings;
      case 'businesslogic': return Settings;
      default: return Settings;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details - {job.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Overview Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">Pipeline Name</h4>
                      <p className="text-sm text-muted-foreground">{job.pipelineName || 'Unknown'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">Number of Connected Jobs</h4>
                      <p className="text-sm text-muted-foreground">{connectedJobsCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Job Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Job Name:</span>
                      <p className="font-medium">{job.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Category:</span>
                      <p className="font-medium">{job.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <p className="font-medium">{job.description || 'No description available'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Glue Job Name:</span>
                      <p className="font-medium">{job.glue_job_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Data Source:</span>
                      <p className="font-medium">{job.datasource || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Data Destination:</span>
                      <p className="font-medium">{job.datadestination || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Execution Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className={`${getStatusColor(job.status)} ml-2`}>
                        {job.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Trigger Type:</span>
                      <p className="font-medium">{job.triggerType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium">{job.email || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Schedule Details:</span>
                      <p className="font-medium">
                        {job.scheduleDetails?.frequency
                          ? `${job.scheduleDetails.frequency} at ${job.scheduleDetails.time || 'N/A'}`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Folder Name:</span>
                      <p className="font-medium">{job.folderName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Stages */}
          {job.stages && job.stages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Job Stages ({job.stages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {job.stages.map((stage, index) => {
                  const StageIcon = getStageIcon(stage.type);
                  return (
                    <Card key={stage.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <StageIcon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                Stage {index + 1}
                              </span>
                              {getStatusIcon(stage.status)}
                            </div>
                            <h4 className="font-medium text-sm mb-1 truncate">{stage.name}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(stage.status)}`}
                            >
                              {stage.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-2 capitalize">
                              {stage.type.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Business Logic Rules */}
          {job.business_logic_rules && Object.keys(job.business_logic_rules).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Business Logic Rules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(job.business_logic_rules).map(([ruleName, ruleValue], index) => (
                  <Card key={ruleName} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 truncate">{ruleName}</h4>
                          <p className="text-xs text-muted-foreground">{ruleValue}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}