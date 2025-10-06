import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StageConfigDialog01 from './StageConfigDialog01';
import { JobStepConfig, editJob, EditJobRequest } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  config?: Record<string, any>;
  datasource?: string;
  datadestination?: string;
  glue_name?: string;
  gname?: string;
  jobId?: string;
  jobName?: string;
  job_type?: string;
  pipeline?: string;
  resourcegroup?: string;
  scheduleDetails?: any;
  steps?: Record<string, string>;
  triggerType?: string;
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
  steps: JobStepConfig;
  business_logic_rules?: Record<string, string>;
  jobId: string;
  jobName: string;
  triggerType: "SCHEDULE" | "File";
  datasource: string;
  datadestination: string;
  scheduleDetails: any;
  jobType?: string;
  glueName?: string;
  gname?: string;
  glue_name?: string;
  resourcegroup?: string;
  datafactory?: string;
  pipeline?: string;
}

interface EnhancedEditJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobId: string, stages: JobStage[]) => void;
}

// Available steps
const availableSteps = [
  { id: 'upload_center', name: 'Data Upload Center', icon: Database, color: '#3b82f6', description: 'Manage data extraction and destination', fixed: true },
  { id: 'loading', name: 'Schema Analysis', icon: Target, color: '#10b981', description: 'Analyze schema of the data', fixed: true },
  { id: 'validation', name: 'DQ Rules', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency', fixed: false },
  { id: 'processing', name: 'NER', icon: Settings, color: '#ef4444', description: 'Named Entity Recognition processing', fixed: false },
  { id: 'collection', name: 'Business Logic', icon: Database, color: '#6b7280', description: 'Apply business logic to collected data', fixed: false },
  { id: 'connection', name: 'Data Transformations', icon: Database, color: '#3b82f6', description: 'Extract, Transform, Load processes', fixed: false },
  { id: 'transfer', name: 'Schedule Jobs', icon: Target, color: '#10b981', description: 'Schedule automated job runs', fixed: true },
];

function DraggableStepItem({ step, disabled = false }: { step: typeof availableSteps[0], disabled?: boolean }) {
  const StepIcon = step.icon;

  return (
    <Card
      className={`cursor-${disabled ? 'not-allowed' : 'grab'} hover:shadow-md transition-all border-l-4 active:cursor-grabbing ${disabled ? 'opacity-50' : ''}`}
      style={{ borderLeftColor: step.color }}
      draggable={!disabled}
      onDragStart={(e) => {
        if (disabled) return;
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'new-step',
          step: step
        }));
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${step.color}20` }}
          >
            <StepIcon className="w-4 h-4" style={{ color: step.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{step.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {step.description}
            </p>
          </div>
          {!disabled && <Plus className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );
}

function SortableStageItem({ stage, index, onEdit, onDelete, disabled = false }: {
  stage: JobStage;
  index: number;
  onEdit: (stage: JobStage) => void;
  onDelete: (stageId: string) => void;
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stepInfo = availableSteps.find(step => step.id === stage.type);
  const StepIcon = stepInfo?.icon || Settings;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Play className="w-4 h-4 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium z-10">
        {index + 1}
      </div>
      <Card
        ref={setNodeRef}
        className={`cursor-pointer hover:shadow-md transition-all border-l-4 ml-4 ${disabled ? 'opacity-50' : ''}`}
        style={{
          ...style,
          borderLeftColor: stepInfo?.color || '#e5e7eb'
        }}
        onClick={() => onEdit(stage)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className={`cursor-${disabled ? 'not-allowed' : 'grab'} hover:cursor-grabbing`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${stepInfo?.color}20` }}
            >
              <StepIcon className="w-5 h-5" style={{ color: stepInfo?.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{stage.name}</h4>
                {getStatusIcon(stage.status)}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {stage.type.replace('_', ' ')}
              </p>
              {stage.description && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {stage.description}
                </p>
              )}
            </div>

            {!disabled && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 hover:bg-red-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(stage.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DropZone({ index, onDrop, disabled = false }: { index: number; onDrop: (index: number, data: any) => void; disabled?: boolean }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`h-8 flex items-center justify-center transition-all ${isOver && !disabled ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
        }`}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsOver(false);
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        onDrop(index, data);
      }}
    >
      {isOver && !disabled && (
        <div className="text-xs text-primary font-medium">Drop here to insert</div>
      )}
    </div>
  );
}

