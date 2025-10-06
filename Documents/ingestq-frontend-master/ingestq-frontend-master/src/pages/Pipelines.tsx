
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Play, Eye, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PipelineBuilderDialog from "@/components/jobs/PipelineBuilderDialog";
import ViewJobDialog01 from "@/components/jobs/ViewJobDialog01";
import { cn } from "@/lib/utils";
import { getAllPipelines, runPipeline, editPipeline, createPipeline, getPipelineJobs } from "@/lib/api";

// Define TypeScript interfaces
interface JobStage {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface ScheduleDetails {
  frequency?: string;
  time?: string;
}

interface BusinessLogicRules {
  [key: string]: string;
}

interface Job {
  id: string;
  name: string;
  category: string;
  lastRun: string | null;
  status: string;
  description?: string;
  isConnected?: boolean;
  stages?: JobStage[];
  triggerType?: string;
  email?: string;
  glue_job_name?: string;
  scheduleDetails?: ScheduleDetails;
  datasource?: string;
  datadestination?: string;
  business_logic_rules?: BusinessLogicRules;
  folderName?: string;
  pipelineName?: string;
  pipelineId?: string;
}

interface Pipeline {
  id: string;
  pipelineId: string;
  pipelineName: string;
  createdAt: string;
  num_jobs: number;
  jobs: Job[];
  nodes: any[];
  edges: any[];
  status: string;
}

export default function Pipelines() {
  const { toast } = useToast();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPipelines, setFilteredPipelines] = useState<Pipeline[]>([]);
  const [pipelineBuilderOpen, setPipelineBuilderOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null);
  const [viewingPipeline, setViewingPipeline] = useState<Pipeline | null>(null);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(null);

