import { Job, JobStage } from '@/components/types/jobs'; // Adjust path as needed
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Database, Brain, Settings, BarChart3, PanelLeft, FileText, UserSearch, Code, Workflow, User, LogOut, Upload as UploadIcon, FileCheck, X, Plus, Minus, Cloud, HardDrive, Server, Folder, FolderOpen, Globe, Check, Briefcase, Zap, Package, Factory } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logoutUser, getResourceGroups, getADFJobs, getADFPipelines, getGlueJobs } from "@/lib/api"; 
import EnhancedEditJobDialog from "@/components/jobs/EnhancedEditJobDialog";

const navigation = [
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Pipelines", href: "/dashboard/pipelines", icon: Workflow },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
];

const jobCategories = [
  { id: 'glue', name: 'Glue Jobs', icon: Database },
  { id: 'lambda', name: 'Lambda Jobs', icon: Zap },
  { id: 'batch', name: 'Batch Jobs', icon: Package },
  { id: 'adf', name: 'ADF Jobs', icon: Factory },
  { id: 'airflow', name: 'Airflow Jobs', icon: HardDrive },
];

export function AuthenticatedLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedResourceGroup, setExpandedResourceGroup] = useState<string | null>(null);
  const [expandedADFJob, setExpandedADFJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [editJobDialogOpen, setEditJobDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const validateLocalStorage = () => {
    const bucket = localStorage.getItem('selectedBucket');
    const key = localStorage.getItem('selectedFile');
    if (!bucket || !key) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing bucket name or key. Please upload the file again.",
      });
      navigate('/dashboard/upload');
      return false;
    }
    return { bucket, key };
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const fetchJobs = async () => {
      try {
        // Fetch Glue Jobs
        const glueJobs = await getGlueJobs();
        const glueJobItems: Job[] = glueJobs.map((name: string, index: number) => ({
          id: `glue-${index}`,
          name,
          category: 'glue',
          lastRun: '2024-01-15 10:30:00', // Ensure lastRun is provided
          status: 'Completed', // Use "Completed" instead of "Passed"
          stages: [],
        }));

        // Fetch Resource Groups for ADF
        const resourceGroups = await getResourceGroups();
        const resourceGroupItems: Job[] = resourceGroups.map((name: string, index: number) => ({
          id: `rg-${index}`,
          name,
          category: 'adf',
          lastRun: 'N/A', // Provide default for resource groups
          status: 'Pending', // Provide default
          pipelineId: undefined,
          pipelineName: undefined,
          pipelines: undefined,
          stages: [],
        }));

        // Fetch ADF Jobs and Pipelines
        let adfJobItems: Job[] = [];
        let pipelineItems: Job[] = [];
        if (resourceGroups.length > 0) {
          const adfJobs = await getADFJobs(resourceGroups[0]);
          adfJobItems = adfJobs.map((name: string, index: number) => ({
            id: `adf-${index}`,
            name,
            category: 'adf',
            lastRun: '2024-01-15 12:00:00',
            status: 'Completed',
            pipelineId: undefined,
            pipelineName: undefined,
            pipelines: undefined,
            stages: [],
          }));

          if (adfJobs.length > 0) {
            const pipelines = await getADFPipelines(resourceGroups[0], adfJobs[0]);
            pipelineItems = pipelines.map((name: string, index: number) => ({
              id: `pipeline-${index}`,
              name,
              category: 'adf',
              lastRun: '2024-01-15 12:00:00',
              status: 'Running',
              pipelineId: undefined,
              pipelineName: undefined,
              pipelines: undefined,
              stages: [],
            }));
          }
        }

        // Mock data for other categories
        const mockJobs: Job[] = [
          {
            id: 'lambda-1',
            name: "Data Validation",
            category: 'lambda',
            lastRun: '2024-01-15 11:15:00',
            status: 'Completed', // Use "Completed" instead of "Passed"
            stages: [],
          },
          {
            id: 'batch-1',
            name: "Report Generation",
            category: 'batch',
            lastRun: '2024-01-15 08:20:00',
            status: 'Running',
            stages: [],
          },
          {
            id: 'airflow-1',
            name: "Medical Transcription",
            category: 'airflow',
            lastRun: '2024-01-13 12:00:00',
            status: 'Completed',
            stages: [],
          },
        ];

        setJobs([...glueJobItems, ...resourceGroupItems, ...adfJobItems, ...pipelineItems, ...mockJobs]);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch jobs",
        });
      }
    };

    fetchJobs();
  }, [toast, navigate]);


  // const handleLogout = async () => {
  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (token) {
  //       await logoutUser();
  //     }

  //     localStorage.removeItem("authenticated");
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("authToken");

  //     toast({
  //       title: "Logged out successfully",
  //       description: "See you next time!",
  //     });

  //     navigate("/");
  //   } catch (error: any) {
  //     toast({
  //       title: "Logout failed",
  //       description: error.message || "Something went wrong",
  //       variant: "destructive",
  //     });
  //   }
  // };

  
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      await logoutUser();
    }

    // Clear all relevant localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("freshLogin");
    localStorage.removeItem("selectedBucket");
    localStorage.removeItem("selectedFile");

    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });

    navigate("/");
  } catch (error: any) {
    toast({
      title: "Logout failed",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  }
};

  const handleJobClick = (job: Job) => {
    if (job.pipelineId) {
      setExpandedResourceGroup(prev => prev === job.id ? null : job.id);
      const fetchADFJobs = async () => {
        try {
          const adfJobs = await getADFJobs(job.name);
          const adfJobItems: Job[] = adfJobs.map((name: string, index: number) => ({
            id: `adf-${job.id}-${index}`,
            name,
            category: 'adf',
            lastRun: '2024-01-15 12:00:00',
            status: 'Completed',
            pipelineId: undefined,
            pipelineName: undefined,
            pipelines: undefined,
            stages: [],
          }));
          setJobs(prev => [...prev.filter(j => !j.pipelineId || j.pipelineId !== job.id), ...adfJobItems]);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to fetch ADF jobs",
          });
        }
      };
      fetchADFJobs();
    } else if (job.pipelineName) {
      setExpandedADFJob(prev => prev === job.id ? null : job.id);
      const fetchPipelines = async () => {
        try {
          const resourceGroup = jobs.find(j => j.pipelineId && expandedResourceGroup === j.id)?.name;
          if (!resourceGroup) return;
          const pipelines = await getADFPipelines(resourceGroup, job.name);
          const pipelineItems: Job[] = pipelines.map((name: string, index: number) => ({
            id: `pipeline-${job.id}-${index}`,
            name,
            category: 'adf',
            lastRun: '2024-01-15 12:00:00',
            status: 'Running',
            pipelineId: undefined,
            pipelineName: undefined,
            pipelines: undefined,
            stages: [],
          }));
          setJobs(prev => [...prev.filter(j => !j.pipelineName), ...pipelineItems]);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to fetch pipelines",
          });
        }
      };
      fetchPipelines();
    } else if (job.category === 'glue' || job.pipelineName) {
      localStorage.setItem("selectedJob", job.name);
      if (job.category === 'glue') {
        localStorage.setItem("jobType", "glue");
        localStorage.setItem("glueName", job.name);
      }
      setSelectedJob({
        ...job,
        stages: job.stages || [],
      });
      setEditJobDialogOpen(true);
      toast({
        title: "Job selected",
        description: `Editing stages for ${job.name}`,
      });
    } else {
      localStorage.setItem("selectedJob", job.name);
      navigate("/dashboard/reports");
      toast({
        title: "Job selected",
        description: `Now viewing details for ${job.name}`,
      });
    }
  };

  const handleSaveJobStages = (jobId: string, stages: JobStage[]) => {
    setJobs(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, stages } : job
      )
    );
    setEditJobDialogOpen(false);
    setSelectedJob(null);
    toast({
      title: "Stages Saved",
      description: `Updated stages for job ${selectedJob?.name}`,
    });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
    setExpandedResourceGroup(null);
    setExpandedADFJob(null);
  };

  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.category]) {
      acc[job.category] = [];
    }
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, Job[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <nav className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <NavLink to="/dashboard" className="flex items-center space-x-3 pl-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg relative">
                  <Brain className="w-5 h-5 text-primary-foreground absolute top-1 left-1" />
                  <Database className="w-5 h-5 text-primary-foreground absolute bottom-1 right-1" />
                </div>
                {/* <h1 className="text-xl font-bold text-foreground">IngestIQ</h1> */}
  <div className="flex flex-col leading-tight">
    <h1 className="text-xl font-bold text-foreground">IngestIQ</h1>
    {user?.full_name && (
  <span className="text-xs font-semibold text-gray-600">
    Welcome, <span className="text-primary">{user.full_name}</span>
  </span>
)}

  </div>       
              </NavLink>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "inline-flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border"
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
              <ThemeToggle />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-10 h-10">
                    <User className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-2 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate">{user?.username || "Demo User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || "demo@ingestiq.com"}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate("/dashboard/settings")}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start" 
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div 
          className={`fixed inset-y-0 left-0 z-40 bg-card border-r border-border transform transition-all duration-300 ease-in-out pt-16 ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-16 translate-x-0'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="h-full flex flex-col">
            {sidebarOpen ? (
              <>
                <div className="sticky top-16 bg-card z-10 border-b border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="bg-card border border-border shadow-sm h-10 w-10 flex-shrink-0"
                    >
                      <PanelLeft className="w-5 h-5" />
                    </Button>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Job Categories
                  </h2>
                </div>
                <div className="flex-1 overflow-y-auto pt-2">
                  <div className="p-2 space-y-2">
                    {jobCategories.map((category) => (
                      <div key={category.id}>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-3 h-auto"
                          onClick={() => toggleCategory(category.id)}
                        >
                          <div className="flex items-center">
                            <category.icon className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          {expandedCategory === category.id ? (
                            <Minus className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                        {expandedCategory === category.id && groupedJobs[category.id] && (
                          <div className="ml-4 mt-2 space-y-2">
                            {groupedJobs[category.id].filter(job => !job.pipelineId).map((job) => (
                              <div key={job.id}>
                                <Card 
                                  className="cursor-pointer hover:shadow-sm transition-shadow w-full"
                                  onClick={() => handleJobClick(job)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-foreground truncate">
                                          {job.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Status: {job.status}
                                        </p>
                                      </div>
                                      <div className={cn(
                                        "w-2 h-2 rounded-full ml-2",
                                        job.status === 'Completed' && "bg-green-500",
                                        job.status === 'Failed' && "bg-red-500",
                                        job.status === 'Running' && "bg-blue-500",
                                        job.status === 'Pending' && "bg-yellow-500"
                                      )} />
                                    </div>
                                  </CardContent>
                                </Card>
                                {job.pipelineId && expandedResourceGroup === job.id && (
                                  <div className="ml-4 mt-2 space-y-2">
                                    {groupedJobs[category.id].filter(j => j.pipelineId === job.id).map((adfJob) => (
                                      <div key={adfJob.id}>
                                        <Card 
                                          className="cursor-pointer hover:shadow-sm transition-shadow w-full"
                                          onClick={() => handleJobClick(adfJob)}
                                        >
                                          <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                              <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-foreground truncate">
                                                  {adfJob.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                  Status: {adfJob.status}
                                                </p>
                                              </div>
                                              <div className={cn(
                                                "w-2 h-2 rounded-full ml-2",
                                                adfJob.status === 'Completed' && "bg-green-500",
                                                adfJob.status === 'Failed' && "bg-red-500",
                                                adfJob.status === 'Running' && "bg-blue-500",
                                                adfJob.status === 'Pending' && "bg-yellow-500"
                                              )} />
                                            </div>
                                          </CardContent>
                                        </Card>
                                        {expandedADFJob === adfJob.id && (
                                          <div className="ml-4 mt-2 space-y-2">
                                            {groupedJobs[category.id].filter(j => j.pipelineName).map((pipeline) => (
                                              <Card 
                                                key={pipeline.id}
                                                className="cursor-pointer hover:shadow-sm transition-shadow w-full"
                                                onClick={() => handleJobClick(pipeline)}
                                              >
                                                <CardContent className="p-3">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-xs font-medium text-foreground truncate">
                                                        {pipeline.name}
                                                      </p>
                                                      <p className="text-xs text-muted-foreground">
                                                        Status: {pipeline.status}
                                                      </p>
                                                    </div>
                                                    <div className={cn(
                                                      "w-2 h-2 rounded-full ml-2",
                                                      pipeline.status === 'Completed' && "bg-green-500",
                                                      pipeline.status === 'Failed' && "bg-red-500",
                                                      pipeline.status === 'Running' && "bg-blue-500",
                                                      pipeline.status === 'Pending' && "bg-yellow-500"
                                                    )} />
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center pt-4">
                <div className="relative flex items-center justify-center h-10 w-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="bg-card border border-border shadow-sm h-10 w-10"
                  >
                    <PanelLeft className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          <Outlet />
          {selectedJob && (
            <EnhancedEditJobDialog
              job={selectedJob}
              open={editJobDialogOpen}
              onOpenChange={setEditJobDialogOpen}
              onSave={handleSaveJobStages}
            />
          )}
        </div>
      </div>
    </div>
  );
}