import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, X, Play, Database, FileText, CheckCircle, Edit } from 'lucide-react';
import StageCanvasDialog from './StageCanvasDialog';

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface JobNodeData {
  job: {
    id: string;
    name: string;
    category: string;
    stages?: JobStage[];
    parameters?: Record<string, any>;
    inputTypes?: string[];
    outputTypes?: string[];
  };
  onEdit: (nodeId: string) => void;
  onEditStages: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

function JobNode({ id, data, selected }: NodeProps<JobNodeData>) {
  const { job, onEdit, onEditStages, onDelete } = data;
  const [stageCanvasOpen, setStageCanvasOpen] = useState(false);

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'extraction': return Database;
      case 'transformation': return Settings;
      case 'loading': return FileText;
      case 'validation': return CheckCircle;
      case 'processing': return Play;
      default: return Settings;
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

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStageCanvasOpen(true);
  };

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
      
      <Card 
        className={`w-72 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
          selected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border-2 border-blue-200'
        }`}
        onClick={handleNodeClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{job.name}</h4>
              <p className="text-xs text-muted-foreground">{job.category}</p>
              <div className="flex gap-1 mt-1">
                {job.parameters && Object.keys(job.parameters).length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Configured
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {job.stages?.length || 0} stages
                </Badge>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(id);
                }}
                title="Configure Job"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-green-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setStageCanvasOpen(true);
                }}
                title="Edit Stages"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                title="Remove Job"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Job Stages */}
          {job.stages && job.stages.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">STAGES</p>
              <div className="grid grid-cols-1 gap-1">
                {job.stages.slice(0, 3).map((stage) => {
                  const StageIcon = getStageIcon(stage.type);
                  return (
                    <div
                      key={stage.id}
                      className="flex items-center gap-2 p-2 bg-muted/30 rounded text-xs"
                    >
                      <div className="w-4 h-4 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        <StageIcon className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="flex-1 truncate">{stage.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-1 py-0 ${getStatusColor(stage.status)}`}
                      >
                        {stage.status}
                      </Badge>
                    </div>
                  );
                })}
                {job.stages.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-1">
                    +{job.stages.length - 3} more stages
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input/Output Types */}
          <div className="mt-3 pt-2 border-t border-muted/30">
            <div className="flex justify-between text-xs">
              <div>
                <span className="text-muted-foreground">In:</span>
                <span className="ml-1 font-medium">
                  {job.inputTypes?.join(', ') || 'data'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Out:</span>
                <span className="ml-1 font-medium">
                  {job.outputTypes?.join(', ') || 'data'}
                </span>
              </div>
            </div>
          </div>

          {/* Click hint */}
          <div className="mt-2 text-xs text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity">
            Click to edit stages
          </div>
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />

      <StageCanvasDialog
        job={{
          id: job.id,
          name: job.name,
          category: job.category,
          lastRun: '',
          status: '',
          stages: job.stages
        }}
        stages={job.stages || []}
        open={stageCanvasOpen}
        onOpenChange={setStageCanvasOpen}
        onSave={(updatedStages) => {
          // Update the job stages through the parent component
          onEditStages(id);
          setStageCanvasOpen(false);
        }}
      />
    </div>
  );
}

export default memo(JobNode);
