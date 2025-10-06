
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Cpu, HardDrive, Activity, RotateCcw } from "lucide-react";

// interface SystemMonitorProps {
//   jobId: string;
// }

// const mockSystemData = {
//   '1': {
//     cpu: { usage: 78, cores: 4 },
//     memory: { used: 6.2, total: 16, percentage: 39 },
//     executions: { today: 12, thisWeek: 45, thisMonth: 180, total: 2340 },
//     performance: { avgDuration: '00:12:30', successRate: 94.2 }
//   },
//   '2': {
//     cpu: { usage: 45, cores: 2 },
//     memory: { used: 3.8, total: 8, percentage: 48 },
//     executions: { today: 8, thisWeek: 35, thisMonth: 140, total: 1890 },
//     performance: { avgDuration: '00:08:15', successRate: 98.7 }
//   },
//   '3': {
//     cpu: { usage: 23, cores: 2 },
//     memory: { used: 2.1, total: 8, percentage: 26 },
//     executions: { today: 3, thisWeek: 18, thisMonth: 72, total: 945 },
//     performance: { avgDuration: '00:15:45', successRate: 76.3 }
//   },
//   '4': {
//     cpu: { usage: 0, cores: 4 },
//     memory: { used: 0, total: 16, percentage: 0 },
//     executions: { today: 0, thisWeek: 12, thisMonth: 48, total: 567 },
//     performance: { avgDuration: '00:20:00', successRate: 89.1 }
//   }
// };

// export default function SystemMonitor({ jobId }: SystemMonitorProps) {
//   const data = mockSystemData[jobId as keyof typeof mockSystemData];
  
//   if (!data) {
//     return (
//       <Card>
//         <CardContent className="p-6">
//           <p className="text-muted-foreground text-center">Select a job to view system metrics</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       {/* CPU Usage */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Cpu className="w-5 h-5 text-blue-500" />
//             <span>CPU Usage</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium">Current Usage:</span>
//               <span className="text-sm font-medium">{data.cpu.usage}%</span>
//             </div>
//             <Progress value={data.cpu.usage} className="h-3" />
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Cores:</span>
//             <span className="text-sm">{data.cpu.cores}</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Memory Usage */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <HardDrive className="w-5 h-5 text-green-500" />
//             <span>Memory Usage</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium">Usage:</span>
//               <span className="text-sm font-medium">{data.memory.percentage}%</span>
//             </div>
//             <Progress value={data.memory.percentage} className="h-3" />
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Memory:</span>
//             <span className="text-sm">{data.memory.used}GB / {data.memory.total}GB</span>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Execution Statistics */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <RotateCcw className="w-5 h-5 text-purple-500" />
//             <span>Execution Count</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="grid grid-cols-2 gap-4 text-sm">
//             <div>
//               <span className="text-muted-foreground">Today:</span>
//               <span className="ml-2 font-semibold">{data.executions.today}</span>
//             </div>
//             <div>
//               <span className="text-muted-foreground">This Week:</span>
//               <span className="ml-2 font-semibold">{data.executions.thisWeek}</span>
//             </div>
//             <div>
//               <span className="text-muted-foreground">This Month:</span>
//               <span className="ml-2 font-semibold">{data.executions.thisMonth}</span>
//             </div>
//             <div>
//               <span className="text-muted-foreground">Total:</span>
//               <span className="ml-2 font-semibold">{data.executions.total.toLocaleString()}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Performance Metrics */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Activity className="w-5 h-5 text-orange-500" />
//             <span>Performance</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Avg Duration:</span>
//             <span className="text-sm">{data.performance.avgDuration}</span>
//           </div>
//           <div className="flex items-center justify-between">
//             <span className="text-sm font-medium">Success Rate:</span>
//             <span className="text-sm font-semibold text-green-600">{data.performance.successRate}%</span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Updated systemmonitor.tsx



import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, Activity, RotateCcw } from "lucide-react";
import { getSystemMonitor } from "@/lib/api";  // Import only the function, not the type
import type { SystemMonitor } from "@/lib/api";  // Type-only import for the interface

interface SystemMonitorProps {
  jobId: string;
}

export default function SystemMonitor({ jobId }: SystemMonitorProps) {
  const [data, setData] = useState<SystemMonitor | null>(null);

  useEffect(() => {
    if (jobId) {
      getSystemMonitor(jobId)
        .then((res) => {
          if (res.success) {
            setData(res.monitor);
          }
        })
        .catch(console.error);
    }
  }, [jobId]);

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading system metrics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* CPU Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            <span>CPU Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Usage:</span>
              <span className="text-sm font-medium">{data.cpu.usage}%</span>
            </div>
            <Progress value={data.cpu.usage} className="h-3" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cores:</span>
            <span className="text-sm">{data.cpu.cores}</span>
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-green-500" />
            <span>Memory Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Usage:</span>
              <span className="text-sm font-medium">{data.memory.usage}%</span>
            </div>
            <Progress value={data.memory.usage} className="h-3" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Memory:</span>
            <span className="text-sm">{data.memory.memory}</span>
          </div>
        </CardContent>
      </Card>

      {/* Execution Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RotateCcw className="w-5 h-5 text-purple-500" />
            <span>Execution Count</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Today:</span>
              <span className="ml-2 font-semibold">{data.executionCount.today}</span>
            </div>
            <div>
              <span className="text-muted-foreground">This Week:</span>
              <span className="ml-2 font-semibold">{data.executionCount.week}</span>
            </div>
            <div>
              <span className="text-muted-foreground">This Month:</span>
              <span className="ml-2 font-semibold">{data.executionCount.month}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total:</span>
              <span className="ml-2 font-semibold">{data.executionCount.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-orange-500" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Avg Duration:</span>
            <span className="text-sm">{data.performance.avgDuration}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate:</span>
            <span className="text-sm font-semibold text-green-600">{data.performance.successRate}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}