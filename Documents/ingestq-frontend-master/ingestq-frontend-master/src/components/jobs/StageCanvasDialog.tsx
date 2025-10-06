import {useEffect, useState, useCallback, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Plus, X, Play, Database, FileText, Settings, CheckCircle, AlertCircle, Clock, Grid3X3, Move, GripVertical } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
  NodeTypes,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StageNode from "./StageNode";

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

interface StageCanvasDialogProps {
  job: Job;
  stages: JobStage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stages: JobStage[]) => void;
}

const stageTypes = [
  { value: 'extraction', label: 'Data Extraction', icon: Database, color: '#3b82f6' },
  { value: 'transformation', label: 'Data Transformation', icon: Settings, color: '#8b5cf6' },
  { value: 'loading', label: 'Data Loading', icon: FileText, color: '#10b981' },
  { value: 'validation', label: 'Data Validation', icon: CheckCircle, color: '#f59e0b' },
  { value: 'processing', label: 'Data Processing', icon: Play, color: '#ef4444' },
  { value: 'connection', label: 'Connection', icon: Database, color: '#06b6d4' },
  { value: 'transfer', label: 'Data Transfer', icon: FileText, color: '#84cc16' },
  { value: 'collection', label: 'Data Collection', icon: Database, color: '#f97316' },
];

const nodeTypes: NodeTypes = {
  stageNode: StageNode,
};

const GRID_SIZE = 20;

