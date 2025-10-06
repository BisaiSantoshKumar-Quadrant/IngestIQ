import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, Calendar } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import StageConfigDialog from './StageConfigDialog';
import { Job, JobStage } from '@/components/types/jobs';
import { createJobConfig, CreateJobConfigRequest, JobStepConfig, ScheduleDetails } from "@/pages/ScheduleJob";

// Extend Job interface to include config
interface JobConfig {
  jobName: string;
  triggerType: "SCHEDULE" | "File";
  steps: JobStepConfig;
  datasource: string;         // e.g., "s3://bucket/key.csv"
  datadestination: string;    // e.g., "s3://bucket/output/"
  scheduleDetails?: ScheduleDetails;
  business_logic_rules?: { [key: string]: string };
  job_type?: string;
  glue_name?: string;
  gname: string;
}

interface ExtendedJob extends Job {
  config?: JobConfig;
}

interface EnhancedEditJobDialogProps {
  job: ExtendedJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobId: string, stages: JobStage[], jobName: string) => void;
}

const availableSteps = [
  { id: 'upload_center', name: 'Data Upload Center', icon: Database, color: '#3b82f6', description: 'Manage data extraction and destination' },
  { id: 'loading', name: 'Schema Analysis', icon: Target, color: '#10b981', description: 'Analyze schema of the data' },
  { id: 'validation', name: 'DQ Rules', icon: Filter, color: '#f59e0b', description: 'Validate data quality and consistency' },
  { id: 'processing', name: 'NER', icon: Settings, color: '#ef4444', description: 'Named Entity Recognition processing' },
  { id: 'collection', name: 'Business Logic', icon: Database, color: '#6b7280', description: 'Apply business logic to collected data' },
  { id: 'connection', name: 'Data Transformations', icon: Database, color: '#3b82f6', description: 'Extract, Transform, Load processes' },
  { id: 'transfer', name: 'Schedule Jobs', icon: Target, color: '#10b981', description: 'Schedule automated job runs' },
];

