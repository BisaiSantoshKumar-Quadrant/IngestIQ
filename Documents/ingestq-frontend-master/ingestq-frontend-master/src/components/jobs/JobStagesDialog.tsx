// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, X, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
//   description?: string;
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

// interface JobStagesDialogProps {
//   job: Job;
//   stages: JobStage[];
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (stages: JobStage[]) => void;
// }

// const stageTypes = [
//   { value: 'extraction', label: 'Data Extraction', icon: Database },
//   { value: 'transformation', label: 'Data Transformation', icon: Settings },
//   { value: 'loading', label: 'Data Loading', icon: FileText },
//   { value: 'validation', label: 'Data Validation', icon: CheckCircle },
//   { value: 'processing', label: 'Data Processing', icon: Play },
//   { value: 'connection', label: 'Connection', icon: Database },
//   { value: 'transfer', label: 'Data Transfer', icon: FileText },
//   { value: 'collection', label: 'Data Collection', icon: Database },
// ];

// export default function JobStagesDialog({ 
//   job, 
//   stages: initialStages, 
//   open, 
//   onOpenChange, 
//   onSave 
// }: JobStagesDialogProps) {
//   const [stages, setStages] = useState<JobStage[]>([]);
//   const [newStageName, setNewStageName] = useState("");
//   const [newStageType, setNewStageType] = useState("");
//   const [newStageDescription, setNewStageDescription] = useState("");

//   useEffect(() => {
//     setStages([...initialStages]);
//   }, [initialStages]);

//   const getStageIcon = (type: string) => {
//     const stageType = stageTypes.find(st => st.value === type);
//     return stageType?.icon || Settings;
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

//   const addStage = () => {
//     if (newStageName && newStageType) {
//       const newStage: JobStage = {
//         id: `stage_${Date.now()}`,
//         name: newStageName,
//         type: newStageType,
//         status: 'pending',
//         description: newStageDescription
//       };
//       setStages([...stages, newStage]);
//       setNewStageName("");
//       setNewStageType("");
//       setNewStageDescription("");
//     }
//   };

//   const removeStage = (stageId: string) => {
//     setStages(stages.filter(stage => stage.id !== stageId));
//   };

//   const updateStageStatus = (stageId: string, newStatus: string) => {
//     setStages(stages.map(stage => 
//       stage.id === stageId ? { ...stage, status: newStatus } : stage
//     ));
//   };

//   const handleSave = () => {
//     onSave(stages);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Edit Job Stages - {job.name}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Job Info */}
//           <div className="bg-muted/30 p-4 rounded-lg">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-sm text-muted-foreground">Job Name</Label>
//                 <p className="font-medium">{job.name}</p>
//               </div>
//               <div>
//                 <Label className="text-sm text-muted-foreground">Category</Label>
//                 <p className="font-medium">{job.category}</p>
//               </div>
//             </div>
//           </div>

//           {/* Current Stages */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold">Job Stages ({stages.length})</h3>
//               <Badge variant="outline" className="text-sm">
//                 Pipeline Instance
//               </Badge>
//             </div>
            
//             {stages.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {stages.map((stage, index) => {
//                   const StageIcon = getStageIcon(stage.type);
//                   return (
//                     <Card key={stage.id} className="relative group hover:shadow-md transition-shadow">
//                       <CardContent className="p-4">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
//                           onClick={() => removeStage(stage.id)}
//                         >
//                           <X className="w-3 h-3" />
//                         </Button>
                        
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
                            
//                             {/* Status Selector */}
//                             <Select 
//                               value={stage.status} 
//                               onValueChange={(value) => updateStageStatus(stage.id, value)}
//                             >
//                               <SelectTrigger className="w-full h-7 text-xs">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="running">Running</SelectItem>
//                                 <SelectItem value="completed">Completed</SelectItem>
//                                 <SelectItem value="failed">Failed</SelectItem>
//                               </SelectContent>
//                             </Select>
                            
//                             <p className="text-xs text-muted-foreground mt-2 capitalize">
//                               {stage.type.replace('_', ' ')}
//                             </p>
//                             {stage.description && (
//                               <p className="text-xs text-muted-foreground mt-1 truncate">
//                                 {stage.description}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                 <p>No stages defined for this job</p>
//                 <p className="text-sm">Add stages to define the job workflow</p>
//               </div>
//             )}
//           </div>

