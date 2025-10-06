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
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Plus, X, Database, FileText, Settings } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: any[];
// }

// interface JobConfigDialogProps {
//   job: Job;
//   jobData: any;
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSave: (jobData: any) => void;
// }

// const dataTypes = [
//   'data',
//   'json',
//   'csv',
//   'parquet',
//   'avro',
//   'xml',
//   'binary',
//   'stream'
// ];

// export default function JobConfigDialog({ 
//   job, 
//   jobData, 
//   open, 
//   onOpenChange, 
//   onSave 
// }: JobConfigDialogProps) {
//   const [jobName, setJobName] = useState("");
//   const [parameters, setParameters] = useState<Record<string, string>>({});
//   const [inputTypes, setInputTypes] = useState<string[]>([]);
//   const [outputTypes, setOutputTypes] = useState<string[]>([]);
//   const [newParamKey, setNewParamKey] = useState("");
//   const [newParamValue, setNewParamValue] = useState("");

//   useEffect(() => {
//     if (jobData) {
//       setJobName(jobData.name || job.name);
//       setParameters(jobData.parameters || {});
//       setInputTypes(jobData.inputTypes || ['data']);
//       setOutputTypes(jobData.outputTypes || ['data']);
//     }
//   }, [jobData, job]);

//   const addParameter = () => {
//     if (newParamKey && newParamValue) {
//       setParameters(prev => ({
//         ...prev,
//         [newParamKey]: newParamValue
//       }));
//       setNewParamKey("");
//       setNewParamValue("");
//     }
//   };

//   const removeParameter = (key: string) => {
//     setParameters(prev => {
//       const newParams = { ...prev };
//       delete newParams[key];
//       return newParams;
//     });
//   };

//   const addInputType = (type: string) => {
//     if (!inputTypes.includes(type)) {
//       setInputTypes(prev => [...prev, type]);
//     }
//   };

//   const removeInputType = (type: string) => {
//     setInputTypes(prev => prev.filter(t => t !== type));
//   };

//   const addOutputType = (type: string) => {
//     if (!outputTypes.includes(type)) {
//       setOutputTypes(prev => [...prev, type]);
//     }
//   };

//   const removeOutputType = (type: string) => {
//     setOutputTypes(prev => prev.filter(t => t !== type));
//   };

//   const handleSave = () => {
//     onSave({
//       name: jobName,
//       parameters,
//       inputTypes,
//       outputTypes,
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Configure Job - {job.name}</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Basic Configuration */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Basic Configuration</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="jobName">Job Instance Name</Label>
//                 <Input
//                   id="jobName"
//                   value={jobName}
//                   onChange={(e) => setJobName(e.target.value)}
//                   placeholder="Enter custom name for this job instance"
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <Label className="text-sm text-muted-foreground">Original Job</Label>
//                   <p className="font-medium">{job.name}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm text-muted-foreground">Category</Label>
//                   <p className="font-medium">{job.category}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Parameters */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Parameters</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Existing Parameters */}
//               {Object.entries(parameters).length > 0 && (
//                 <div className="space-y-2">
//                   {Object.entries(parameters).map(([key, value]) => (
//                     <div key={key} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
//                       <div className="flex-1 grid grid-cols-2 gap-2">
//                         <span className="font-medium text-sm">{key}</span>
//                         <span className="text-sm">{value}</span>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-6 h-6 p-0"
//                         onClick={() => removeParameter(key)}
//                       >
//                         <X className="w-3 h-3" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Add New Parameter */}
//               <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
//                 <div className="grid grid-cols-2 gap-2 mb-2">
//                   <Input
//                     placeholder="Parameter name"
//                     value={newParamKey}
//                     onChange={(e) => setNewParamKey(e.target.value)}
//                   />
//                   <Input
//                     placeholder="Parameter value"
//                     value={newParamValue}
//                     onChange={(e) => setNewParamValue(e.target.value)}
//                   />
//                 </div>
//                 <Button 
//                   onClick={addParameter} 
//                   className="w-full" 
//                   disabled={!newParamKey || !newParamValue}
//                   size="sm"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Parameter
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Input/Output Types */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Input Types */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Database className="w-4 h-4" />
//                   Input Types
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-wrap gap-1">
//                   {inputTypes.map((type) => (
//                     <Badge key={type} variant="secondary" className="text-xs">
//                       {type}
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-3 h-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
//                         onClick={() => removeInputType(type)}
//                       >
//                         <X className="w-2 h-2" />
//                       </Button>
//                     </Badge>
//                   ))}
//                 </div>
                
