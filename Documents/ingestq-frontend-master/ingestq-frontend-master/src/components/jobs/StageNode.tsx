import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, X, CheckCircle, AlertCircle, Clock, Play } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
}

interface StageNodeData {
  stage: JobStage;
  stageType?: {
    value: string;
    label: string;
    icon: any;
    color: string;
  };
  onEdit: (stageId: string) => void;
  onDelete: (stageId: string) => void;
  onStatusChange: (stageId: string, newStatus: string) => void;
}

function StageNode({ id, data, selected }: NodeProps<StageNodeData>) {
  const { stage, stageType, onEdit, onDelete, onStatusChange } = data;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running': return <Play className="w-4 h-4 text-blue-500" />;
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

  const StageIcon = stageType?.icon || Settings;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
      
      <Card 
        className={`w-64 shadow-lg hover:shadow-xl transition-all ${
          selected ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border-2'
        }`}
        style={{ borderColor: selected ? '#3b82f6' : stageType?.color || '#e5e7eb' }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${stageType?.color}20` }}
              >
                <StageIcon className="w-5 h-5" style={{ color: stageType?.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm truncate">{stage.name}</h4>
                <p className="text-xs text-muted-foreground capitalize">
                  {stage.type.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(stage.id);
                }}
                title="Edit Stage"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(stage.id);
                }}
                title="Delete Stage"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getStatusIcon(stage.status)}
              <span className="text-xs font-medium">Status</span>
            </div>
            
            <Select 
              value={stage.status} 
              onValueChange={(value) => onStatusChange(stage.id, value)}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-gray-500" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="running">
                  <div className="flex items-center gap-2">
                    <Play className="w-3 h-3 text-blue-500" />
                    Running
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Completed
                  </div>
                </SelectItem>
                <SelectItem value="failed">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    Failed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          {stage.description && (
            <div className="mt-3 pt-2 border-t border-muted/30">
              <p className="text-xs text-muted-foreground truncate" title={stage.description}>
                {stage.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-blue-500 border-2 border-white"
      />
    </div>
  );
}

export default memo(StageNode);