export default function StageCanvasDialog({ 
  job, 
  stages: initialStages, 
  open, 
  onOpenChange, 
  onSave 
}: StageCanvasDialogProps) {
  const { toast } = useToast();
  const [stages, setStages] = useState<JobStage[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [newStageName, setNewStageName] = useState("");
  const [newStageType, setNewStageType] = useState("");
  const [newStageDescription, setNewStageDescription] = useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Initialize stages and nodes when dialog opens
  useEffect(() => {
    if (open && initialStages) {
      setStages([...initialStages]);
      
      // Convert stages to nodes
      const stageNodes = initialStages.map((stage, index) => {
        const stageType = stageTypes.find(st => st.value === stage.type);
        return {
          id: stage.id,
          type: 'stageNode',
          position: { x: index * 250 + 100, y: 200 },
          data: {
            stage,
            stageType,
            onEdit: (stageId: string) => handleEditStage(stageId),
            onDelete: (stageId: string) => handleDeleteStage(stageId),
            onStatusChange: (stageId: string, newStatus: string) => handleStatusChange(stageId, newStatus),
          },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        };
      });

      // Create edges between consecutive stages
      const stageEdges = stageNodes.slice(0, -1).map((node, index) => ({
        id: `edge-${node.id}-${stageNodes[index + 1].id}`,
        source: node.id,
        target: stageNodes[index + 1].id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
          stroke: '#6366f1',
        },
      }));

      setNodes(stageNodes);
      setEdges(stageEdges);
    }
  }, [open, initialStages]);

  const snapToGridHelper = useCallback((position: { x: number; y: number }) => {
    if (!snapToGrid) return position;
    return {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
    };
  }, [snapToGrid]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
          stroke: '#6366f1',
        },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const handleEditStage = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage) {
      setNewStageName(stage.name);
      setNewStageType(stage.type);
      setNewStageDescription(stage.description || "");
      // Remove the stage temporarily for editing
      handleDeleteStage(stageId);
    }
  };

  const handleDeleteStage = (stageId: string) => {
    setStages(prev => prev.filter(s => s.id !== stageId));
    setNodes(prev => prev.filter(n => n.id !== stageId));
    setEdges(prev => prev.filter(e => e.source !== stageId && e.target !== stageId));
  };

  const handleStatusChange = (stageId: string, newStatus: string) => {
    setStages(prev => prev.map(stage => 
      stage.id === stageId ? { ...stage, status: newStatus } : stage
    ));
    
    setNodes(prev => prev.map(node => 
      node.id === stageId 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              stage: { ...node.data.stage, status: newStatus } 
            } 
          }
        : node
    ));
  };

  const addStageToCanvas = () => {
    if (!newStageName || !newStageType) {
      toast({
        title: "Missing Information",
        description: "Please enter stage name and select a type",
        variant: "destructive"
      });
      return;
    }

    const newStage: JobStage = {
      id: `stage_${Date.now()}`,
      name: newStageName,
      type: newStageType,
      status: 'pending',
      description: newStageDescription
    };

    const stageType = stageTypes.find(st => st.value === newStageType);
    
    // Find next available position
    const existingPositions = nodes.map(n => n.position);
    let newPosition = { x: 100, y: 200 };
    
    if (existingPositions.length > 0) {
      const maxX = Math.max(...existingPositions.map(p => p.x));
      newPosition = { x: maxX + 250, y: 200 };
    }

    const snappedPosition = snapToGridHelper(newPosition);
    const newNode = {
      id: newStage.id,
      type: 'stageNode',
      position: snappedPosition,
      data: {
        stage: newStage,
        stageType,
        onEdit: (stageId: string) => handleEditStage(stageId),
        onDelete: (stageId: string) => handleDeleteStage(stageId),
        onStatusChange: (stageId: string, newStatus: string) => handleStatusChange(stageId, newStatus),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setStages(prev => [...prev, newStage]);
    setNodes(prev => [...prev, newNode]);

    // Auto-connect to the last stage if exists
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      const newEdge = {
        id: `edge-${lastNode.id}-${newStage.id}`,
        source: lastNode.id,
        target: newStage.id,
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        style: {
          strokeWidth: 2,
          stroke: '#6366f1',
        },
      };
      setEdges(prev => [...prev, newEdge]);
    }

    // Clear form
    setNewStageName("");
    setNewStageType("");
    setNewStageDescription("");

    toast({
      title: "Stage Added",
      description: `${newStage.name} has been added to the workflow`,
    });
  };

  const handleSave = () => {
    // Sort stages based on their position in the canvas (left to right)
    const sortedNodes = [...nodes].sort((a, b) => a.position.x - b.position.x);
    const sortedStages = sortedNodes.map(node => 
      stages.find(stage => stage.id === node.id)
    ).filter(Boolean) as JobStage[];

    onSave(sortedStages);
    toast({
      title: "Stages Saved",
      description: `${sortedStages.length} stages have been saved for ${job.name}`,
    });
  };

  const clearCanvas = () => {
    setStages([]);
    setNodes([]);
    setEdges([]);
  };

  const autoArrange = () => {
    const arrangedNodes = nodes.map((node, index) => ({
      ...node,
      position: snapToGridHelper({ x: index * 250 + 100, y: 200 })
    }));

    setNodes(arrangedNodes);

    // Recreate edges in sequence
    const newEdges = arrangedNodes.slice(0, -1).map((node, index) => ({
      id: `edge-${node.id}-${arrangedNodes[index + 1].id}`,
      source: node.id,
      target: arrangedNodes[index + 1].id,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: 2,
        stroke: '#6366f1',
      },
    }));

    setEdges(newEdges);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Stage Canvas - {job.name}</DialogTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                <Label htmlFor="snap-to-grid-stages" className="text-sm">Snap to Grid</Label>
                <Switch
                  id="snap-to-grid-stages"
                  checked={snapToGrid}
                  onCheckedChange={setSnapToGrid}
                />
              </div>
              <Button variant="outline" size="sm" onClick={autoArrange}>
                Auto Arrange
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                Clear All
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left Panel - Add Stage */}
          <div className="w-80 flex flex-col">
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Add New Stage</h3>
                <div className="space-y-4">
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
                              <type.icon className="w-4 h-4" style={{ color: type.color }} />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stageDescription">Description (Optional)</Label>
                    <Textarea
                      id="stageDescription"
                      placeholder="Enter stage description"
                      value={newStageDescription}
                      onChange={(e) => setNewStageDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button onClick={addStageToCanvas} className="w-full" disabled={!newStageName || !newStageType}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Canvas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stage List */}
            <Card className="flex-1 overflow-hidden">
              <CardContent className="p-4 h-full flex flex-col">
                <h3 className="font-semibold mb-3">Current Stages ({stages.length})</h3>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {stages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No stages added</p>
                      <p className="text-xs">Add stages to build your workflow</p>
                    </div>
                  ) : (
                    stages.map((stage, index) => {
                      const stageType = stageTypes.find(st => st.value === stage.type);
                      const StageIcon = stageType?.icon || Settings;
                      return (
                        <div
                          key={stage.id}
                          className="flex items-center gap-2 p-2 bg-muted/30 rounded text-sm"
                        >
                          <GripVertical className="w-3 h-3 text-muted-foreground" />
                          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" 
                               style={{ backgroundColor: `${stageType?.color}20` }}>
                            <StageIcon className="w-3 h-3" style={{ color: stageType?.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{stage.name}</p>
                            <p className="text-xs text-muted-foreground">Step {index + 1}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stage.status}
                          </Badge>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Stage Canvas */}
          <div className="flex-1 border-l pl-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Stage Workflow Canvas</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Move className="w-4 h-4" />
                <span>Drag stages to rearrange workflow order</span>
              </div>
            </div>
            
            <div className="flex-1 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden">
              {stages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-2">No stages in workflow</p>
                    <p className="text-sm text-muted-foreground">Add stages from the left panel to build your workflow</p>
                  </div>
                </div>
              ) : (
                <ReactFlowProvider>
                  <div className="w-full h-full" ref={reactFlowWrapper}>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      onInit={setReactFlowInstance}
                      nodeTypes={nodeTypes}
                      snapToGrid={snapToGrid}
                      snapGrid={[GRID_SIZE, GRID_SIZE]}
                      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                      minZoom={0.5}
                      maxZoom={1.5}
                      attributionPosition="bottom-left"
                      nodesDraggable={true}
                      nodesConnectable={true}
                      elementsSelectable={true}
                    >
                      <Controls 
                        showZoom={true}
                        showFitView={true}
                        showInteractive={true}
                      />
                      <Background 
                        variant={"dots" as any}
                        gap={GRID_SIZE} 
                        size={1}
                        color="#e5e7eb"
                      />
                    </ReactFlow>
                  </div>
                </ReactFlowProvider>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {stages.length} stages • Drag to rearrange workflow order
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
