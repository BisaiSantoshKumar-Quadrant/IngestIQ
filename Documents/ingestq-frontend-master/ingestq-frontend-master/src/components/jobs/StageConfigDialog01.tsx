import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, Database, Settings, CheckCircle, AlertCircle, Clock, Target, Filter, ArrowLeft } from 'lucide-react';

// Import compact step components
import CompactDataUploadStep from "./steps/CompactDataUploadStep";
import CompactScheduleStep from "./steps/CompactScheduleStep";
import CompactBusinessLogicStep from "./steps/CompactBusinessLogicStep";
import CompactDataTransformationStep from "./steps/CompactDataTransformationStep";

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


interface StageConfigDialogProps {
  stage: JobStage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stage: JobStage) => void;
  jobDatasource?: string;
  jobDatadestination?: string;
  triggerType?: "SCHEDULE" | "File";
  scheduleDetails?: {
    frequency?: string;
    time?: string;
  };
}

const stageTypeInfo = {
  upload_center: { 
    icon: Database, 
    color: '#3b82f6', 
    label: 'Data Upload Center',
    description: 'Configure data source and destination settings',
    component: CompactDataUploadStep 
  },
  loading: { 
    icon: Target, 
    color: '#10b981', 
    label: 'Schema Analysis',
    description: 'Analyze schema of the data',
    component: null
  },
  validation: { 
    icon: Filter, 
    color: '#f59e0b', 
    label: 'DQ Rules',
    description: 'Validate data quality and consistency',
    component: null
  },
  processing: { 
    icon: Settings, 
    color: '#ef4444', 
    label: 'NER',
    description: 'Named Entity Recognition processing',
    component: null
  },
  collection: { 
    icon: Database, 
    color: '#6b7280', 
    label: 'Business Logic',
    description: 'Apply business logic to collected data',
    component: CompactBusinessLogicStep 
  },
  connection: { 
    icon: Database, 
    color: '#3b82f6', 
    label: 'Data Transformations',
    description: 'Extract, Transform, Load processes',
    component: CompactDataTransformationStep
  },
  transfer: { 
    icon: Target, 
    color: '#10b981', 
    label: 'Schedule Jobs',
    description: 'Schedule automated job runs',
    component: CompactScheduleStep 
  },
};

export default function StageConfigDialog01({ 
  stage, 
  open, 
  onOpenChange, 
  onSave,
  jobDatasource,
  jobDatadestination 
}: StageConfigDialogProps) {
  const { toast } = useToast();
  const [stageConfig, setStageConfig] = useState<Record<string, any>>({});

  // Reset config when stage changes or dialog opens
  useEffect(() => {
    if (stage && open) {
      const initialConfig = stage.config || {};
      setStageConfig(initialConfig);
      // TEMP DEBUG: Log when dialog opens
      console.log('🔍 Stage config in dialog:', initialConfig);
    }
  }, [stage, open]);

  const handleConfigChange = (config: Record<string, any>) => {
    console.log('Config changed:', config); // Debug log
    setStageConfig(config);
  };

  const handleSave = () => {
    console.log('Saving config:', stageConfig); // Debug log
    
    const updatedStage: JobStage = {
      ...stage,
    config: stageConfig,
    datasource: stageConfig.sourcePath,
    datadestination: stageConfig.destinationPath,
    };
    
    // Call the parent's onSave with the updated stage
    onSave(updatedStage);

    // Also save to localStorage for persistence (optional)
    const stageKey = stage.type.replace('_', '');
    localStorage.setItem(`${stageKey}_config`, JSON.stringify(stageConfig));

    toast({
      title: "Configuration Saved",
      description: `Configuration for ${stageTypeInfo[stage.type as keyof typeof stageTypeInfo]?.label || stage.type} has been saved successfully.`,
    });
    
    // Close the dialog after saving
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset to original config on cancel
    setStageConfig(stage.config || {});
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <Play className="w-5 h-5 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderStageSpecificConfig = () => {
    const typeInfo = stageTypeInfo[stage.type as keyof typeof stageTypeInfo];
    
    if (!typeInfo) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Unknown Stage Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                Configuration for stage type "{stage.type}" is not available.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!typeInfo.component) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{typeInfo.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">
                This stage will be executed when you save the job configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    const StageConfigComponent = typeInfo.component;

    if (stage.type === 'upload_center') {
      return (
        <StageConfigComponent 
          config={stageConfig}
          onConfigChange={handleConfigChange}
          jobDatasource={jobDatasource}
          jobDatadestination={jobDatadestination}
        />
      );
    }
    if (stage.type === 'connection') {
  return (
    <StageConfigComponent 
      config={stageConfig}
      onConfigChange={handleConfigChange}
      jobDatasource={jobDatasource}
      jobDatadestination={jobDatadestination}
      showJobNameInput={false} // Hide job name input in edit mode
    />
  );
}

// In StageConfigDialog01.tsx, inside renderStageSpecificConfig() for 'transfer'
if (stage.type === 'transfer') {
  return (
    <StageConfigComponent 
      config={stageConfig}
      onConfigChange={handleConfigChange}
      triggerType={stageConfig.triggerType}
      scheduleDetails={stageConfig}
    />
  );
}

    return (
      <StageConfigComponent 
        config={stageConfig}
        onConfigChange={handleConfigChange}
      />
    );
  };

  const typeInfo = stageTypeInfo[stage.type as keyof typeof stageTypeInfo] || {
    icon: Settings,
    color: '#6b7280',
    label: 'Unknown Stage',
    description: 'Unknown stage type'
  };
  const TypeIcon = typeInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${typeInfo.color}20` }}
            >
              <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>
            Configure Stage: {stage.name}
          </DialogTitle>
          <DialogDescription>
            Adjust the settings for the {typeInfo.label} stage in your job pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 px-1">
          {/* Stage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stage Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Stage Type</div>
                  <p className="font-medium">{typeInfo.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{typeInfo.description}</p>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Status</div>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(stage.status)}
                    <Badge className={`${
                      stage.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      stage.status === 'running' ? 'bg-blue-100 text-blue-800' : 
                      stage.status === 'failed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {stage.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage-Specific Configuration */}
          {renderStageSpecificConfig()}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pipeline
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
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