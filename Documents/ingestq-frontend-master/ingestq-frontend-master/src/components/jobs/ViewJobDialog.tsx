// recent my code

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
//   FileName?: string;
//   BucketName?: string;
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

//   const filePath = job.BucketName && job.FileName ? `${job.BucketName}/${job.FileName}` : 'N/A';

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
//                       <span className="text-sm text-muted-foreground">Name:</span>
//                       <p className="font-medium">{job.name}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">Description:</span>
//                       <p className="font-medium">{job.description || 'No description available'}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-muted-foreground">File Path:</span>
//                       <p className="font-medium">{filePath}</p>
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
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-muted-foreground">Status:</span>
//                       <Badge className={`${getStatusColor(job.status)}`}>
//                         {job.status}
//                       </Badge>
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

//           {/* Job Steps */}
//           {job.stages && job.stages.length > 0 && (
//             <div>
//               <h3 className="text-lg font-semibold mb-4">Job Steps ({job.stages.length})</h3>
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
//                                 Step {index + 1}
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

//recent my code


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { format } from "date-fns";
 
interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
}
 
interface Job {
  id: string;
  name: string;
  category: string;
  lastRun: string;
  status: string;
  description?: string;
  isConnected?: boolean;
  stages?: JobStage[];
  FileName?: string;
  BucketName?: string;
  datadestination?: string;
}
 
interface ViewJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
 
export default function ViewJobDialog({ job, open, onOpenChange }: ViewJobDialogProps) {
  if (!job) return null;
 
  const getStageIcon = (type: string) => {
    switch (type) {
      case 'extraction': return Database;
      case 'transformation': return Settings;
      case 'loading': return FileText;
      case 'validation': return CheckCircle;
      case 'processing': return Play;
      case 'connection': return Database;
      case 'transfer': return FileText;
      case 'collection': return Database;
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
 
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch {
      return "Invalid Date";
    }
  };
 
  const sourceFilePath = job.BucketName && job.FileName ? `${job.BucketName}/${job.FileName}` : 'N/A';
  const destinationPath = job.datadestination || 'N/A';
  const isPipelineConnected = job.stages && job.stages.length > 0 ? 'Yes' : 'No';
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Details - {job.name}</DialogTitle>
        </DialogHeader>
 
        <div className="space-y-6">
          {/* Job Information */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Job Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{job.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Description:</span>
                      <p className="font-medium">{job.description || 'No description available'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Source File Path:</span>
                      <p className="font-medium">{sourceFilePath}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Destination File Path:</span>
                      <p className="font-medium">{destinationPath}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Execution Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Last Run:</span>
                      <p className="font-medium">{formatDateTime(job.lastRun)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className={`${getStatusColor(job.status)}`}>
                        {job.status}
                      </Badge>
                    </div>
                    {/* <div>
                      <span className="text-sm text-muted-foreground">Pipeline Connected:</span>
                      <p className="font-medium">{isPipelineConnected}</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
 
          {/* Job Steps */}
          {job.stages && job.stages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Job Steps ({job.stages.length})</h3>
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
                                Step {index + 1}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
 