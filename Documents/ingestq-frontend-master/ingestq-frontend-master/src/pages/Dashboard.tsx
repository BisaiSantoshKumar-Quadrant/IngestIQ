// import { useState } from "react";
// import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Download, RefreshCw } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// const validationResults = {
//   totalRecords: 15420,
//   validRecords: 14890,
//   invalidRecords: 530,
//   successRate: 96.6,
//   rulesExecuted: 12,
//   rulesPassed: 9,
//   rulesFailed: 3
// };

// const ruleResults = [
//   { rule: 'AccountID Uniqueness', column: 'AccountID', passed: 15420, failed: 0, severity: 'critical', status: 'passed' },
//   { rule: 'CustomerName Not Null', column: 'CustomerName', passed: 15395, failed: 25, severity: 'critical', status: 'warning' },
//   { rule: 'AccountType Values', column: 'AccountType', passed: 15200, failed: 220, severity: 'critical', status: 'failed' },
//   { rule: 'Balance Range', column: 'Balance', passed: 14950, failed: 470, severity: 'warning', status: 'failed' },
//   { rule: 'Email Format', column: 'Email', passed: 15300, failed: 120, severity: 'warning', status: 'warning' },
//   { rule: 'Phone Format', column: 'Phone', passed: 15380, failed: 40, severity: 'info', status: 'warning' },
// ];

// const chartData = [
//   { name: 'AccountID', passed: 15420, failed: 0 },
//   { name: 'CustomerName', passed: 15395, failed: 25 },
//   { name: 'AccountType', passed: 15200, failed: 220 },
//   { name: 'Balance', passed: 14950, failed: 470 },
//   { name: 'Email', passed: 15300, failed: 120 },
//   { name: 'Phone', passed: 15380, failed: 40 },
// ];

// const pieData = [
//   { name: 'Valid Records', value: validationResults.validRecords, color: '#10b981' },
//   { name: 'Invalid Records', value: validationResults.invalidRecords, color: '#ef4444' },
// ];

// const trendData = [
//   { date: '2024-01-01', successRate: 94.2 },
//   { date: '2024-01-02', successRate: 95.1 },
//   { date: '2024-01-03', successRate: 93.8 },
//   { date: '2024-01-04', successRate: 96.3 },
//   { date: '2024-01-05', successRate: 96.6 },
// ];

// export default function Dashboard() {
//   const [refreshing, setRefreshing] = useState(false);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     setTimeout(() => setRefreshing(false), 2000);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'passed': return <CheckCircle className="w-4 h-4 text-success" />;
//       case 'failed': return <XCircle className="w-4 h-4 text-destructive" />;
//       case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
//       default: return <Clock className="w-4 h-4 text-muted-foreground" />;
//     }
//   };

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case 'critical': return 'bg-destructive text-destructive-foreground';
//       case 'warning': return 'bg-warning text-warning-foreground';
//       case 'info': return 'bg-primary text-primary-foreground';
//       default: return 'bg-muted text-muted-foreground';
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Data Quality Dashboard</h1>
//           <p className="text-muted-foreground">
//             Real-time insights into your data validation results
//           </p>
//         </div>
        
//         <div className="flex space-x-2">
//           <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
//             <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button>
//             <Download className="w-4 h-4 mr-2" />
//             Export Report
//           </Button>
//         </div>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
//                 <p className="text-3xl font-bold text-success">{validationResults.successRate}%</p>
//               </div>
//               <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-success" />
//               </div>
//             </div>
//             <Progress value={validationResults.successRate} className="mt-2" />
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Records</p>
//                 <p className="text-3xl font-bold text-foreground">{validationResults.totalRecords.toLocaleString()}</p>
//               </div>
//               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                 <BarChart3 className="w-6 h-6 text-primary" />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground mt-2">
//               {validationResults.validRecords.toLocaleString()} valid, {validationResults.invalidRecords.toLocaleString()} invalid
//             </p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Rules Executed</p>
//                 <p className="text-3xl font-bold text-foreground">{validationResults.rulesExecuted}</p>
//               </div>
//               <div className="w-12 h-12 bg-chart-4/10 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-6 h-6 text-chart-4" />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground mt-2">
//               {validationResults.rulesPassed} passed, {validationResults.rulesFailed} failed
//             </p>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Invalid Records</p>
//                 <p className="text-3xl font-bold text-destructive">{validationResults.invalidRecords}</p>
//               </div>
//               <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
//                 <XCircle className="w-6 h-6 text-destructive" />
//               </div>
//             </div>
//             <p className="text-xs text-muted-foreground mt-2">
//               {((validationResults.invalidRecords / validationResults.totalRecords) * 100).toFixed(1)}% of total
//             </p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Charts and Detailed Results */}
//       <Tabs defaultValue="overview" className="w-full">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="rules">Rule Results</TabsTrigger>
//           <TabsTrigger value="trends">Trends</TabsTrigger>
//           <TabsTrigger value="failures">Failure Analysis</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Validation Results by Column</CardTitle>
//                 <CardDescription>Number of passed vs failed validations per column</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="passed" fill="#10b981" />
//                     <Bar dataKey="failed" fill="#ef4444" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Data Quality Distribution</CardTitle>
//                 <CardDescription>Overall data quality summary</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
        