  const fetchPipelines = async () => {
    try {
      const res = await getAllPipelines();
      if (res.success) {
        setPipelines(
          res.pipelines.map((p: any) => {
            const pipelineId = p.pipeline_id;
            const pipelineName = p.pipeline_name;
            return {
              id: pipelineId,
              pipelineId: pipelineId,
              pipelineName: pipelineName,
              createdAt: p.created_at || new Date().toISOString(),
              num_jobs: p.num_jobs || 0,
              jobs: p.jobs
                ? p.jobs.map((job: any, i: number) => ({
                    id: job.jobId || `job-${i}`,
                    name: job.jobName || `Job ${i + 1}`,
                    category: job.category || "Unknown",
                    lastRun: job.LastRun || null,
                    status: job.Status || "Pending",
                    description: job.description || "",
                    isConnected: true,
                    pipelineName: pipelineName,
                    pipelineId: pipelineId,
                    triggerType: job.triggerType || "Unknown",
                    email: job.email || "",
                    glue_job_name: job.glue_job_name || "",
                    scheduleDetails: job.scheduleDetails || {},
                    datasource: job.datasource || "",
                    datadestination: job.datadestination || "",
                    business_logic_rules: job.business_logic_rules || {},
                    folderName: job.FolderName || "",
                    stages: job.steps
                      ? Object.entries(job.steps).map(([name, status]) => ({
                          id: `${job.jobId || `job-${i}`}-${name}`,
                          name,
                          type: name,
                          status: status as string,
                        }))
                      : [],
                  }))
                : [],
              nodes: p.nodes || [],
              edges: p.edges || [],
              status: p.status || "CREATED",
            };
          }),
        );
      } else {
        toast({ title: "Error", description: res.message || "Failed to fetch pipelines." });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch pipelines." });
      console.error("Error fetching pipelines:", error);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  useEffect(() => {
    setFilteredPipelines(
      pipelines.filter((pipeline) => pipeline.pipelineName.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [pipelines, searchTerm]);

  const getPipelineStatus = (pipeline: Pipeline) => {
    switch (pipeline.status?.toUpperCase()) {
      case "CREATED":
        return "Pending";
      case "RUNNING":
        return "Running";
      case "COMPLETED":
        return "Completed";
      case "FAILED":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 text-white dark:bg-green-600 dark:text-white";
      case "running":
        return "bg-blue-500 text-white dark:bg-blue-600 dark:text-white";
      case "failed":
        return "bg-red-500 text-white dark:bg-red-600 dark:text-white";
      case "pending":
      case "created":
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
      default:
        return "bg-gray-500 text-white dark:bg-gray-600 dark:text-white";
    }
  };

  const handleOpenPipelineBuilder = () => {
    setEditingPipeline(null);
    setPipelineBuilderOpen(true);
  };

  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline({
      id: pipeline.id,
      pipelineId: pipeline.pipelineId,
      pipelineName: pipeline.pipelineName,
      createdAt: pipeline.createdAt,
      num_jobs: pipeline.num_jobs,
      jobs: pipeline.jobs,
      nodes: pipeline.nodes,
      edges: pipeline.edges,
      status: pipeline.status,
    });
    setPipelineBuilderOpen(true);
  };


  // const handleSavePipeline = async (pipelineData: { name: string; jobs: string[]; nodes: any[]; edges: any[] }) => {
  //   try {
  //     if (editingPipeline) {
  //       await editPipeline({
  //         pipelineId: editingPipeline.pipelineId,
  //         pipelineName: pipelineData.name,
  //         jobIds: pipelineData.jobs,
  //       });
  //       toast({ title: "Pipeline Updated", description: `Pipeline "${pipelineData.name}" has been updated successfully.` });
  //     } else {
  //       await createPipeline({
  //         pipelineName: pipelineData.name,
  //         jobIds: pipelineData.jobs,
  //       });
  //       toast({ title: "Pipeline Created", description: `Pipeline "${pipelineData.name}" has been created successfully.` });
  //     }
  //     await fetchPipelines();
  //   } catch (error) {
  //     toast({ title: "Error", description: `Failed to ${editingPipeline ? "update" : "create"} pipeline: ${error.message || "Unknown error"}` });
  //     console.error(`Error ${editingPipeline ? "updating" : "creating"} pipeline:`, error);
  //   }
  //   setPipelineBuilderOpen(false);
  //   setEditingPipeline(null);
  // };

  const handleSavePipeline = async (pipelineData: { name: string; jobs: string[]; nodes: any[]; edges: any[] }) => {
  console.log('Parent handleSavePipeline called with:', pipelineData); // Add for debugging
  try {
    if (editingPipeline) {
      await editPipeline({
        pipelineId: editingPipeline.pipelineId,
        pipelineName: pipelineData.name,
        jobIds: pipelineData.jobs,
      });
      toast({ title: "Pipeline Updated", description: `Pipeline "${pipelineData.name}" has been updated successfully.` });
    } else {
      await createPipeline({
        pipelineName: pipelineData.name,
        jobIds: pipelineData.jobs,
      });
      toast({ title: "Pipeline Created", description: `Pipeline "${pipelineData.name}" has been created successfully.` });
    }
    await fetchPipelines(); // Refresh the list
  } catch (error) {
    toast({ title: "Error", description: `Failed to ${editingPipeline ? "update" : "create"} pipeline: ${error.message || "Unknown error"}` });
    console.error(`Error ${editingPipeline ? "updating" : "creating"} pipeline:`, error);
  }
  setPipelineBuilderOpen(false);
  setEditingPipeline(null);
};

  const handleDeletePipeline = (pipeline: Pipeline) => {
    setPipelineToDelete(pipeline);
    setDeleteConfirmOpen(true);
  };

  const confirmDeletePipeline = () => {
    if (!pipelineToDelete) return;
    setPipelines((prev) => prev.filter((p) => p.id !== pipelineToDelete.id));
    toast({ title: "Pipeline Deleted", description: `${pipelineToDelete.pipelineName} has been removed.` });
    setDeleteConfirmOpen(false);
    setPipelineToDelete(null);
  };

  const handleRunPipeline = async (pipeline: Pipeline) => {
    try {
      // Set status to RUNNING immediately
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipeline.id ? { ...p, status: "RUNNING" } : p
        )
      );
      toast({ title: "Pipeline Started", description: `${pipeline.pipelineName} is now running.` });

      // Call API to run pipeline
      const response = await runPipeline({ pipelineId: pipeline.id, token: "your-auth-token" });

      // Simulate pipeline completion (replace with actual API response checking if needed)
      setTimeout(() => {
        const isSuccess = response.success; // Adjust based on actual API response structure
        setPipelines((prev) =>
          prev.map((p) =>
            p.id === pipeline.id
              ? { ...p, status: isSuccess ? "COMPLETED" : "FAILED" }
              : p
          )
        );
        toast({
          title: isSuccess ? "Pipeline Completed" : "Pipeline Failed",
          description: isSuccess
            ? `${pipeline.pipelineName} completed successfully.`
            : `${pipeline.pipelineName} failed to complete.`,
        });
      }, 2000); // Simulated 2-second delay for pipeline execution
    } catch (error) {
      setPipelines((prev) =>
        prev.map((p) =>
          p.id === pipeline.id ? { ...p, status: "FAILED" } : p
        )
      );
      toast({ title: "Error", description: `Failed to run pipeline: ${error.message || "Unknown error"}` });
      console.error("Error running pipeline:", error);
    }
  };

  const handleViewPipeline = async (pipeline: Pipeline) => {
    try {
      setViewingPipeline(null);
      const res = await getPipelineJobs(pipeline.id);
      if (res.success && res.jobs.length > 0) {
        const mappedJobs: Job[] = res.jobs.map((job: any) => ({
          id: job.jobId,
          name: job.jobName,
          category: "Unknown",
          lastRun: job.LastRun,
          status: job.Status,
          description: "",
          isConnected: job.datadestination && job.datadestination.trim() !== "",
          pipelineName: pipeline.pipelineName,
          pipelineId: pipeline.id,
          triggerType: job.triggerType,
          email: job.email,
          glue_job_name: job.glue_job_name,
          scheduleDetails: job.scheduleDetails,
          datasource: job.datasource,
          datadestination: job.datadestination,
          business_logic_rules: job.business_logic_rules,
          folderName: job.FolderName,
          stages: job.steps
            ? Object.entries(job.steps).map(([name, status]) => ({
                id: `${job.jobId}-${name}`,
                name,
                type: name,
                status: status as string,
              }))
            : [],
        }));
        setPipelines((prev) =>
          prev.map((p) =>
            p.id === pipeline.id
              ? { ...p, jobs: mappedJobs }
              : p
          )
        );
        setViewingPipeline({ ...pipeline, jobs: mappedJobs });
      } else {
        setViewingPipeline({ ...pipeline, jobs: [] });
        toast({ title: "No Jobs", description: `No jobs found for pipeline "${pipeline.pipelineName}"` });
      }
    } catch (error) {
      console.error("Error fetching pipeline jobs:", error);
      toast({ title: "Error", description: "Failed to fetch pipeline jobs." });
      setViewingPipeline({ ...pipeline, jobs: [] });
    }
  };

  const handleViewJob = (job: Job) => {
    setViewingJob(job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6">
        <div className="mb-6 mt-14 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Pipelines ({filteredPipelines.length})</h1>
            <p className="text-muted-foreground text-sm mt-1">View and manage your pipelines</p>
          </div>
          <Button onClick={handleOpenPipelineBuilder} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
            Create Pipeline
          </Button>
        </div>
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/30">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pipelines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-muted/20 border-b text-sm font-medium text-muted-foreground">
              <div>Pipeline Name</div>
              <div>Jobs</div>
              <div>Created At</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {filteredPipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors"
                >
                  <div className="font-medium text-foreground">{pipeline.pipelineName}</div>
                  <div>
                    <Badge
                      className="text-xs bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500"
                      onClick={() => handleViewPipeline(pipeline)}
                    >
                      {pipeline.num_jobs}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-sm">{pipeline.createdAt}</div>
                  <div>
                    <Badge className={cn("text-xs px-2 py-1", getStatusColor(getPipelineStatus(pipeline)))}>
                      {getPipelineStatus(pipeline)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRunPipeline(pipeline)}
                      className="w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                      title="Run Pipeline"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPipeline(pipeline)}
                      className="w-8 h-8 rounded-full p-0"
                      title="View Pipeline"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPipeline(pipeline)}
                      className="w-8 h-8 rounded-full p-0"
                      title="Edit Pipeline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePipeline(pipeline)}
                      className="w-8 h-8 rounded-full p-0 text-red-500 hover:text-red-600"
                      title="Delete Pipeline"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {viewingPipeline && (
          <Dialog open={!!viewingPipeline} onOpenChange={() => setViewingPipeline(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{viewingPipeline.pipelineName} - Jobs</DialogTitle>
                <DialogDescription>
                  View all jobs in this pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {viewingPipeline.jobs.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No jobs in this pipeline</p>
                  </div>
                ) : (
                  viewingPipeline.jobs.map((job, index) => (
                    <Card key={job.id} className="shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{job.name}</h4>
                            <p className="text-xs text-muted-foreground">Status: {job.status || "Pending"}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewJob(job)}
                            className="w-8 h-8 rounded-full p-0"
                            title="View Job Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        {viewingJob && (
          <ViewJobDialog01
            job={viewingJob}
            open={!!viewingJob}
            onOpenChange={() => setViewingJob(null)}
          />
        )}
        {deleteConfirmOpen && pipelineToDelete && (
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete Pipeline</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the pipeline "{pipelineToDelete.pipelineName}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeletePipeline}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <PipelineBuilderDialog
          open={pipelineBuilderOpen}
          onOpenChange={setPipelineBuilderOpen}
          onSave={handleSavePipeline}
          initialJob={null}
          editingPipeline={editingPipeline}
          pipelines={pipelines}
        />
      </div>
    </div>
  );
}