//                 <Select onValueChange={addInputType}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Add input type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {dataTypes.filter(type => !inputTypes.includes(type)).map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>

//             {/* Output Types */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <FileText className="w-4 h-4" />
//                   Output Types
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-wrap gap-1">
//                   {outputTypes.map((type) => (
//                     <Badge key={type} variant="secondary" className="text-xs">
//                       {type}
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="w-3 h-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
//                         onClick={() => removeOutputType(type)}
//                       >
//                         <X className="w-2 h-2" />
//                       </Button>
//                     </Badge>
//                   ))}
//                 </div>
                
//                 <Select onValueChange={addOutputType}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Add output type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {dataTypes.filter(type => !outputTypes.includes(type)).map((type) => (
//                       <SelectItem key={type} value={type}>
//                         {type}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-2 pt-4 border-t">
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>
//               Save Configuration
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Database, FileText, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Shared interfaces - must match PipelineBuilderDialog
interface Job {
  id: string;
  name: string;
  category: string;
  lastRun: string;
  status: string;
  description?: string;
  isConnected?: boolean;
  stages?: any[];
}

interface JobConfigDialogProps {
  job: Job;
  jobData: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobData: any) => void;
}

const dataTypes = [
  'data',
  'json',
  'csv',
  'parquet',
  'avro',
  'xml',
  'binary',
  'stream'
];

export default function JobConfigDialog({ 
  job, 
  jobData, 
  open, 
  onOpenChange, 
  onSave 
}: JobConfigDialogProps) {
  const [jobName, setJobName] = useState("");
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [inputTypes, setInputTypes] = useState<string[]>([]);
  const [outputTypes, setOutputTypes] = useState<string[]>([]);
  const [newParamKey, setNewParamKey] = useState("");
  const [newParamValue, setNewParamValue] = useState("");

  useEffect(() => {
    if (jobData) {
      setJobName(jobData.name || job.name);
      setParameters(jobData.parameters || {});
      setInputTypes(jobData.inputTypes || ['data']);
      setOutputTypes(jobData.outputTypes || ['data']);
    }
  }, [jobData, job]);

  const addParameter = () => {
    if (newParamKey && newParamValue) {
      setParameters(prev => ({
        ...prev,
        [newParamKey]: newParamValue
      }));
      setNewParamKey("");
      setNewParamValue("");
    }
  };

  const removeParameter = (key: string) => {
    setParameters(prev => {
      const newParams = { ...prev };
      delete newParams[key];
      return newParams;
    });
  };

  const addInputType = (type: string) => {
    if (!inputTypes.includes(type)) {
      setInputTypes(prev => [...prev, type]);
    }
  };

  const removeInputType = (type: string) => {
    setInputTypes(prev => prev.filter(t => t !== type));
  };

  const addOutputType = (type: string) => {
    if (!outputTypes.includes(type)) {
      setOutputTypes(prev => [...prev, type]);
    }
  };

  const removeOutputType = (type: string) => {
    setOutputTypes(prev => prev.filter(t => t !== type));
  };

  const handleSave = () => {
    onSave({
      name: jobName,
      parameters,
      inputTypes,
      outputTypes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Job - {job.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jobName">Job Instance Name</Label>
                <Input
                  id="jobName"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter custom name for this job instance"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Original Job</Label>
                  <p className="font-medium">{job.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="font-medium">{job.category}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Parameters */}
              {Object.entries(parameters).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <span className="font-medium text-sm">{key}</span>
                        <span className="text-sm">{value}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={() => removeParameter(key)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Parameter */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Parameter name"
                    value={newParamKey}
                    onChange={(e) => setNewParamKey(e.target.value)}
                  />
                  <Input
                    placeholder="Parameter value"
                    value={newParamValue}
                    onChange={(e) => setNewParamValue(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={addParameter} 
                  className="w-full" 
                  disabled={!newParamKey || !newParamValue}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Parameter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Input/Output Types */}
          <div className="grid grid-cols-2 gap-4">
            {/* Input Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Input Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {inputTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-3 h-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeInputType(type)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Select onValueChange={addInputType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add input type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.filter(type => !inputTypes.includes(type)).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Output Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Output Types
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {outputTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-3 h-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeOutputType(type)}
                      >
                        <X className="w-2 h-2" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Select onValueChange={addOutputType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add output type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes.filter(type => !outputTypes.includes(type)).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}