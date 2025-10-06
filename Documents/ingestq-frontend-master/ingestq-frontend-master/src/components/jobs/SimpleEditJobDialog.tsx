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
import { Plus, X, GripVertical, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StageTaskDialog from "./StageTaskDialog";

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

interface SimpleEditJobDialogProps {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (jobId: string, stages: JobStage[]) => void;
}

const availableSteps = [
  { id: 'extraction', name: 'Data Extraction', icon: Database, color: '#3b82f6', description: 'Extract data from source systems' },
  { id: 'transformation', name: 'Data Transformation', icon: Settings, color: '#8b5cf6', description: 'Transform and clean data' },
  { id: 'loading', name: 'Data Loading', icon: FileText, color: '#10b981', description: 'Load data into target system' },
  { id: 'validation', name: 'Data Validation', icon: CheckCircle, color: '#f59e0b', description: 'Validate data quality and integrity' },
  { id: 'processing', name: 'Data Processing', icon: Play, color: '#ef4444', description: 'Process and analyze data' },
  { id: 'connection', name: 'Connection Setup', icon: Database, color: '#06b6d4', description: 'Establish system connections' },
  { id: 'transfer', name: 'Data Transfer', icon: FileText, color: '#84cc16', description: 'Transfer data between systems' },
  { id: 'collection', name: 'Data Collection', icon: Database, color: '#f97316', description: 'Collect data from various sources' },
];

function SortableStageItem({ stage, onEdit, onDelete, onStatusChange }: {
  stage: JobStage;
  onEdit: (stage: JobStage) => void;
  onDelete: (stageId: string) => void;
  onStatusChange: (stageId: string, status: string) => void;
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
    <Card
      ref={setNodeRef}
      className="cursor-pointer hover:shadow-md transition-all border-l-4"
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
            <Select 
              value={stage.status} 
              onValueChange={(value) => onStatusChange(stage.id, value)}
            >
              <SelectTrigger className="w-24 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
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
        </div>
      </CardContent>
    </Card>
  );
}

export default function SimpleEditJobDialog({ 
  job, 
  open, 
  onOpenChange, 
  onSave 
}: SimpleEditJobDialogProps) {
  const { toast } = useToast();
  const [stages, setStages] = useState<JobStage[]>([]);
  const [selectedStage, setSelectedStage] = useState<JobStage | null>(null);
  const [stageTaskDialogOpen, setStageTaskDialogOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (job) {
      setStages(job.stages || []);
    }
  }, [job]);

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

  const addStepToStages = (step: typeof availableSteps[0]) => {
    const newStage: JobStage = {
      id: `stage_${Date.now()}`,
      name: step.name,
      type: step.id,
      status: 'pending',
      description: step.description
    };
    setStages(prev => [...prev, newStage]);
    
    toast({
      title: "Stage Added",
      description: `${step.name} has been added to the job`,
    });
  };

  const handleEditStage = (stage: JobStage) => {
    setSelectedStage(stage);
    setStageTaskDialogOpen(true);
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(prev => prev.filter(stage => stage.id !== stageId));
  };

  const handleStatusChange = (stageId: string, newStatus: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, status: newStatus } : stage
    ));
  };

  const handleSaveStageTask = (updatedStage: JobStage) => {
    setStages(prev => prev.map(stage => 
      stage.id === updatedStage.id ? updatedStage : stage
    ));
    setStageTaskDialogOpen(false);
    setSelectedStage(null);
  };

  const handleSave = () => {
    if (!job) return;
    onSave(job.id, stages);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Job Stages: {job.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Left Panel - Available Steps */}
          <div className="w-80 flex flex-col">
            <h3 className="font-semibold mb-4">Available Steps</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {availableSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <Card 
                    key={step.id} 
                    className="cursor-pointer hover:shadow-md transition-all border-l-4"
                    style={{ borderLeftColor: step.color }}
                    onClick={() => addStepToStages(step)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
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
              })}
            </div>
          </div>

          {/* Right Panel - Job Stage Pipeline */}
          <div className="flex-1 border-l pl-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
              <div className="text-sm text-muted-foreground">
                Drag to reorder • Click to configure
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {stages.length === 0 ? (
                <div className="flex items-center justify-center h-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center">
                    <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-2">No stages added</p>
                    <p className="text-sm text-muted-foreground">Click on available steps to add them to your job</p>
                  </div>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {stages.map((stage, index) => (
                        <div key={stage.id} className="relative">
                          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <SortableStageItem
                            stage={stage}
                            onEdit={handleEditStage}
                            onDelete={handleDeleteStage}
                            onStatusChange={handleStatusChange}
                          />
                          {index < stages.length - 1 && (
                            <div className="flex justify-center my-2">
                              <div className="w-px h-4 bg-muted-foreground/30"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        {/* Stage Task Dialog */}
        {selectedStage && (
          <StageTaskDialog
            stage={selectedStage}
            open={stageTaskDialogOpen}
            onOpenChange={setStageTaskDialogOpen}
            onSave={handleSaveStageTask}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