//         <TabsContent value="rules" className="space-y-4">
//           <div className="space-y-4">
//             {ruleResults.map((result, index) => (
//               <Card key={index}>
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       {getStatusIcon(result.status)}
//                       <div>
//                         <h3 className="font-semibold">{result.rule}</h3>
//                         <p className="text-sm text-muted-foreground">Column: {result.column}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-4">
//                       <Badge className={getSeverityColor(result.severity)}>
//                         {result.severity}
//                       </Badge>
//                       <div className="text-right">
//                         <p className="text-sm font-medium text-success">
//                           {result.passed.toLocaleString()} passed
//                         </p>
//                         {result.failed > 0 && (
//                           <p className="text-sm font-medium text-destructive">
//                             {result.failed.toLocaleString()} failed
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs text-muted-foreground mb-1">
//                       <span>Success Rate</span>
//                       <span>{((result.passed / (result.passed + result.failed)) * 100).toFixed(1)}%</span>
//                     </div>
//                     <Progress 
//                       value={(result.passed / (result.passed + result.failed)) * 100} 
//                       className="h-2"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </TabsContent>
        
//         <TabsContent value="trends" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Success Rate Trend</CardTitle>
//               <CardDescription>Data quality success rate over time</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={trendData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis domain={[90, 100]} />
//                   <Tooltip />
//                   <Line 
//                     type="monotone" 
//                     dataKey="successRate" 
//                     stroke="#3b82f6" 
//                     strokeWidth={3}
//                     dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="failures" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Top Failing Rules</CardTitle>
//                 <CardDescription>Rules with the highest failure rates</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {ruleResults
//                     .filter(rule => rule.failed > 0)
//                     .sort((a, b) => b.failed - a.failed)
//                     .map((rule, index) => (
//                       <div key={index} className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium">{rule.rule}</p>
//                           <p className="text-sm text-muted-foreground">{rule.column}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-destructive">{rule.failed}</p>
//                           <p className="text-xs text-muted-foreground">failures</p>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Suggested Actions</CardTitle>
//                 <CardDescription>AI-generated recommendations to improve data quality</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
//                     <h4 className="font-medium text-warning">AccountType Validation</h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       220 records have invalid account types. Consider updating the enum values or cleaning the source data.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
//                     <h4 className="font-medium text-destructive">Balance Range Issues</h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       470 records have balance values outside the expected range. Review business rules for balance limits.
//                     </p>
//                   </div>
                  
//                   <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
//                     <h4 className="font-medium text-primary">Email Format</h4>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       120 email addresses are malformed. Consider implementing data cleansing rules.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }



// import { useState } from "react"
// import { CalendarIcon, X } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { format, startOfDay, startOfMonth, eachHourOfInterval, eachDayOfInterval, endOfDay, endOfMonth } from "date-fns"
// import { cn } from "@/lib/utils"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// interface LocalJob {
//   id: string
//   name: string
//   category: string
//   lastRun: string
//   status: string
//   description: string
//   isConnected?: boolean
//   pipelines?: any[]
//   stages?: any[]
//   duration?: string
//   jobId: string
// }

// interface DashboardProps {
//   jobs: LocalJob[]
//   allJobs: LocalJob[]
//   onViewResults: () => void
//   showViewResults: boolean
//   currentView: "chart" | "table"
//   onStatusFilter: (status: string) => void
//   selectedStatus: string
//   onCategoryFilter: (category: string) => void
//   selectedCategory: string
//   onDateRangeFilter: (range: string) => void
//   selectedDateRange: string
// }

// const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
// const STATUS_COLORS = {
//   Completed: "#10b981",
//   Running: "#3b82f6",
//   Failed: "#ef4444",
//   Queued: "#f59e0b",
// }

// const CATEGORY_COLORS: Record<string, string> = {
//   "Glue Jobs": "#3b82f6",
//   "Lambda Jobs": "#8b5cf6",
//   "Batch Jobs": "#10b981",
//   "ADF Jobs": "#f59e0b",
// }

// export default function Dashboard({
//   jobs,
//   allJobs,
//   onViewResults,
//   showViewResults,
//   currentView,
//   onStatusFilter,
//   selectedStatus,
//   onCategoryFilter,
//   selectedCategory,
//   onDateRangeFilter,
//   selectedDateRange,
// }: DashboardProps) {
//   const { toast } = useToast()
//   const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily")
//   const [columnChartDateRange, setColumnChartDateRange] = useState<Date | undefined>()

//   const getStatusData = () => {
//     const statusCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.status] = (acc[job.status] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(statusCounts).map(([status, count]) => ({
//       name: status,
//       value: count,
//       fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280",
//     }))
//   }

