// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, GripVertical } from 'lucide-react';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface DraggableJobListProps {
//   jobs: Job[];
//   onJobClick: (job: Job) => void;
// }

// export default function DraggableJobList({ jobs, onJobClick }: DraggableJobListProps) {
//   const onDragStart = (event: React.DragEvent, job: Job) => {
//     event.dataTransfer.setData('application/reactflow', JSON.stringify(job));
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <div className="flex-1 overflow-y-auto">
//       <h3 className="font-semibold mb-3">Available Jobs</h3>
//       <div className="space-y-2">
//         {jobs.map((job) => (
//           <Card 
//             key={job.id} 
//             className="cursor-grab hover:shadow-md transition-shadow group"
//             draggable
//             onDragStart={(event) => onDragStart(event, job)}
//             onClick={() => onJobClick(job)}
//           >
//             <CardContent className="p-3">
//               <div className="flex items-center gap-3">
//                 <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <GripVertical className="w-4 h-4 text-muted-foreground" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-medium text-sm">{job.name}</h4>
//                       <p className="text-xs text-muted-foreground">{job.category}</p>
//                       <div className="flex items-center gap-1 mt-1">
//                         <Badge variant="outline" className="text-xs">
//                           {job.stages?.length || 0} stages
//                         </Badge>
//                         {job.isConnected && (
//                           <Badge variant="secondary" className="text-xs">
//                             Connected
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Plus className="w-4 h-4 text-muted-foreground" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
//         <p className="text-xs text-muted-foreground">
//           💡 Drag jobs to canvas or click to add
//         </p>
//       </div>
//     </div>
//   );
// }


// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Plus, GripVertical } from 'lucide-react';

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   lastRun: string;
//   status: string;
//   description?: string;
//   isConnected?: boolean;
//   stages?: JobStage[];
// }

// interface DraggableJobListProps {
//   jobs: Job[];
//   onJobClick: (job: Job) => void;
// }

// export default function DraggableJobList({ jobs, onJobClick }: DraggableJobListProps) {
//   const onDragStart = (event: React.DragEvent, job: Job) => {
//     event.dataTransfer.setData('application/reactflow', JSON.stringify(job));
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <div className="flex-1 overflow-y-auto">
//       <h3 className="font-semibold mb-3">Available Jobs</h3>
//       <div className="space-y-2">
//         {jobs.map((job) => (
//           <Card 
//             key={job.id} 
//             className="cursor-grab hover:shadow-md transition-shadow group"
//             draggable
//             onDragStart={(event) => onDragStart(event, job)}
//             onClick={() => onJobClick(job)}
//           >
//             <CardContent className="p-3">
//               <div className="flex items-center gap-3">
//                 <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <GripVertical className="w-4 h-4 text-muted-foreground" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-medium text-sm">{job.name}</h4>
//                       <p className="text-xs text-muted-foreground">{job.category}</p>
//                       <div className="flex items-center gap-1 mt-1">
//                         <Badge variant="outline" className="text-xs">
//                           {job.stages?.length || 0} stages
//                         </Badge>
//                         {job.isConnected && (
//                           <Badge variant="secondary" className="text-xs">
//                             Connected
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Plus className="w-4 h-4 text-muted-foreground" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
      
//       <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
//         <p className="text-xs text-muted-foreground">
//           💡 Drag jobs to canvas or click to add
//         </p>
//       </div>
//     </div>
//   );
// }


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical } from 'lucide-react';

interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
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

interface DraggableJobListProps {
  jobs: Job[];
  onJobClick: (job: Job) => void;
}

export default function DraggableJobList({ jobs, onJobClick }: DraggableJobListProps) {
  const onDragStart = (event: React.DragEvent, job: Job) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(job));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100% - 2rem)' }}> {/* Adjust max-height relative to parent */}
      <h3 className="font-semibold mb-3">Available Jobs</h3>
      <div className="space-y-2">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="cursor-grab hover:shadow-md transition-shadow group"
            draggable
            onDragStart={(event) => onDragStart(event, job)}
            onClick={() => onJobClick(job)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{job.name}</h4>
                      <p className="text-xs text-muted-foreground">{job.category}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {job.stages?.length || 0} stages
                        </Badge>
                        {job.isConnected && (
                          <Badge variant="secondary" className="text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
        <p className="text-xs text-muted-foreground">
          💡 Drag jobs to canvas or click to add
        </p>
      </div>
    </div>
  );
}