//           {/* Add New Stage */}
//           <Card className="border-dashed border-2">
//             <CardContent className="p-4">
//               <h4 className="font-medium mb-4">Add New Stage</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="stageName">Stage Name</Label>
//                   <Input
//                     id="stageName"
//                     placeholder="Enter stage name"
//                     value={newStageName}
//                     onChange={(e) => setNewStageName(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="stageType">Stage Type</Label>
//                   <Select value={newStageType} onValueChange={setNewStageType}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select stage type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {stageTypes.map((type) => (
//                         <SelectItem key={type.value} value={type.value}>
//                           <div className="flex items-center gap-2">
//                             <type.icon className="w-4 h-4" />
//                             {type.label}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               <div className="mt-4 space-y-2">
//                 <Label htmlFor="stageDescription">Description (Optional)</Label>
//                 <Textarea
//                   id="stageDescription"
//                   placeholder="Enter stage description"
//                   value={newStageDescription}
//                   onChange={(e) => setNewStageDescription(e.target.value)}
//                   rows={2}
//                 />
//               </div>
//               <Button onClick={addStage} className="mt-4 w-full" disabled={!newStageName || !newStageType}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Stage
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               Save Stages
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }


import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Shared interfaces - must match PipelineBuilderDialog
interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
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
}

interface JobStagesDialogProps {
  job: Job;
  stages: JobStage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stages: JobStage[]) => void;
}

const stageTypes = [
  { value: 'extraction', label: 'Data Extraction', icon: Database },
  { value: 'transformation', label: 'Data Transformation', icon: Settings },
  { value: 'loading', label: 'Data Loading', icon: FileText },
  { value: 'validation', label: 'Data Validation', icon: CheckCircle },
  { value: 'processing', label: 'Data Processing', icon: Play },
  { value: 'connection', label: 'Connection', icon: Database },
  { value: 'transfer', label: 'Data Transfer', icon: FileText },
  { value: 'collection', label: 'Data Collection', icon: Database },
];

export default function JobStagesDialog({ 
  job, 
  stages: initialStages, 
  open, 
  onOpenChange, 
  onSave 
}: JobStagesDialogProps) {
  const [stages, setStages] = useState<JobStage[]>([]);
  const [newStageName, setNewStageName] = useState("");
  const [newStageType, setNewStageType] = useState("");
  const [newStageDescription, setNewStageDescription] = useState("");

  useEffect(() => {
    setStages([...initialStages]);
  }, [initialStages]);

  const getStageIcon = (type: string) => {
    const stageType = stageTypes.find(st => st.value === type);
    return stageType?.icon || Settings;
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

  const addStage = () => {
    if (newStageName && newStageType) {
      const newStage: JobStage = {
        id: `stage_${Date.now()}`,
        name: newStageName,
        type: newStageType,
        status: 'pending',
        description: newStageDescription
      };
      setStages([...stages, newStage]);
      setNewStageName("");
      setNewStageType("");
      setNewStageDescription("");
    }
  };

  const removeStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const updateStageStatus = (stageId: string, newStatus: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, status: newStatus } : stage
    ));
  };

  const handleSave = () => {
    onSave(stages);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Stages - {job.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Info */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Job Name</Label>
                <p className="font-medium">{job.name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <p className="font-medium">{job.category}</p>
              </div>
            </div>
          </div>

          {/* Current Stages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Job Stages ({stages.length})</h3>
              <Badge variant="outline" className="text-sm">
                Pipeline Instance
              </Badge>
            </div>
            
            {stages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stages.map((stage, index) => {
                  const StageIcon = getStageIcon(stage.type);
                  return (
                    <Card key={stage.id} className="relative group hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
                          onClick={() => removeStage(stage.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        
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
                            
                            {/* Status Selector */}
                            <Select 
                              value={stage.status} 
                              onValueChange={(value) => updateStageStatus(stage.id, value)}
                            >
                              <SelectTrigger className="w-full h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="running">Running</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <p className="text-xs text-muted-foreground mt-2 capitalize">
                              {stage.type.replace('_', ' ')}
                            </p>
                            {stage.description && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {stage.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No stages defined for this job</p>
                <p className="text-sm">Add stages to define the job workflow</p>
              </div>
            )}
          </div>

          {/* Add New Stage */}
          <Card className="border-dashed border-2">
            <CardContent className="p-4">
              <h4 className="font-medium mb-4">Add New Stage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stageName">Stage Name</Label>
                  <Input
                    id="stageName"
                    placeholder="Enter stage name"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stageType">Stage Type</Label>
                  <Select value={newStageType} onValueChange={setNewStageType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="stageDescription">Description (Optional)</Label>
                <Textarea
                  id="stageDescription"
                  placeholder="Enter stage description"
                  value={newStageDescription}
                  onChange={(e) => setNewStageDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <Button onClick={addStage} className="mt-4 w-full" disabled={!newStageName || !newStageType}>
                <Plus className="w-4 h-4 mr-2" />
                Add Stage
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Stages
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}