//   const getCategoryData = () => {
//     const categoryCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.category] = (acc[job.category] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(categoryCounts).map(([category, count], index) => ({
//       name: category,
//       value: count,
//       fill: CHART_COLORS[index % CHART_COLORS.length],
//     }))
//   }

//   const getTimePeriodData = () => {
//     let filteredJobs = allJobs
//     const now = new Date()
    
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         const targetDate = columnChartDateRange.toDateString()
//         filteredJobs = allJobs.filter((job) => new Date(job.lastRun).toDateString() === targetDate)
//       } else if (timePeriod === "monthly") {
//         const targetMonth = columnChartDateRange.getMonth()
//         const targetYear = columnChartDateRange.getFullYear()
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = new Date(job.lastRun)
//           return jobDate.getMonth() === targetMonth && jobDate.getFullYear() === targetYear
//         })
//       }
//     }

//     if (timePeriod === "daily") {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedDay = startOfDay(baseDate)
//       const endOfSelectedDay = endOfDay(baseDate)
//       const hours = eachHourOfInterval({ start: startOfSelectedDay, end: endOfSelectedDay })
      
//       const hourlyData: Record<string, Record<string, number>> = {}
//       hours.forEach(hour => {
//         const hourKey = format(hour, "HH:mm")
//         hourlyData[hourKey] = {
//           "Glue Jobs": 0,
//           "Lambda Jobs": 0,
//           "Batch Jobs": 0,
//           "ADF Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = new Date(job.lastRun)
//         const hourKey = format(jobDate, "HH:mm")
//         if (hourlyData[hourKey]) {
//           hourlyData[hourKey][job.category] = (hourlyData[hourKey][job.category] || 0) + 1
//         }
//       })

//       return Object.entries(hourlyData).map(([time, categories]) => ({
//         time,
//         ...categories
//       }))
//     } else {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedMonth = startOfMonth(baseDate)
//       const endOfSelectedMonth = endOfMonth(baseDate)
//       const days = eachDayOfInterval({ start: startOfSelectedMonth, end: endOfSelectedMonth })
      
//       const dailyData: Record<string, Record<string, number>> = {}
//       days.forEach(day => {
//         const dayKey = format(day, "dd/MM")
//         dailyData[dayKey] = {
//           "Glue Jobs": 0,
//           "Lambda Jobs": 0,
//           "Batch Jobs": 0,
//           "ADF Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = new Date(job.lastRun)
//         const dayKey = format(jobDate, "dd/MM")
//         if (dailyData[dayKey]) {
//           dailyData[dayKey][job.category] = (dailyData[dayKey][job.category] || 0) + 1
//         }
//       })

//       return Object.entries(dailyData).map(([time, categories]) => ({
//         time,
//         ...categories
//       }))
//     }
//   }

//   const clearColumnChartDateFilter = () => {
//     setColumnChartDateRange(undefined)
//   }

//   const getChartTitle = () => {
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         return `Jobs by Hour - ${format(columnChartDateRange, "MMM dd, yyyy")}`
//       } else {
//         return `Jobs by Day - ${format(columnChartDateRange, "MMM yyyy")}`
//       }
//     }
//     return `Jobs by ${timePeriod === "daily" ? "Hour" : "Day"}`
//   }