export default function EnhancedEditJobDialog({
  job,
  open,
  onOpenChange,
  onSave
}: EnhancedEditJobDialogProps) {
  const { toast } = useToast();
  const [stages, setStages] = useState<JobStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
  const [stageConfigDialogOpen, setStageConfigDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editable fields
  const [jobName, setJobName] = useState("");
  const [datasource, setDatasource] = useState("");
  const [datadestination, setDatadestination] = useState("");
  const [businessLogicRules, setBusinessLogicRules] = useState<Array<{ key: string; value: string }>>([]);

  // Non-editable fields (will be sent to API)
  const [jobType, setJobType] = useState<string | undefined>();
  const [gname, setGname] = useState<string | undefined>();
  const [glueName, setGlueName] = useState<string | undefined>();
  const [resourcegroup, setResourcegroup] = useState<string | undefined>();
  const [datafactory, setDatafactory] = useState<string | undefined>();
  const [pipeline, setPipeline] = useState<string | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (job && job.steps) {
      // Set editable fields
      setJobName(job.jobName || job.name);
      setDatasource(job.datasource || "");
      setDatadestination(job.datadestination || "");

      // Set business logic rules
      if (job.business_logic_rules) {
        const rulesArray = Object.entries(job.business_logic_rules).map(([key, value]) => ({
          key,
          value: value as string
        }));
        setBusinessLogicRules(rulesArray);
      }

      // Set non-editable fields
      setJobType(job.jobType);
      setGname(job.gname);
      setGlueName(job.glueName || job.glue_name);
      setResourcegroup(job.resourcegroup);
      setDatafactory(job.datafactory);
      setPipeline(job.pipeline);

      // Initialize stages
      const fixedSteps: JobStage[] = availableSteps
        .filter(step => step.fixed)
        .map(step => {
          let config: Record<string, any> = {};
          if (step.id === 'upload_center') {
            config = {
              sourcePath: job.datasource,
              destinationPath: job.datadestination
            };
          } else if (step.id === 'transfer') {
            config = {
              triggerType: job.triggerType,
              frequency: job.scheduleDetails?.frequency,
              time: job.scheduleDetails?.time
            };
          }
          return {
            id: `stage_${job.id}_${step.id}`,
            name: step.name,
            type: step.id,
            status: job.stages?.find(s => s.type === step.id)?.status || 'pending',
            description: step.description as string | undefined,
            config
          } as JobStage;
        });

      const stepTypeMapping: { [key: string]: string } = {
        rules: 'validation',
        ner: 'processing',
        businessLogic: 'collection',
        datatransformations: 'connection'
      };

      const usedSteps: JobStage[] = Object.entries(job.steps)
        .filter(([_, status]) => status === 'executed')
        .map(([key]) => {
          const stepId = stepTypeMapping[key];
          const stepInfo = availableSteps.find(step => step.id === stepId);
          if (!stepInfo) return null;
          return {
            id: `stage_${job.id}_${stepId}`,
            name: stepInfo.name,
            type: stepId,
            status: job.stages?.find(s => s.type === stepId)?.status || 'pending',
            description: stepInfo.description as string | undefined,
            config: {} as Record<string, any> | undefined
          } as JobStage;
        })
        .filter((step): step is JobStage => step !== null);

      const mergedStages: JobStage[] = [
        fixedSteps.find(fs => fs.type === 'upload_center'),
        ...usedSteps,
        fixedSteps.find(fs => fs.type === 'loading'),
        fixedSteps.find(fs => fs.type === 'transfer'),
      ].filter((stage): stage is JobStage => stage !== null && stage !== undefined);

      setStages(mergedStages);
// TEMP DEBUG: Log the transfer stage config
const transferStage = mergedStages.find(s => s.type === 'transfer');
console.log('🔍 Transfer stage config on init:', transferStage?.config);
      // Initialize localStorage
      localStorage.setItem('rules', job.steps.rules);
      localStorage.setItem('ner', job.steps.ner);
      localStorage.setItem('businesslogic', job.steps.businessLogic);
      localStorage.setItem('datatransformations', job.steps.datatransformations || 'skipped');
    }
  }, [job]);

  const filteredAvailableSteps = availableSteps.filter(
    step => !step.fixed && !stages.some(s => s.type === step.id)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const fixedStepIndices = items
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => availableSteps.find(step => step.id === item.type)?.fixed)
          .map(({ index }) => index);

        if (fixedStepIndices.includes(oldIndex) || fixedStepIndices.includes(newIndex)) {
          return items;
        }

        const uploadIndex = items.findIndex(s => s.type === 'upload_center');
        const loadingIndex = items.findIndex(s => s.type === 'loading');
        if (newIndex <= uploadIndex || newIndex >= loadingIndex) return items;

        const nonFixedItems = items.slice(uploadIndex + 1, loadingIndex);
        const nonFixedOldIndex = nonFixedItems.findIndex(item => item.id === active.id);
        const nonFixedNewIndex = newIndex - (uploadIndex + 1);

        if (nonFixedOldIndex === -1 || nonFixedNewIndex < 0 || nonFixedNewIndex > nonFixedItems.length) return items;

        const newNonFixedItems = arrayMove(nonFixedItems, nonFixedOldIndex, nonFixedNewIndex);

        return [
          ...items.slice(0, uploadIndex + 1),
          ...newNonFixedItems,
          ...items.slice(loadingIndex)
        ];
      });
    }
  };

  const handleDropAtPosition = (index: number, data: any) => {
    if (data.type === 'new-step') {
      const stepInfo = availableSteps.find(step => step.id === data.step.id);
      if (stepInfo?.fixed) return;

      const uploadIndex = stages.findIndex(s => s.type === 'upload_center');
      const loadingIndex = stages.findIndex(s => s.type === 'loading');
      if (index <= uploadIndex || index > loadingIndex) return;

      const newStage: JobStage = {
        id: `stage_${Date.now()}`,
        name: data.step.name,
        type: data.step.id,
        status: 'pending',
        description: data.step.description,
        config: {}
      };

      setStages(prev => {
        const newStages = [...prev];
        newStages.splice(index, 0, newStage);
        if (newStage.type === 'validation') localStorage.setItem('rules', 'executed');
        if (newStage.type === 'processing') localStorage.setItem('ner', 'executed');
        if (newStage.type === 'collection') localStorage.setItem('businesslogic', 'executed');
        if (newStage.type === 'connection') localStorage.setItem('datatransformations', 'executed');
        return newStages;
      });

      toast({
        title: "Stage Added",
        description: `${data.step.name} has been added to position ${index + 1}`,
      });
    }
  };

  const addStepToEnd = (step: typeof availableSteps[0]) => {
    if (step.fixed) return;

    const newStage: JobStage = {
      id: `stage_${Date.now()}`,
      name: step.name,
      type: step.id,
      status: 'pending',
      description: step.description,
      config: {}
    };
    setStages(prev => {
      const loadingIndex = prev.findIndex(s => s.type === 'loading');
      const newStages = [...prev];
      newStages.splice(loadingIndex, 0, newStage);
      if (newStage.type === 'validation') localStorage.setItem('rules', 'executed');
      if (newStage.type === 'processing') localStorage.setItem('ner', 'executed');
      if (newStage.type === 'collection') localStorage.setItem('businesslogic', 'executed');
      if (newStage.type === 'connection') localStorage.setItem('datatransformations', 'executed');
      return newStages;
    });

    toast({
      title: "Stage Added",
      description: `${step.name} has been added to the job`,
    });
  };

  const handleEditStage = (stage: JobStage) => {
    setSelectedStage(stage);
    setStageConfigDialogOpen(true);
  };

  const handleDeleteStage = (stageId: string) => {
    const stageToDelete = stages.find(s => s.id === stageId);
    if (stageToDelete) {
      if (availableSteps.find(step => step.id === stageToDelete.type)?.fixed) {
        toast({
          variant: "destructive",
          title: "Cannot Delete",
          description: "This is a required stage and cannot be deleted.",
        });
        return;
      }

      setStages(stages.filter(s => s.id !== stageId));
      if (stageToDelete.type === 'validation') localStorage.setItem('rules', 'skipped');
      if (stageToDelete.type === 'processing') localStorage.setItem('ner', 'skipped');
      if (stageToDelete.type === 'collection') localStorage.setItem('businesslogic', 'skipped');
      if (stageToDelete.type === 'connection') localStorage.setItem('datatransformations', 'skipped');

      toast({
        title: "Stage Removed",
        description: `${stageToDelete.name} has been removed from the pipeline.`,
      });
    }
  };

  const handleSaveStageConfig = (updatedStage: JobStage) => {
    console.log('Received updated stage from dialog:', updatedStage);
    
    // Special handling for transformation stage
    if (updatedStage.type === 'connection' && updatedStage.config) {
      const transformationConfig = updatedStage.config;
      
      // Extract file paths from transformation config
      if (transformationConfig.file_paths) {
        const filePaths = Object.keys(transformationConfig.file_paths);
        if (filePaths.length > 0) {
          // Update datasource with transformation files
          updatedStage.datasource = filePaths.join(',');
          
          // Also update the main job datasource if this is the first file
          if (!datasource && filePaths.length > 0) {
            setDatasource(filePaths[0]);
          }
        }
      }
    }
    
    setStages(prev => {
      const updated = prev.map(stage =>
        stage.id === updatedStage.id
          ? {
              ...stage,
              config: updatedStage.config,
              datasource: updatedStage.datasource,
              datadestination: updatedStage.datadestination,
            }
          : stage
      );
      console.log('Updated stages array:', updated);
      return updated;
    });
    setStageConfigDialogOpen(false);
    setSelectedStage(null);
  };

  const addBusinessLogicRule = () => {
    setBusinessLogicRules([...businessLogicRules, { key: "", value: "" }]);
  };

  const updateBusinessLogicRule = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...businessLogicRules];
    updated[index][field] = value;
    setBusinessLogicRules(updated);
  };

  const removeBusinessLogicRule = (index: number) => {
    setBusinessLogicRules(businessLogicRules.filter((_, i) => i !== index));
  };

