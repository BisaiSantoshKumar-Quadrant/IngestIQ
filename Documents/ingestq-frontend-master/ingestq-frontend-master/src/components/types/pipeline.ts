import { Node, Edge as ReactFlowEdge, EdgeMarkerType } from "reactflow";

// Custom Edge interface that extends ReactFlowEdge
export interface Edge extends Omit<ReactFlowEdge, 'type' | 'markerEnd' | 'style'> {
  id: string;
  source: string;
  target: string;
  type?: string; // Optional type for edge style (e.g., "smoothstep")
  markerEnd?: EdgeMarkerType; // Use React Flow's EdgeMarkerType
  style?: React.CSSProperties; // Use CSSProperties for style
}

export interface Pipeline {
  status: string;
  id: string;
  name: string;
  jobs: string[];
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}