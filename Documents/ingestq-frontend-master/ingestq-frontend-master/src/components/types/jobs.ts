// import { Pipeline } from "./pipeline"
// // import type { Stage } from "./stage"

// export interface Job {
//   id: string
//   name: string
//   category: string
//   lastRun: string
//   status: "Completed" | "Running" | "Failed" | "Pending"
//   description?: string  // Add this optional property
//   isConnected?: boolean
//   pipelineId?: string
//   pipelineName?: string
//   pipelines?: Pipeline[]
//   stages?: any[]  // Also uncommented this since you're using it in the mock data
//   // stages?: Stage[]
// }

import { Pipeline } from "./pipeline";

export interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  config?: Record<string, any>;
}

export interface Job {
  id: string;
  name: string;
  category: string;
  lastRun: string;
  status: "Completed" | "Running" | "Failed" | "Pending";
  description?: string;
  isConnected?: boolean;
  pipelineId?: string;
  pipelineName?: string;
  pipelines?: Pipeline[];
  stages?: JobStage[]; // Use JobStage instead of any[] or Stage[]
}