const handleSave = async () => {
  if (!job) return;

  // Validation
  if (!jobName.trim()) {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Job name is required",
    });
    return;
  }

  const scheduleStage = stages.find(s => s.type === 'transfer');
  const scheduleConfig = scheduleStage?.config;
  
  if (!scheduleConfig || !scheduleConfig.triggerType) {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Please configure the Schedule Jobs stage before saving",
    });
    return;
  }

  const finalTriggerType = scheduleConfig.triggerType;
  const finalScheduleFrequency = scheduleConfig.frequency;
  const finalScheduleTime = scheduleConfig.time;

  if (finalTriggerType === "SCHEDULE" && (!finalScheduleFrequency || !finalScheduleTime)) {
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: "Schedule frequency and time are required for scheduled jobs. Please configure them in the Schedule Jobs stage.",
    });
    return;
  }

  setIsSaving(true);

  try {
    // Build steps from stages
    const steps: JobStepConfig = {
      rules: stages.some(s => s.type === 'validation') ? 'executed' : 'skipped',
      ner: stages.some(s => s.type === 'processing') ? 'executed' : 'skipped',
      businessLogic: stages.some(s => s.type === 'collection') ? 'executed' : 'skipped',
      datatransformations: stages.some(s => s.type === 'connection') ? 'executed' : 'skipped',
    };

    // Get transformation files from connection stage
    const transformationStage = stages.find(s => s.type === 'connection');
    let transformationFiles: string[] = [];
    
    if (transformationStage?.config?.file_paths) {
      transformationFiles = Object.keys(transformationStage.config.file_paths);
    }

    // Convert business logic rules array to object
    const businessLogicRulesObject: Record<string, string> = {};
    businessLogicRules.forEach(rule => {
      if (rule.key.trim() && rule.value.trim()) {
        businessLogicRulesObject[rule.key] = rule.value;
      }
    });

    const uploadCenterStage = stages.find(s => s.type === 'upload_center');
    console.log('Upload Center Stage:', uploadCenterStage);
    console.log('Upload Center Config:', uploadCenterStage?.config);

    // Prefer transformation files first, then stage datasource, then job datasource
    const finalDatasource = transformationFiles.length > 0 
      ? transformationFiles.join(',')
      : uploadCenterStage?.datasource || uploadCenterStage?.config?.sourcePath || job.datasource;
      
    const finalDatadestination = uploadCenterStage?.datadestination || uploadCenterStage?.config?.destinationPath || job.datadestination;

    console.log('Final datasource:', finalDatasource);
    console.log('Final datadestination:', finalDatadestination);

    // Build edit request
    const editJobRequest: EditJobRequest = {
      jobId: job.jobId,
      jobName: jobName.trim(),
      triggerType: finalTriggerType,
      steps,
      datasource: finalDatasource,
      datadestination: finalDatadestination,
      scheduleDetails: finalTriggerType === "SCHEDULE" ? {
        frequency: finalScheduleFrequency,
        time: finalScheduleTime,
      } : undefined,
      business_logic_rules: Object.keys(businessLogicRulesObject).length > 0 ? businessLogicRulesObject : undefined,
      // Include non-editable fields
      job_type: jobType,
      gname: gname,
      glue_name: glueName,
      resourcegroup: resourcegroup,
      datafactory: datafactory,
      pipeline: pipeline,
    };

    console.log("Sending edit request:", editJobRequest);

    const response = await editJob(editJobRequest);

    if (response.success) {
      toast({
        title: "Job Updated",
        description: "Job has been updated successfully.",
      });

      // Call the parent's onSave to update the job list
      onSave(job.jobId, stages);

      // Close dialog
      onOpenChange(false);
    } else {
      throw new Error(response.message || "Failed to update job.");
    }
  } catch (error: any) {
    console.error("Error updating job:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "Failed to update job. Please try again.",
    });
  } finally {
    setIsSaving(false);
  }
};

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Job: {job.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Job Configuration Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Job Configuration</h3>

              {/* Non-editable info banner */}
              {(jobType || gname || glueName || resourcegroup) && (
                <div className="bg-muted/50 border rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Job Type Information (Read-only):</p>
                    {jobType && <p>Type: {jobType}</p>}
                    {gname && <p>GName: {gname}</p>}
                    {glueName && <p>Glue Name: {glueName}</p>}
                    {resourcegroup && <p>Resource Group: {resourcegroup}</p>}
                    {datafactory && <p>Data Factory: {datafactory}</p>}
                    {pipeline && <p>Pipeline: {pipeline}</p>}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Name */}
                <div className="space-y-2">
                  <Label htmlFor="jobName">Job Name *</Label>
                  <Input
                    id="jobName"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    placeholder="Enter job name"
                  />
                </div>
              </div>

              {/* Data Source & Destination */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="datasource">Data Source</Label>
                  <Input
                    id="datasource"
                    value={datasource}
                    onChange={(e) => setDatasource(e.target.value)}
                    placeholder="e.g., s3://bucket/path/file.csv"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="datadestination">Data Destination</Label>
                  <Input
                    id="datadestination"
                    value={datadestination}
                    onChange={(e) => setDatadestination(e.target.value)}
                    placeholder="e.g., s3://bucket/output/"
                  />
                </div>
              </div> */}

              {/* Business Logic Rules */}
              {/* <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Business Logic Rules</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBusinessLogicRule}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Rule
                  </Button>
                </div>
                {businessLogicRules.length > 0 ? (
                  <div className="space-y-2">
                    {businessLogicRules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Rule name"
                          value={rule.key}
                          onChange={(e) => updateBusinessLogicRule(index, 'key', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Rule logic"
                          value={rule.value}
                          onChange={(e) => updateBusinessLogicRule(index, 'value', e.target.value)}
                          className="flex-[2]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeBusinessLogicRule(index)}
                          className="flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No business logic rules defined</p>
                )}
              </div> */}
            </CardContent>
          </Card>

          {/* Stage Pipeline Section */}
          <div className="flex gap-6">
            {/* Left Panel - Available Steps */}
            <div className="w-80 flex flex-col">
              <h3 className="font-semibold mb-4">Available Steps</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {filteredAvailableSteps.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm">All available steps have been added</p>
                  </div>
                ) : (
                  filteredAvailableSteps.map((step) => (
                    <div key={step.id} onClick={() => addStepToEnd(step)}>
                      <DraggableStepItem step={step} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Job Stage Pipeline */}
            <div className="flex-1 border-l pl-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
                <div className="text-sm text-muted-foreground">
                  Click + to add stages • Click to configure
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {stages.length === 0 ? (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-2">No stages added</p>
                      <p className="text-sm text-muted-foreground">Click steps from the left panel to build your pipeline</p>
                    </div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1">
                        <DropZone index={0} onDrop={handleDropAtPosition} disabled={stages[0]?.type === 'upload_center'} />
                        {stages.map((stage, index) => {
                          const loadingIndex = stages.findIndex(s => s.type === 'loading');
                          return (
                            <div key={stage.id}>
                              <SortableStageItem
                                stage={stage}
                                index={index}
                                onEdit={handleEditStage}
                                onDelete={handleDeleteStage}
                                disabled={availableSteps.find(step => step.id === stage.type)?.fixed}
                              />
                              <DropZone
                                index={index + 1}
                                onDrop={handleDropAtPosition}
                                disabled={(index + 1) > loadingIndex}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

        {/* Stage Configuration Dialog */}
        {selectedStage && (
          <StageConfigDialog01
            stage={selectedStage}
            open={stageConfigDialogOpen}
            onOpenChange={setStageConfigDialogOpen}
            onSave={handleSaveStageConfig}
            jobDatasource={job.datasource}
            jobDatadestination={job.datadestination}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}