function DraggableStepItem({ step }: { step: typeof availableSteps[0] }) {
  const StepIcon = step.icon;
  
  return (
    <Card 
      className="cursor-grab hover:shadow-md transition-all border-l-4 active:cursor-grabbing"
      style={{ borderLeftColor: step.color }}
      draggable
      onDragStart={(e) => {
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
          <Plus className="w-4 h-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}

function SortableStageItem({ stage, index, onEdit, onDelete }: {
  stage: JobStage;
  index: number;
  onEdit: (stage: JobStage) => void;
  onDelete: (stageId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

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
        className="cursor-pointer hover:shadow-md transition-all border-l-4 ml-4"
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
              className="cursor-grab hover:cursor-grabbing"
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

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(stage.id);
                  switch (stage.type) {
                    case 'loading':
                      localStorage.setItem('schema', 'skipped');
                      break;
                    case 'validation':
                      localStorage.setItem('rules', 'skipped');
                      break;
                    case 'processing':
                      localStorage.setItem('ner', 'skipped');
                      break;
                    case 'collection':
                      localStorage.setItem('businessLogic', 'skipped');
                      break;
                    case 'connection':
                      localStorage.setItem('datatransformations', 'skipped');
                      break;
                    default:
                      break;
                  }
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DropZone({ index, onDrop }: { index: number; onDrop: (index: number, data: any) => void }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`h-8 flex items-center justify-center transition-all ${
        isOver ? 'bg-primary/10 border-2 border-dashed border-primary' : 'border-2 border-dashed border-transparent'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        onDrop(index, data);
      }}
    >
      {isOver && (
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
  const [jobType, setJobType] = useState(job?.category || 'glue');
  const [glueName, setGlueName] = useState(job?.id || '');
  const [jobName, setJobName] = useState(job?.name || '');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (job) {
      setStages(job.stages || []);
      setJobType(job.category || 'glue');
      setGlueName(job.id);
      setJobName(job.name);
      const cachedJobName = localStorage.getItem(`jobName_${job.id}`);
      localStorage.setItem('jobName', job.name);
    }
  }, [job]);

  const filteredAvailableSteps = availableSteps.filter(
    step => !stages.some(stage => stage.type === step.id)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDropAtPosition = (index: number, data: any) => {
    if (data.type === 'new-step') {
      const newStage: JobStage = {
        id: `stage_${Date.now()}`,
        name: data.step.name,
        type: data.step.id,
        status: 'Pending',
        description: data.step.description,
        config: {}
      };
      
      setStages(prev => {
        const newStages = [...prev];
        newStages.splice(index, 0, newStage);
        if (newStage.type === 'loading') localStorage.setItem('schema', 'executed');
        if (newStage.type === 'validation') localStorage.setItem('rules', 'executed');
        if (newStage.type === 'processing') localStorage.setItem('ner', 'executed');
        if (newStage.type === 'collection') localStorage.setItem('businessLogic', 'executed');
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
    const newStage: JobStage = {
      id: `stage_${Date.now()}`,
      name: step.name,
      type: step.id,
      status: 'Pending',
      description: step.description,
      config: {}
    };
    setStages(prev => [...prev, newStage]);
    if (newStage.type === 'loading') localStorage.setItem('schema', 'executed');
    if (newStage.type === 'validation') localStorage.setItem('rules', 'executed');
    if (newStage.type === 'processing') localStorage.setItem('ner', 'executed');
    if (newStage.type === 'collection') localStorage.setItem('businessLogic', 'executed');
    if (newStage.type === 'connection') localStorage.setItem('datatransformations', 'executed');
    
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
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  };

  const handleSaveStageConfig = (updatedStage: JobStage) => {
    setStages(prev => prev.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    setStageConfigDialogOpen(false);
    setSelectedStage(null);
  };

  const handleJobNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setJobName(newName);
    if (job) {
      localStorage.setItem(`jobName_${job.id}`, newName);
      localStorage.setItem('jobName', newName);
    }
  };

  const handleSave = async () => {
    if (!job) return;

    // Fetch values from localStorage
    const selectedBucket = localStorage.getItem("selectedBucket") || "";
    const selectedFile = localStorage.getItem("selectedFile") || "";
    const selectedDestBucket = localStorage.getItem("selectedDestBucket") || "";
    const selectedDestFolder = localStorage.getItem("selectedDestFolder") || "";

    // Construct S3 paths dynamically
    const datasource = selectedBucket && selectedFile ? `s3://${selectedBucket}/${selectedFile}` : "";
    const datadestination = selectedDestBucket && selectedDestFolder ? `s3://${selectedDestBucket}/${selectedDestFolder}` : "";

    // Validate required fields
    if (!datasource || !datadestination || !jobName) {
      toast({
        title: "Error",
        description: "Missing required job name, S3 bucket, or file information",
        variant: "destructive",
      });
      return;
    }

    // Construct the steps object based on localStorage
    const steps: JobStepConfig = {
      rules: (localStorage.getItem('rules') || 'skipped') as "executed" | "skipped" | "used",
      ner: (localStorage.getItem('ner') || 'skipped') as "executed" | "skipped" | "used",
      businessLogic: (localStorage.getItem('businessLogic') || 'skipped') as "executed" | "skipped" | "used",
      datatransformations: (localStorage.getItem('datatransformations') || 'skipped') as "executed" | "skipped" | "used",
    };

    // Construct the payload
    const payload: CreateJobConfigRequest = {
      jobName,
      triggerType: 'File',
      steps,
      datasource,
      datadestination,
      scheduleDetails: job?.config?.scheduleDetails || {},
      business_logic_rules: job?.config?.business_logic_rules || {
        rule1: 'validate_column_not_null',
        rule2: 'check_date_format',
      },
      job_type: jobType,
      glue_name: glueName,
      gname: jobName,
    };

    try {
      const result = await createJobConfig(payload);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Job configuration saved successfully',
        });

        // Clear localStorage to avoid stale data
        localStorage.removeItem("rules");
        localStorage.removeItem("ner");
        localStorage.removeItem("datatransformations");
        localStorage.removeItem("businessLogic");
        localStorage.removeItem("schema");
        localStorage.removeItem("selectedBucket");
        localStorage.removeItem("selectedFile");
        localStorage.removeItem("selectedDestBucket");
        localStorage.removeItem("selectedDestFolder");
        localStorage.removeItem(`jobName_${job.id}`);
        localStorage.setItem('jobName', jobName);

        // Update the job with new data
        const updatedJob: ExtendedJob = {
          ...job,
          category: jobType,
          id: glueName,
          name: jobName,
          stages,
          config: {
            ...job.config,
            ...payload,
          },
        };
        onSave(updatedJob.id, stages, jobName);
        onOpenChange(false);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save job configuration',
        variant: 'destructive',
      });
    }
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Job Stages: {jobName}</DialogTitle>
          <DialogDescription>
            Configure the stages for your job pipeline and set the job name.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium">Job Name</label>
            <Input
              value={jobName}
              onChange={handleJobNameChange}
              className="mt-1"
              placeholder="Enter job name"
            />
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-80 flex flex-col">
            <h3 className="font-semibold mb-4">Available Steps</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredAvailableSteps.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">All available steps have been added</p>
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
                    <p className="text-sm text-muted-foreground">Drag steps from the left panel to build your pipeline</p>
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
                      <DropZone index={0} onDrop={handleDropAtPosition} />
                      {stages.map((stage, index) => (
                        <div key={stage.id}>
                          <SortableStageItem
                            stage={stage}
                            index={index}
                            onEdit={handleEditStage}
                            onDelete={handleDeleteStage}
                          />
                          <DropZone index={index + 1} onDrop={handleDropAtPosition} />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        {selectedStage && (
          <StageConfigDialog
            stage={selectedStage}
            open={stageConfigDialogOpen}
            onOpenChange={setStageConfigDialogOpen}
            onSave={handleSaveStageConfig}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}