//   const customTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
//       return (
//         <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
//           <p className="font-medium">{`${timePeriod === "daily" ? "Hour" : "Date"}: ${label}`}</p>
//           <p className="text-sm text-muted-foreground mb-2">{`Total Jobs: ${total}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       )
//     }
//     return null
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Jobs by Category</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getCategoryData()} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
//                     {getCategoryData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newCategory = selectedCategory === entry.name ? "All" : entry.name
//                           onCategoryFilter(newCategory)
//                           toast({ title: "Filter Applied", description: `Showing ${newCategory} category jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getStatusData()} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
//                     {getStatusData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newStatus = selectedStatus === entry.name ? "All" : entry.name
//                           onStatusFilter(newStatus)
//                           toast({ title: "Filter Applied", description: `Showing ${newStatus} jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

        
//         <Card className="shadow-sm col-span-1 lg:col-span-2">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">{getChartTitle()}</h3>
//               <div className="flex gap-2">
//                 <div className="flex items-center gap-1">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "h-10 justify-start text-left font-normal w-48",
//                           !columnChartDateRange && "text-muted-foreground",
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {columnChartDateRange ? format(columnChartDateRange, "MMM dd, yyyy") : "Select Date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar mode="single" selected={columnChartDateRange} onSelect={setColumnChartDateRange} />
//                     </PopoverContent>
//                   </Popover>
//                   {columnChartDateRange && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={clearColumnChartDateFilter}
//                       className="h-10 w-10 p-0"
//                       title="Clear date filter"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//                 <Select
//                   value={timePeriod}
//                   onValueChange={(value) => setTimePeriod(value as "daily" | "monthly")}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select time period" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily (by Hour)</SelectItem>
//                     <SelectItem value="monthly">Monthly (by Day)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getTimePeriodData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="time" 
//                     tick={{ fontSize: 12 }}
//                     interval={timePeriod === "daily" ? 2 : 1}
//                   />
//                   <YAxis />
//                   <Tooltip content={customTooltip} />
//                   <Legend />
//                   <Bar dataKey="Glue Jobs" stackId="a" fill={CATEGORY_COLORS["Glue Jobs"]} />
//                   <Bar dataKey="Lambda Jobs" stackId="a" fill={CATEGORY_COLORS["Lambda Jobs"]} />
//                   <Bar dataKey="Batch Jobs" stackId="a" fill={CATEGORY_COLORS["Batch Jobs"]} />
//                   <Bar dataKey="ADF Jobs" stackId="a" fill={CATEGORY_COLORS["ADF Jobs"]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


// import { useState } from "react"
// import { CalendarIcon, X } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { format, startOfDay, startOfMonth, eachHourOfInterval, eachDayOfInterval, endOfDay, endOfMonth } from "date-fns"
// import { cn } from "@/lib/utils"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// interface LocalJob {
//   id: string
//   name: string
//   category: string
//   lastRun: string
//   status: string
//   description?: string // Changed from required to optional
//   isConnected?: boolean
//   pipelines?: any[]
//   stages?: any[]
//   duration?: string
//   jobId: string
// }

// interface DashboardProps {
//   jobs: LocalJob[]
//   allJobs: LocalJob[]
//   onViewResults: () => void
//   showViewResults: boolean
//   currentView: "chart" | "table"
//   onStatusFilter: (status: string) => void
//   selectedStatus: string
//   onCategoryFilter: (category: string) => void
//   selectedCategory: string
//   onDateRangeFilter: (range: string) => void
//   selectedDateRange: string
// }

// const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
// const STATUS_COLORS = {
//   Completed: "#10b981",
//   Running: "#3b82f6",
//   Failed: "#ef4444",
//   Queued: "#f59e0b",
// }

// const CATEGORY_COLORS: Record<string, string> = {
//   "Glue Jobs": "#3b82f6",
//   "Lambda Jobs": "#8b5cf6",
//   "Batch Jobs": "#10b981",
//   "ADF Jobs": "#f59e0b",
// }

// export default function Dashboard({
//   jobs,
//   allJobs,
//   onViewResults,
//   showViewResults,
//   currentView,
//   onStatusFilter,
//   selectedStatus,
//   onCategoryFilter,
//   selectedCategory,
//   onDateRangeFilter,
//   selectedDateRange,
// }: DashboardProps) {
//   const { toast } = useToast()
//   const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily")
//   const [columnChartDateRange, setColumnChartDateRange] = useState<Date | undefined>()

//   const getStatusData = () => {
//     const statusCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.status] = (acc[job.status] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(statusCounts).map(([status, count]) => ({
//       name: status,
//       value: count,
//       fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280",
//     }))
//   }

//   const getCategoryData = () => {
//     const categoryCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.category] = (acc[job.category] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(categoryCounts).map(([category, count], index) => ({
//       name: category,
//       value: count,
//       fill: CHART_COLORS[index % CHART_COLORS.length],
//     }))
//   }

//   const getTimePeriodData = () => {
//     let filteredJobs = allJobs
//     const now = new Date()
    
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         const targetDate = columnChartDateRange.toDateString()
//         filteredJobs = allJobs.filter((job) => new Date(job.lastRun).toDateString() === targetDate)
//       } else if (timePeriod === "monthly") {
//         const targetMonth = columnChartDateRange.getMonth()
//         const targetYear = columnChartDateRange.getFullYear()
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = new Date(job.lastRun)
//           return jobDate.getMonth() === targetMonth && jobDate.getFullYear() === targetYear
//         })
//       }
//     }

//     if (timePeriod === "daily") {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedDay = startOfDay(baseDate)
//       const endOfSelectedDay = endOfDay(baseDate)
//       const hours = eachHourOfInterval({ start: startOfSelectedDay, end: endOfSelectedDay })
      
//       const hourlyData: Record<string, Record<string, number>> = {}
//       hours.forEach(hour => {
//         const hourKey = format(hour, "HH:mm")
//         hourlyData[hourKey] = {
//           "Glue Jobs": 0,
//           "Lambda Jobs": 0,
//           "Batch Jobs": 0,
//           "ADF Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = new Date(job.lastRun)
//         const hourKey = format(jobDate, "HH:mm")
//         if (hourlyData[hourKey]) {
//           hourlyData[hourKey][job.category] = (hourlyData[hourKey][job.category] || 0) + 1
//         }
//       })

//       return Object.entries(hourlyData).map(([time, categories]) => ({
//         time,
//         ...categories
//       }))
//     } else {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedMonth = startOfMonth(baseDate)
//       const endOfSelectedMonth = endOfMonth(baseDate)
//       const days = eachDayOfInterval({ start: startOfSelectedMonth, end: endOfSelectedMonth })
      
//       const dailyData: Record<string, Record<string, number>> = {}
//       days.forEach(day => {
//         const dayKey = format(day, "dd/MM")
//         dailyData[dayKey] = {
//           "Glue Jobs": 0,
//           "Lambda Jobs": 0,
//           "Batch Jobs": 0,
//           "ADF Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = new Date(job.lastRun)
//         const dayKey = format(jobDate, "dd/MM")
//         if (dailyData[dayKey]) {
//           dailyData[dayKey][job.category] = (dailyData[dayKey][job.category] || 0) + 1
//         }
//       })

//       return Object.entries(dailyData).map(([time, categories]) => ({
//         time,
//         ...categories
//       }))
//     }
//   }

//   const clearColumnChartDateFilter = () => {
//     setColumnChartDateRange(undefined)
//   }

//   const getChartTitle = () => {
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         return `Jobs by Hour - ${format(columnChartDateRange, "MMM dd, yyyy")}`
//       } else {
//         return `Jobs by Day - ${format(columnChartDateRange, "MMM yyyy")}`
//       }
//     }
//     return `Jobs by ${timePeriod === "daily" ? "Hour" : "Day"}`
//   }

//   const customTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
//       return (
//         <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
//           <p className="font-medium">{`${timePeriod === "daily" ? "Hour" : "Date"}: ${label}`}</p>
//           <p className="text-sm text-muted-foreground mb-2">{`Total Jobs: ${total}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       )
//     }
//     return null
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        
//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Jobs by Category</h3>
//             <div className="h-40">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getCategoryData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
//                     {getCategoryData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newCategory = selectedCategory === entry.name ? "All" : entry.name
//                           onCategoryFilter(newCategory)
//                           toast({ title: "Filter Applied", description: `Showing ${newCategory} category jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
                  
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
//             <div className="h-40">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getStatusData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
//                     {getStatusData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newStatus = selectedStatus === entry.name ? "All" : entry.name
//                           onStatusFilter(newStatus)
//                           toast({ title: "Filter Applied", description: `Showing ${newStatus} jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm col-span-1 lg:col-span-2">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">{getChartTitle()}</h3>
//               <div className="flex gap-2">
//                 <div className="flex items-center gap-1">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "h-10 justify-start text-left font-normal w-48",
//                           !columnChartDateRange && "text-muted-foreground",
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {columnChartDateRange ? format(columnChartDateRange, "MMM dd, yyyy") : "Select Date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar mode="single" selected={columnChartDateRange} onSelect={setColumnChartDateRange} />
//                     </PopoverContent>
//                   </Popover>
//                   {columnChartDateRange && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={clearColumnChartDateFilter}
//                       className="h-10 w-10 p-0"
//                       title="Clear date filter"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//                 <Select
//                   value={timePeriod}
//                   onValueChange={(value) => setTimePeriod(value as "daily" | "monthly")}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select time period" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily (by Hour)</SelectItem>
//                     <SelectItem value="monthly">Monthly (by Day)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getTimePeriodData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="time" 
//                     tick={{ fontSize: 12 }}
//                     interval={timePeriod === "daily" ? 2 : 1}
//                   />
//                   <YAxis />
//                   <Tooltip content={customTooltip} />
//                   <Legend />
//                   <Bar dataKey="Glue Jobs" stackId="a" fill={CATEGORY_COLORS["Glue Jobs"]} />
//                   <Bar dataKey="Lambda Jobs" stackId="a" fill={CATEGORY_COLORS["Lambda Jobs"]} />
//                   <Bar dataKey="Batch Jobs" stackId="a" fill={CATEGORY_COLORS["Batch Jobs"]} />
//                   <Bar dataKey="ADF Jobs" stackId="a" fill={CATEGORY_COLORS["ADF Jobs"]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }





// import { useState } from "react"
// import { CalendarIcon, X } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { format, startOfDay, startOfMonth, eachHourOfInterval, eachDayOfInterval, endOfDay, endOfMonth, parseISO } from "date-fns"
// import { cn } from "@/lib/utils"
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"

// interface LocalJob {
//   id: string
//   name: string
//   category: string
//   lastRun: string
//   createdAt: string
//   status: string
//   description?: string
//   isConnected?: boolean
//   pipelines?: any[]
//   stages?: any[]
//   duration?: string
//   jobId: string
// }

// interface DashboardProps {
//   jobs: LocalJob[]
//   allJobs: LocalJob[]
//   onViewResults: () => void
//   showViewResults: boolean
//   currentView: "chart" | "table"
//   onStatusFilter: (status: string) => void
//   selectedStatus: string
//   onCategoryFilter: (category: string) => void
//   selectedCategory: string
//   onDateRangeFilter: (range: string) => void
//   selectedDateRange: string
// }

// const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
// const STATUS_COLORS = {
//   Completed: "#10b981",
//   Running: "#3b82f6",
//   Failed: "#ef4444",
//   Queued: "#f59e0b",
// }

// const CATEGORY_COLORS: Record<string, string> = {
//   "Glue Jobs": "#3b82f6",
//   "Lambda Jobs": "#8b5cf6",
//   "Batch Jobs": "#10b981",
//   "ADF Jobs": "#f59e0b",
// }

// export default function Dashboard({
//   jobs,
//   allJobs,
//   onViewResults,
//   showViewResults,
//   currentView,
//   onStatusFilter,
//   selectedStatus,
//   onCategoryFilter,
//   selectedCategory,
//   onDateRangeFilter,
//   selectedDateRange,
// }: DashboardProps) {
//   const { toast } = useToast()
//   const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily")
//   const [columnChartDateRange, setColumnChartDateRange] = useState<Date | undefined>()

//   const getStatusData = () => {
//     const statusCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.status] = (acc[job.status] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(statusCounts).map(([status, count]) => ({
//       name: status,
//       value: count,
//       fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280",
//     }))
//   }

//   const getCategoryData = () => {
//     const categoryCounts = jobs.reduce(
//       (acc, job) => {
//         acc[job.category] = (acc[job.category] || 0) + 1
//         return acc
//       },
//       {} as Record<string, number>,
//     )

//     return Object.entries(categoryCounts).map(([category, count], index) => ({
//       name: category,
//       value: count,
//       fill: CHART_COLORS[index % CHART_COLORS.length],
//     }))
//   }

//   const getTimePeriodData = () => {
//     let filteredJobs = allJobs
//     let glueJobsCount = 0
//     const now = new Date()
    
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         const targetDate = startOfDay(columnChartDateRange)
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = parseISO(job.createdAt)
//           return startOfDay(jobDate).getTime() === targetDate.getTime()
//         })
//       } else if (timePeriod === "monthly") {
//         const targetMonth = columnChartDateRange.getMonth()
//         const targetYear = columnChartDateRange.getFullYear()
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = parseISO(job.createdAt)
//           return jobDate.getMonth() === targetMonth && jobDate.getFullYear() === targetYear
//         })
//       }
//     } else {
//       // If no date is selected, use the current day for daily view or current month for monthly view
//       if (timePeriod === "daily") {
//         const startOfToday = startOfDay(now)
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = parseISO(job.createdAt)
//           return startOfDay(jobDate).getTime() === startOfToday.getTime()
//         })
//       } else {
//         const startOfCurrentMonth = startOfMonth(now)
//         const endOfCurrentMonth = endOfMonth(now)
//         filteredJobs = allJobs.filter((job) => {
//           const jobDate = parseISO(job.createdAt)
//           return jobDate >= startOfCurrentMonth && jobDate <= endOfCurrentMonth
//         })
//       }
//     }

//     // Calculate total Glue Jobs count for the filtered jobs
//     glueJobsCount = filteredJobs.filter((job) => job.category === "Glue").length

//     if (timePeriod === "daily") {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedDay = startOfDay(baseDate)
//       const endOfSelectedDay = endOfDay(baseDate)
//       const hours = eachHourOfInterval({ start: startOfSelectedDay, end: endOfSelectedDay })
      
//       const hourlyData: Record<string, Record<string, number>> = {}
//       hours.forEach(hour => {
//         const hourKey = format(hour, "HH:mm")
//         hourlyData[hourKey] = {
//           "Glue Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = parseISO(job.createdAt)
//         const hourKey = format(jobDate, "HH:mm")
//         if (hourlyData[hourKey] && job.category === "Glue") {
//           hourlyData[hourKey]["Glue Jobs"] = (hourlyData[hourKey]["Glue Jobs"] || 0) + 1
//         }
//       })

//       return {
//         data: Object.entries(hourlyData).map(([time, categories]) => ({
//           time,
//           ...categories,
//         })),
//         glueJobsCount,
//       }
//     } else {
//       const baseDate = columnChartDateRange || now
//       const startOfSelectedMonth = startOfMonth(baseDate)
//       const endOfSelectedMonth = endOfMonth(baseDate)
//       const days = eachDayOfInterval({ start: startOfSelectedMonth, end: endOfSelectedMonth })
      
//       const dailyData: Record<string, Record<string, number>> = {}
//       days.forEach(day => {
//         const dayKey = format(day, "dd/MM")
//         dailyData[dayKey] = {
//           "Glue Jobs": 0,
//         }
//       })

//       filteredJobs.forEach(job => {
//         const jobDate = parseISO(job.createdAt)
//         const dayKey = format(jobDate, "dd/MM")
//         if (dailyData[dayKey] && job.category === "Glue") {
//           dailyData[dayKey]["Glue Jobs"] = (dailyData[dayKey]["Glue Jobs"] || 0) + 1
//         }
//       })

//       return {
//         data: Object.entries(dailyData).map(([time, categories]) => ({
//           time,
//           ...categories,
//         })),
//         glueJobsCount,
//       }
//     }
//   }

//   const clearColumnChartDateFilter = () => {
//     setColumnChartDateRange(undefined)
//   }

//   const getChartTitle = () => {
//     const { glueJobsCount } = getTimePeriodData()
//     if (columnChartDateRange) {
//       if (timePeriod === "daily") {
//         return `Glue Jobs Created by Hour - ${format(columnChartDateRange, "MMM dd, yyyy")} (Total Glue Jobs: ${glueJobsCount})`
//       } else {
//         return `Glue Jobs Created by Day - ${format(columnChartDateRange, "MMM yyyy")} (Total Glue Jobs: ${glueJobsCount})`
//       }
//     }
//     return `Glue Jobs Created by ${timePeriod === "daily" ? "Hour" : "Day"} (Total Glue Jobs: ${glueJobsCount})`
//   }

//   const customTooltip = ({ active, payload, label }: any) => {
//     if (active && payload && payload.length) {
//       const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
//       return (
//         <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
//           <p className="font-medium">{`${timePeriod === "daily" ? "Hour" : "Date"}: ${label}`}</p>
//           <p className="text-sm text-muted-foreground mb-2">{`Total Glue Jobs Created: ${total}`}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} style={{ color: entry.color }} className="text-sm">
//               {`${entry.dataKey}: ${entry.value}`}
//             </p>
//           ))}
//         </div>
//       )
//     }
//     return null
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         {showViewResults && (
//           <Button onClick={onViewResults} variant="outline" className="mb-4">
//             View Results
//           </Button>
//         )}
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Jobs by Category</h3>
//             <div className="h-40">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getCategoryData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
//                     {getCategoryData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newCategory = selectedCategory === entry.name ? "All" : entry.name
//                           onCategoryFilter(newCategory)
//                           toast({ title: "Filter Applied", description: `Showing ${newCategory} category jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm">
//           <CardContent className="p-6">
//             <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
//             <div className="h-40">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={getStatusData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
//                     {getStatusData().map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={entry.fill}
//                         onClick={() => {
//                           const newStatus = selectedStatus === entry.name ? "All" : entry.name
//                           onStatusFilter(newStatus)
//                           toast({ title: "Filter Applied", description: `Showing ${newStatus} jobs` })
//                         }}
//                         className="cursor-pointer"
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm col-span-1 lg:col-span-2">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold">{getChartTitle()}</h3>
//               <div className="flex gap-2">
//                 <div className="flex items-center gap-1">
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant="outline"
//                         className={cn(
//                           "h-10 justify-start text-left font-normal w-48",
//                           !columnChartDateRange && "text-muted-foreground",
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {columnChartDateRange ? format(columnChartDateRange, "MMM dd, yyyy") : "Select Date"}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar mode="single" selected={columnChartDateRange} onSelect={setColumnChartDateRange} />
//                     </PopoverContent>
//                   </Popover>
//                   {columnChartDateRange && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={clearColumnChartDateFilter}
//                       className="h-10 w-10 p-0"
//                       title="Clear date filter"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//                 <Select
//                   value={timePeriod}
//                   onValueChange={(value) => setTimePeriod(value as "daily" | "monthly")}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Select time period" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily (by Hour)</SelectItem>
//                     <SelectItem value="monthly">Monthly (by Day)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getTimePeriodData().data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="time" 
//                     tick={{ fontSize: 12 }}
//                     interval={timePeriod === "daily" ? 2 : 1}
//                   />
//                   <YAxis />
//                   <Tooltip content={customTooltip} />
//                   <Legend />
//                   <Bar dataKey="Glue Jobs" stackId="a" fill={CATEGORY_COLORS["Glue Jobs"]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format, startOfDay, startOfMonth, eachHourOfInterval, eachDayOfInterval, endOfDay, endOfMonth, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface LocalJob {
  id: string
  name: string
  category: string
  lastRun: string
  createdAt: string
  status: string
  description?: string
  isConnected?: boolean
  pipelines?: any[]
  stages?: any[]
  duration?: string
  jobId: string
}

interface DashboardProps {
  jobs: LocalJob[]
  allJobs: LocalJob[]
  onViewResults: () => void
  showViewResults: boolean
  currentView: "chart" | "table"
  onStatusFilter: (status: string) => void
  selectedStatus: string
  onCategoryFilter: (category: string) => void
  selectedCategory: string
  onDateRangeFilter: (range: string) => void
  selectedDateRange: string
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
const STATUS_COLORS = {
  Completed: "#10b981",
  Running: "#3b82f6",
  Failed: "#ef4444",
  Queued: "#f59e0b",
}

const CATEGORY_COLORS: Record<string, string> = {
  "Glue Jobs": "#3b82f6",
  "Lambda Jobs": "#8b5cf6",
  "Batch Jobs": "#10b981",
  "ADF Jobs": "#f59e0b",
}

export default function Dashboard({
  jobs,
  allJobs,
  onViewResults,
  showViewResults,
  currentView,
  onStatusFilter,
  selectedStatus,
  onCategoryFilter,
  selectedCategory,
  onDateRangeFilter,
  selectedDateRange,
}: DashboardProps) {
  const { toast } = useToast()
  const [timePeriod, setTimePeriod] = useState<"daily" | "monthly">("daily")

  const getStatusData = () => {
    const statusCounts = jobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#6b7280",
    }))
  }

  const getCategoryData = () => {
    const categoryCounts = jobs.reduce(
      (acc, job) => {
        acc[job.category] = (acc[job.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(categoryCounts).map(([category, count], index) => ({
      name: category,
      value: count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))
  }

  const getTimePeriodData = () => {
    let filteredJobs = allJobs
    let glueJobsCount = 0
    const now = new Date()
    
    if (timePeriod === "daily") {
      const startOfToday = startOfDay(now)
      filteredJobs = allJobs.filter((job) => {
        const jobDate = parseISO(job.createdAt)
        return startOfDay(jobDate).getTime() === startOfToday.getTime()
      })
    } else {
      const startOfCurrentMonth = startOfMonth(now)
      const endOfCurrentMonth = endOfMonth(now)
      filteredJobs = allJobs.filter((job) => {
        const jobDate = parseISO(job.createdAt)
        return jobDate >= startOfCurrentMonth && jobDate <= endOfCurrentMonth
      })
    }

    // Calculate total Glue Jobs count for the filtered jobs
    glueJobsCount = filteredJobs.filter((job) => job.category === "Glue").length

    if (timePeriod === "daily") {
      const startOfSelectedDay = startOfDay(now)
      const endOfSelectedDay = endOfDay(now)
      const hours = eachHourOfInterval({ start: startOfSelectedDay, end: endOfSelectedDay })
      
      const hourlyData: Record<string, Record<string, number>> = {}
      hours.forEach(hour => {
        const hourKey = format(hour, "HH:mm")
        hourlyData[hourKey] = {
          "Glue Jobs": 0,
        }
      })

      filteredJobs.forEach(job => {
        const jobDate = parseISO(job.createdAt)
        const hourKey = format(jobDate, "HH:mm")
        if (hourlyData[hourKey] && job.category === "Glue") {
          hourlyData[hourKey]["Glue Jobs"] = (hourlyData[hourKey]["Glue Jobs"] || 0) + 1
        }
      })

      return {
        data: Object.entries(hourlyData).map(([time, categories]) => ({
          time,
          ...categories,
        })),
        glueJobsCount,
      }
    } else {
      const startOfSelectedMonth = startOfMonth(now)
      const endOfSelectedMonth = endOfMonth(now)
      const days = eachDayOfInterval({ start: startOfSelectedMonth, end: endOfSelectedMonth })
      
      const dailyData: Record<string, Record<string, number>> = {}
      days.forEach(day => {
        const dayKey = format(day, "dd/MM")
        dailyData[dayKey] = {
          "Glue Jobs": 0,
        }
      })

      filteredJobs.forEach(job => {
        const jobDate = parseISO(job.createdAt)
        const dayKey = format(jobDate, "dd/MM")
        if (dailyData[dayKey] && job.category === "Glue") {
          dailyData[dayKey]["Glue Jobs"] = (dailyData[dayKey]["Glue Jobs"] || 0) + 1
        }
      })

      return {
        data: Object.entries(dailyData).map(([time, categories]) => ({
          time,
          ...categories,
        })),
        glueJobsCount,
      }
    }
  }

  const getChartTitle = () => {
    const { glueJobsCount } = getTimePeriodData()
    if (timePeriod === "daily") {
      return `Glue Jobs Created by Hour - ${format(new Date(), "MMM dd, yyyy")} (Total Glue Jobs: ${glueJobsCount})`
    } else {
      return `Glue Jobs Created by Day - ${format(new Date(), "MMM yyyy")} (Total Glue Jobs: ${glueJobsCount})`
    }
  }

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0)
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`${timePeriod === "daily" ? "Hour" : "Date"}: ${label}`}</p>
          <p className="text-sm text-muted-foreground mb-2">{`Total Glue Jobs Created: ${total}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {showViewResults && (
          <Button onClick={onViewResults} variant="outline" className="mb-4">
            View Results
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Jobs by Category</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={getCategoryData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
                    {getCategoryData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        onClick={() => {
                          const newCategory = selectedCategory === entry.name ? "All" : entry.name
                          onCategoryFilter(newCategory)
                          toast({ title: "Filter Applied", description: `Showing ${newCategory} category jobs` })
                        }}
                        className="cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Job Status Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={getStatusData()} cx="50%" cy="50%" outerRadius={65} paddingAngle={5} dataKey="value">
                    {getStatusData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        onClick={() => {
                          const newStatus = selectedStatus === entry.name ? "All" : entry.name
                          onStatusFilter(newStatus)
                          toast({ title: "Filter Applied", description: `Showing ${newStatus} jobs` })
                        }}
                        className="cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm col-span-1 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{getChartTitle()}</h3>
              <div className="flex gap-2">
                <Select
                  value={timePeriod}
                  onValueChange={(value) => setTimePeriod(value as "daily" | "monthly")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (by Hour)</SelectItem>
                    <SelectItem value="monthly">Monthly (by Day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTimePeriodData().data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    interval={timePeriod === "daily" ? 2 : 1}
                  />
                  <YAxis />
                  <Tooltip content={customTooltip} />
                  <Legend />
                  <Bar dataKey="Glue Jobs" stackId="a" fill={CATEGORY_COLORS["Glue Jobs"]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}