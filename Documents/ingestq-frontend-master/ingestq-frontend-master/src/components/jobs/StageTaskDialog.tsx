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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock } from 'lucide-react';
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

interface StageTaskDialogProps {
  stage: JobStage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stage: JobStage) => void;
}

const stageTypeInfo = {
  extraction: { icon: Database, color: '#3b82f6', label: 'Data Extraction' },
  transformation: { icon: Settings, color: '#8b5cf6', label: 'Data Transformation' },
  loading: { icon: FileText, color: '#10b981', label: 'Data Loading' },
  validation: { icon: CheckCircle, color: '#f59e0b', label: 'Data Validation' },
  processing: { icon: Play, color: '#ef4444', label: 'Data Processing' },
  connection: { icon: Database, color: '#06b6d4', label: 'Connection Setup' },
  transfer: { icon: FileText, color: '#84cc16', label: 'Data Transfer' },
  collection: { icon: Database, color: '#f97316', label: 'Data Collection' },
};

export default function StageTaskDialog({ 
  stage, 
  open, 
  onOpenChange, 
  onSave 
}: StageTaskDialogProps) {
  const [stageName, setStageName] = useState("");
  const [stageDescription, setStageDescription] = useState("");
  const [stageStatus, setStageStatus] = useState("");

  useEffect(() => {
    if (stage) {
      setStageName(stage.name);
      setStageDescription(stage.description || "");
      setStageStatus(stage.status);
    }
  }, [stage]);

  const handleSave = () => {
    const updatedStage: JobStage = {
      ...stage,
      name: stageName,
      description: stageDescription,
      status: stageStatus,
    };
    onSave(updatedStage);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <Play className="w-5 h-5 text-blue-500" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
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

  const typeInfo = stageTypeInfo[stage.type as keyof typeof stageTypeInfo] || stageTypeInfo.processing;
  const TypeIcon = typeInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${typeInfo.color}20` }}
            >
              <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>
            Configure Stage Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stage Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Stage Type</Label>
                  <p className="font-medium">{typeInfo.label}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Current Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stage.status)}
                    <Badge className={`${getStatusColor(stage.status)}`}>
                      {stage.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stage Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stageName">Stage Name</Label>
                <Input
                  id="stageName"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value)}
                  placeholder="Enter stage name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageDescription">Description</Label>
                <Textarea
                  id="stageDescription"
                  value={stageDescription}
                  onChange={(e) => setStageDescription(e.target.value)}
                  placeholder="Enter stage description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageStatus">Status</Label>
                <Select value={stageStatus} onValueChange={setStageStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="running">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-blue-500" />
                        Running
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Completed
                      </div>
                    </SelectItem>
                    <SelectItem value="failed">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Failed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Task Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Task-specific settings for {typeInfo.label}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retry on failure</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Max retries</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Timeout</span>
                    <Badge variant="outline">30 minutes</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Task Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
