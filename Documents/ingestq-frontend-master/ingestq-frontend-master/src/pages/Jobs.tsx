import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Search, Play, Eye, Plus, Edit, CalendarIcon, X, BarChart3, Table } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import EnhancedEditJobDialog01 from "@/components/jobs/EnhancedEditJobDialog01"
import ViewJobDialog from "@/components/jobs/ViewJobDialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, startOfDay, startOfWeek, startOfMonth } from "date-fns"
import { cn } from "@/lib/utils"
import { getJobs, Job as ApiJob, getJobDetails, GetJobDetailsResponse, editJob, EditJobResponse, JobStepConfig, EditJobRequest, RunStepFunctionRequest } from "@/lib/api"
import { runStepFunction } from "@/lib/api"
import Dashboard from "./Dashboard"

// Define BASE_URL constant
const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com"

// Define JobStatusResponse interface
export interface JobStatusResponse {
  success: boolean
  message: string
  jobId: string
  Status: string
  LastRun: string
}

// Define JobStage interface
interface JobStage {
  id: string
  name: string
  type: string
  status: string
  description?: string
  config?: Record<string, any>
}

// Define LocalJob interface
interface LocalJob {
  id: string
  name: string
  category: string
  lastRun: string
  status: string
  createdAt: string
  stages: JobStage[]
  FolderName: string
  datadestination: string
  jobId: string
  triggerType: "SCHEDULE" | "File"
  etag: string
  email: string
  FileName: string
  scheduleDetails: object
  jobName: string
  user_id: string
  steps: JobStepConfig
  BucketName: string
  datasource: string
  description?: string
  isConnected?: boolean
  business_logic_rules?: Record<string, string>
  jobType?: string
  glueName?: string
  pipelines?: any[]
  duration?: string
}

const LOCAL_STORAGE_KEY = "app_data"

// Status filter options
const statusFilters = ["All", "Completed", "Running", "Failed"]

// Category filter options
const categoryFilterOptions = ["Glue", "ADF", "Lambda", "Airflow", "Batch"]

// getJobStatus function
export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const token = localStorage.getItem("authToken")
  const response = await fetch(`${BASE_URL}/get_status?job_id=${jobId}`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API Error (${response.status}) at ${new Date().toISOString()}: ${errorText}`)
    throw new Error(`Failed to fetch job status: ${response.status} - ${errorText}`)
  }

  const result: JobStatusResponse = await response.json()
  console.log("✅ Get Job Status Response:", result)
  return result
}

export default function Jobs() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [jobs, setJobs] = useState<LocalJob[]>([])
  const [tableSearchTerm, setTableSearchTerm] = useState("")
  const [editingJob, setEditingJob] = useState<LocalJob | null>(null)
  const [viewingJob, setViewingJob] = useState<LocalJob | null>(null)
  const [tableStartDate, setTableStartDate] = useState<Date | undefined>()
  const [tableEndDate, setTableEndDate] = useState<Date | undefined>()
  const [filteredJobs, setFilteredJobs] = useState<LocalJob[]>([])
  const [tableStatusFilter, setTableStatusFilter] = useState<string>("All")
  const [tableCategoryFilter, setTableCategoryFilter] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [chartSearchTerm, setChartSearchTerm] = useState("")
  const [chartStartDate, setChartStartDate] = useState<Date | undefined>()
  const [chartEndDate, setChartEndDate] = useState<Date | undefined>()
  const [chartStatusFilter, setChartStatusFilter] = useState<string>("All")
  const [chartCategoryFilter, setChartCategoryFilter] = useState<string>("All")
  const [chartFilteredJobs, setChartFilteredJobs] = useState<LocalJob[]>([])
  const [hasChartFilters, setHasChartFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart")
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("")

  const uniqueCategories = ["All", ...new Set(jobs.map(job => job.category))]

  // Validate localStorage
  const validateLocalStorage = (strictValidation: boolean = false) => {
    const isFreshLogin = localStorage.getItem("freshLogin") === "true"
    const isReturningFromUpload = localStorage.getItem("returningFromUpload") === "true"
    const isCreatingNewJob = localStorage.getItem("creatingNewJob") === "true"

    if (isFreshLogin) {
      localStorage.removeItem("freshLogin")
    }
    if (isReturningFromUpload) {
      localStorage.removeItem("returningFromUpload")
    }
    if (isCreatingNewJob) {
      localStorage.removeItem("creatingNewJob")
    }

    if (isFreshLogin || isReturningFromUpload || isCreatingNewJob) {
      return true
    }

    if (strictValidation) {
      const bucket = localStorage.getItem("selectedBucket")
      const key = localStorage.getItem("selectedFile")
      if (!bucket || !key) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Missing bucket name or key. Please upload the file again.",
        })
        navigate("/dashboard/upload")
        return false
      }
      return { bucket, key }
    }

    return true
  }

  // Fetch jobs from API
  useEffect(() => {
    if (!validateLocalStorage()) return

    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const response = await getJobs()
        if (response.success) {
          const mappedJobs: LocalJob[] = response.jobs.map((job: ApiJob) => ({
            id: job.jobId,
            name: job.jobName,
            category: "Glue",
            lastRun: job.LastRun || new Date().toISOString(),
            status: job.Status === "COMPLETED" ? "Completed" :
              job.Status === "RUNNING" ? "Running" :
                job.Status === "FAILED" ? "Failed" :
                  job.Status === "CREATED" ? "Created" : job.Status,
            createdAt: job.createdAt || new Date().toISOString(),
            stages: job.steps ? Object.entries(job.steps).map(([type, status], index) => ({
              id: `stage_${job.jobId}_${index}`,
              name: type === 'rules' ? 'DQ Rules' :
                type === 'ner' ? 'NER' :
                  type === 'businessLogic' ? 'Business Logic' :
                    type === 'datatransformations' ? 'Data Transformations' :
                      type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              type,
              status: typeof status === 'string' ? (status === 'executed' || status === 'skipped' ? status : 'pending') : 'pending',
              description: type === 'upload_center' ? 'Manage data extraction and destination' :
                type === 'loading' ? 'Analyze schema of the data' :
                  type === 'transfer' ? 'Schedule automated job runs' :
                    type === 'rules' ? 'Validate data quality and consistency' :
                      type === 'ner' ? 'Named Entity Recognition processing' :
                        type === 'businessLogic' ? 'Apply business logic to collected data' :
                          type === 'datatransformations' ? 'Extract, Transform, Load processes' :
                            `Step ${type}`,
            })) : [
              { id: `stage_${job.jobId}_upload`, name: 'Data Upload Center', type: 'upload_center', status: 'pending', description: 'Manage data extraction and destination' },
              { id: `stage_${job.jobId}_loading`, name: 'Schema Analysis', type: 'loading', status: 'pending', description: 'Analyze schema of the data' },
              { id: `stage_${job.jobId}_transfer`, name: 'Schedule Jobs', type: 'transfer', status: 'pending', description: 'Schedule automated job runs' },
            ],
            FolderName: job.FolderName,
            datadestination: job.datadestination,
            jobId: job.jobId,
            triggerType: job.triggerType,
            etag: job.etag,
            email: job.email,
            FileName: job.FileName,
            scheduleDetails: job.scheduleDetails,
            jobName: job.jobName,
            user_id: job.user_id,
            steps: job.steps || {
              rules: 'skipped',
              ner: 'skipped',
              businessLogic: 'skipped',
              datatransformations: 'skipped',
            },
            BucketName: job.BucketName,
            datasource: job.datasource,
            description: job.description || "No description available",
            isConnected: job.isConnected || false,
            business_logic_rules: job.business_logic_rules || {},
            jobType: job.jobType,
            glueName: job.glueName,
          }))
          setJobs(mappedJobs)
          setChartFilteredJobs(mappedJobs)
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ jobs: mappedJobs }))
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch jobs from API. Loading from local storage.",
          variant: "destructive",
        })
        const storedData = localStorage.getItem("LOCAL_STORAGE_KEY")
        if (storedData) {
          const { jobs: storedJobs } = JSON.parse(storedData)
          setJobs(storedJobs || [])
          setChartFilteredJobs(storedJobs || [])
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Filter jobs for table view
  useEffect(() => {
    filterJobs()
  }, [jobs, tableSearchTerm, tableStartDate, tableEndDate, tableStatusFilter, tableCategoryFilter])

  // Filter jobs for chart view
  useEffect(() => {
    let filtered = jobs.filter((job) => job.name.toLowerCase().includes(chartSearchTerm.toLowerCase()))

    if (chartStartDate) {
      filtered = filtered.filter((job) => new Date(job.lastRun) >= chartStartDate)
    }
    if (chartEndDate) {
      filtered = filtered.filter((job) => new Date(job.lastRun) <= chartEndDate)
    }
    if (chartStatusFilter !== "All") {
      filtered = filtered.filter((job) => job.status === chartStatusFilter)
    }
    if (chartCategoryFilter !== "All") {
      filtered = filtered.filter((job) => chartCategoryFilter === "Glue" ? job.category === "Glue" : false)
    }

    setChartFilteredJobs(filtered)
    setHasChartFilters(chartStatusFilter !== "All" || chartCategoryFilter !== "All")
  }, [jobs, chartSearchTerm, chartStartDate, chartEndDate, chartStatusFilter, chartCategoryFilter])

  const filterJobs = () => {
    let filtered = jobs.filter((job) => job.name.toLowerCase().includes(tableSearchTerm.toLowerCase()))

    if (tableStartDate) {
      filtered = filtered.filter((job) => {
        const lastRunDate = new Date(job.lastRun)
        return !isNaN(lastRunDate.getTime()) && lastRunDate >= tableStartDate
      })
    }
    if (tableEndDate) {
      filtered = filtered.filter((job) => {
        const lastRunDate = new Date(job.lastRun)
        return !isNaN(lastRunDate.getTime()) && lastRunDate <= tableEndDate
      })
    }

    if (tableStatusFilter !== "All") {
      filtered = filtered.filter((job) => job.status === tableStatusFilter)
    }

    if (tableCategoryFilter && tableCategoryFilter !== "All") {
      filtered = filtered.filter((job) => job.category === tableCategoryFilter)
    }

    setFilteredJobs(filtered)
  }

  const clearTableDateFilter = () => {
    setTableStartDate(undefined)
    setTableEndDate(undefined)
  }

  const clearChartDateFilter = () => {
    setChartStartDate(undefined)
    setChartEndDate(undefined)
  }

  const clearTableCategoryFilter = () => {
    setTableCategoryFilter("")
  }

  const getStatusColor = (status?: string) => {
    if (!status) {
      return 'bg-gray-100 text-gray-800'
    }
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'created':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getFilterHoverColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'hover:bg-green-500 hover:text-white'
      case 'running':
        return 'hover:bg-blue-500 hover:text-white'
      case 'failed':
        return 'hover:bg-red-500 hover:text-white'
      case 'created':
        return 'hover:bg-yellow-500 hover:text-white'
      default:
        return 'hover:bg-gray-100 dark:hover:bg-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      return format(date, "MMM d, yyyy - h:mm a")
    } catch {
      return "Invalid Date"
    }
  }

  const pollJobStatus = async (jobId: string, isImmediate: boolean = false) => {
    try {
      const statusResponse = await getJobStatus(jobId)
      console.log(`Polling job ${jobId} (immediate: ${isImmediate}):`, statusResponse)

      if (statusResponse.success) {
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.jobId === jobId
              ? {
                ...j,
                status: statusResponse.Status === "COMPLETED" ? "Completed" :
                  statusResponse.Status === "RUNNING" ? "Running" :
                    statusResponse.Status === "FAILED" ? "Failed" :
                      statusResponse.Status === "CREATED" ? "Created" : statusResponse.Status,
                lastRun: statusResponse.LastRun,
              }
              : j
          )
        )

        if (statusResponse.Status === "COMPLETED") {
          toast({
            title: "Job Completed",
            description: `Job ${jobId} has completed successfully.`,
          })
        } else if (statusResponse.Status === "FAILED") {
          toast({
            variant: "destructive",
            title: "Job Failed",
            description: `Job ${jobId} has failed.`,
          })
        }

        if (statusResponse.Status === "RUNNING" && !isImmediate) {
          setTimeout(() => pollJobStatus(jobId), 5000)
        }
      } else {
        console.error(`Poll failed for job ${jobId}:`, statusResponse.message)
      }
    } catch (error: any) {
      console.error(`Error polling job status for ${jobId}:`, error)
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.jobId === jobId ? { ...j, status: "Failed" } : j
        )
      )
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch status for job ${jobId}.`,
      })
    }
  }

  const handleRunJob = async (job: LocalJob) => {
    if (!validateLocalStorage(false)) return

    if (job.status.toUpperCase() === "RUNNING") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Job is already running. Please wait for it to complete.",
      })
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Missing auth token. Please login again.",
        })
        return
      }

      setJobs((prevJobs) => {
        const updatedJobs = prevJobs.map((j) =>
          j.jobId === job.jobId ? { ...j, status: "Running" } : j
        )
        console.log(`Jobs state after setting Running for ${job.jobId}:`, updatedJobs)
        return updatedJobs
      })

      const payload: RunStepFunctionRequest = {
        job_id: job.jobId,
        token: token,
        ...(job.jobType && { jobType: job.jobType }),
        ...(job.glueName && { glueName: job.glueName }),
      }

      console.log("Payload sent to runStepFunction:", payload)
      const response = await runStepFunction(payload)
      console.log(`runStepFunction response for job ${job.jobId}:`, response)

      toast({
        title: "Job Started",
        description: "Job started successfully.",
      })

      pollJobStatus(job.jobId, true)
      pollJobStatus(job.jobId)
    } catch (error: any) {
      setJobs((prevJobs) => {
        const updatedJobs = prevJobs.map((j) =>
          j.jobId === job.jobId ? { ...j, status: "Failed" } : j
        )
        console.log(`Jobs state after error for ${job.jobId}:`, updatedJobs)
        return updatedJobs
      })
      toast({
        variant: "destructive",
        title: "Run Failed",
        description: error.message || "Failed to start job",
      })
    }
  }

  const handleViewJob = async (job: LocalJob) => {
    if (!validateLocalStorage()) return

    try {
      const response: GetJobDetailsResponse = await getJobDetails(job.jobId)
      if (response.success && response.job) {
        const detailedJob: LocalJob = {
          ...job,
          name: response.job.name || job.name,
          category: "Glue",
          lastRun: response.job.LastRun || job.lastRun,
          status: response.job.Status === "COMPLETED" ? "Completed" :
            response.job.Status === "RUNNING" ? "Running" :
              response.job.Status === "FAILED" ? "Failed" :
                response.job.Status === "CREATED" ? "Created" : response.job.Status,
          stages: response.job.steps ? Object.entries(response.job.steps).map(([type, status], index) => ({
            id: `stage_${job.jobId}_${index}`,
            name: type === 'rules' ? 'DQ Rules' :
              type === 'ner' ? 'NER' :
                type === 'businessLogic' ? 'Business Logic' :
                  type === 'datatransformations' ? 'Data Transformations' :
                    type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type,
            status: typeof status === 'string' ? (status === 'executed' || status === 'skipped' ? status : 'pending') : 'pending',
            description: type === 'upload_center' ? 'Manage data extraction and destination' :
              type === 'loading' ? 'Analyze schema of the data' :
                type === 'transfer' ? 'Schedule automated job runs' :
                  type === 'rules' ? 'Validate data quality and consistency' :
                    type === 'ner' ? 'Named Entity Recognition processing' :
                      type === 'businessLogic' ? 'Apply business logic to collected data' :
                        type === 'datatransformations' ? 'Extract, Transform, Load processes' :
                          `Step ${type}`,
          })) : [
            { id: `stage_${job.jobId}_upload`, name: 'Data Upload Center', type: 'upload_center', status: 'pending', description: 'Manage data extraction and destination' },
            { id: `stage_${job.jobId}_loading`, name: 'Schema Analysis', type: 'loading', status: 'pending', description: 'Analyze schema of the data' },
            { id: `stage_${job.jobId}_transfer`, name: 'Schedule Jobs', type: 'transfer', status: 'pending', description: 'Schedule automated job runs' },
          ],
          description: response.job.description || job.description || "No description available",
          isConnected: response.job.isConnected !== undefined ? response.job.isConnected : (job.isConnected || false),
          FileName: response.job.FileName || job.FileName,
          BucketName: response.job.BucketName || job.BucketName,
          steps: response.job.steps || job.steps,
          business_logic_rules: response.job.business_logic_rules || job.business_logic_rules || {},
          jobType: response.job.jobType || job.jobType,
          glueName: response.job.glueName || job.glueName,
        }
        setViewingJob(detailedJob)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to fetch job details.",
        })
        setViewingJob(job)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch job details.",
      })
      setViewingJob(job)
    }
  }

  const handleEditJob = async (job: LocalJob) => {
    if (!validateLocalStorage()) return
    try {
      const response = await getJobDetails(job.jobId)
      if (response.success && response.job) {
        const detailedJob: LocalJob = {
          ...job,
          stages: response.job.steps ? Object.entries(response.job.steps).map(([type, status], index) => ({
            id: `stage_${job.jobId}_${index}`,
            name: type === 'rules' ? 'DQ Rules' :
              type === 'ner' ? 'NER' :
                type === 'businessLogic' ? 'Business Logic' :
                  type === 'datatransformations' ? 'Data Transformations' :
                    type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            type,
            status: typeof status === 'string' ? (status === 'executed' || status === 'skipped' ? status : 'pending') : 'pending',
            description: type === 'upload_center' ? 'Manage data extraction and destination' :
              type === 'loading' ? 'Analyze schema of the data' :
                type === 'transfer' ? 'Schedule automated job runs' :
                  type === 'rules' ? 'Validate data quality and consistency' :
                    type === 'ner' ? 'Named Entity Recognition processing' :
                      type === 'businessLogic' ? 'Apply business logic to collected data' :
                        type === 'datatransformations' ? 'Extract, Transform, Load processes' :
                          `Step ${type}`,
          })) : [
            { id: `stage_${job.jobId}_upload`, name: 'Data Upload Center', type: 'upload_center', status: 'pending', description: 'Manage data extraction and destination' },
            { id: `stage_${job.jobId}_loading`, name: 'Schema Analysis', type: 'loading', status: 'pending', description: 'Analyze schema of the data' },
            { id: `stage_${job.jobId}_transfer`, name: 'Schedule Jobs', type: 'transfer', status: 'pending', description: 'Schedule automated job runs' },
          ],
          steps: response.job.steps || job.steps,
          business_logic_rules: response.job.business_logic_rules || job.business_logic_rules || {},
          jobType: response.job.jobType || job.jobType,
          glueName: response.job.glueName || job.glueName,
        }
        setEditingJob(detailedJob)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to fetch job details.",
        })
        setEditingJob(job)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch job details.",
      })
      setEditingJob(job)
    }
  }

  const handleCreateJob = () => {
    localStorage.setItem("creatingNewJob", "true")
    navigate("/dashboard/upload")
  }

  const handleViewResults = () => {
    setTableSearchTerm(chartSearchTerm)
    setTableStartDate(chartStartDate)
    setTableEndDate(chartEndDate)
    setTableStatusFilter(chartStatusFilter)
    setTableCategoryFilter(chartCategoryFilter)
    setViewMode("table")
    toast({ title: "Switching to Table View", description: "Showing detailed job results with applied filters" })
  }

  const handleDateRangeFilter = (range: string) => {
    const now = new Date()
    switch (range) {
      case "today":
        setChartStartDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()))
        setChartEndDate(now)
        break
      case "week":
        setChartStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))
        setChartEndDate(now)
        break
      case "month":
        setChartStartDate(new Date(now.getFullYear(), now.getMonth(), 1))
        setChartEndDate(now)
        break
      default:
        setChartStartDate(undefined)
        setChartEndDate(undefined)
    }
    setDateRangeFilter(range)
  }

  const handleSaveJobStages = async (jobId: string, stages: JobStage[]) => {
  if (!validateLocalStorage()) return;
  
  // Close the dialog
  setEditingJob(null);
  
  // Refresh the jobs list to get updated data
  try {
    const response = await getJobs();
    if (response.success) {
      const mappedJobs: LocalJob[] = response.jobs.map((job: ApiJob) => ({
        id: job.jobId,
        name: job.jobName,
        category: "Glue",
        lastRun: job.LastRun || new Date().toISOString(),
        status: job.Status === "COMPLETED" ? "Completed" :
          job.Status === "RUNNING" ? "Running" :
            job.Status === "FAILED" ? "Failed" :
              job.Status === "CREATED" ? "Created" : job.Status,
        createdAt: job.createdAt || new Date().toISOString(),
        stages: job.steps ? Object.entries(job.steps).map(([type, status], index) => ({
          id: `stage_${job.jobId}_${index}`,
          name: type === 'rules' ? 'DQ Rules' :
            type === 'ner' ? 'NER' :
              type === 'businessLogic' ? 'Business Logic' :
                type === 'datatransformations' ? 'Data Transformations' :
                  type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type,
          status: typeof status === 'string' ? (status === 'executed' || status === 'skipped' ? status : 'pending') : 'pending',
          description: type === 'upload_center' ? 'Manage data extraction and destination' :
            type === 'loading' ? 'Analyze schema of the data' :
              type === 'transfer' ? 'Schedule automated job runs' :
                type === 'rules' ? 'Validate data quality and consistency' :
                  type === 'ner' ? 'Named Entity Recognition processing' :
                    type === 'businessLogic' ? 'Apply business logic to collected data' :
                      type === 'datatransformations' ? 'Extract, Transform, Load processes' :
                        `Step ${type}`,
        })) : [
          { id: `stage_${job.jobId}_upload`, name: 'Data Upload Center', type: 'upload_center', status: 'pending', description: 'Manage data extraction and destination' },
          { id: `stage_${job.jobId}_loading`, name: 'Schema Analysis', type: 'loading', status: 'pending', description: 'Analyze schema of the data' },
          { id: `stage_${job.jobId}_transfer`, name: 'Schedule Jobs', type: 'transfer', status: 'pending', description: 'Schedule automated job runs' },
        ],
        FolderName: job.FolderName,
        datadestination: job.datadestination,
        jobId: job.jobId,
        triggerType: job.triggerType,
        etag: job.etag,
        email: job.email,
        FileName: job.FileName,
        scheduleDetails: job.scheduleDetails,
        jobName: job.jobName,
        user_id: job.user_id,
        steps: job.steps || {
          rules: 'skipped',
          ner: 'skipped',
          businessLogic: 'skipped',
          datatransformations: 'skipped',
        },
        BucketName: job.BucketName,
        datasource: job.datasource,
        description: job.description || "No description available",
        isConnected: job.isConnected || false,
        business_logic_rules: job.business_logic_rules || {},
        jobType: job.jobType,
        glueName: job.glueName,
      }));
      setJobs(mappedJobs);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ jobs: mappedJobs }));
      
      toast({
        title: "Success",
        description: "Job list refreshed with latest data",
      });
    }
  } catch (error: any) {
    console.error("Error refreshing jobs:", error);
    toast({
      variant: "destructive",
      title: "Warning",
      description: "Job updated but failed to refresh list. Please reload the page.",
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6">
        <div className="mb-6 mt-14 flex items-start justify-between">
          <div>
            {viewMode === "table" ? (
              <>
                <h1 className="text-2xl font-bold text-foreground">
                  All Jobs ({filteredJobs.length})
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  View and manage your jobs
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-foreground">Your Jobs at a Glance</h2>
                <p className="text-muted-foreground text-sm mt-1">Track jobs by status, category, and time with ease.</p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode(viewMode === "chart" ? "table" : "chart")}
              variant="outline"
              className="flex items-center gap-2"
            >
              {viewMode === "chart" ? (
                <>
                  <Table className="h-4 w-4" /> Table View
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" /> Chart View
                </>
              )}
            </Button>

            {viewMode === "table" && (
              <Button
                onClick={handleCreateJob}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" /> Create Job
              </Button>
            )}
          </div>

        </div>

        {viewMode === "chart" ? (
          <Dashboard
            jobs={chartFilteredJobs}
            allJobs={jobs}
            onViewResults={handleViewResults}
            showViewResults={hasChartFilters}
            currentView={viewMode}
            onStatusFilter={setChartStatusFilter}
            selectedStatus={chartStatusFilter}
            onCategoryFilter={setChartCategoryFilter}
            selectedCategory={chartCategoryFilter}
            onDateRangeFilter={handleDateRangeFilter}
            selectedDateRange={dateRangeFilter}
          />
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                      className="pl-9 bg-background dark:bg-gray-800"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-10 justify-start text-left font-normal bg-background w-48 dark:bg-gray-800 dark:border-gray-600",
                            !tableStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tableStartDate ? format(tableStartDate, "MMM dd, yyyy") : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background dark:bg-gray-800 dark:border-gray-600">
                        <Calendar
                          mode="single"
                          selected={tableStartDate}
                          onSelect={setTableStartDate}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-10 justify-start text-left font-normal bg-background w-48 dark:bg-gray-800 dark:border-gray-600",
                            !tableEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tableEndDate ? format(tableEndDate, "MMM dd, yyyy") : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background dark:bg-gray-800 dark:border-gray-600">
                        <Calendar
                          mode="single"
                          selected={tableEndDate}
                          onSelect={setTableEndDate}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="flex items-center gap-2">
                      <Select
                        value={tableCategoryFilter}
                        onValueChange={(value) => setTableCategoryFilter(value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryFilterOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearTableCategoryFilter}
                        className="h-10 px-3"
                      >
                        Clear
                      </Button>
                    </div>

                    {(tableStartDate || tableEndDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearTableDateFilter}
                        className="h-10 px-3"
                        title="Clear date filter"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {statusFilters.map(status => (
                      <Button
                        key={status}
                        variant={tableStatusFilter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTableStatusFilter(status)}
                        className={cn(
                          "text-sm rounded-full",
                          tableStatusFilter === status
                            ? status === "Completed"
                              ? "bg-green-500 text-white"
                              : status === "Running"
                                ? "bg-blue-500 text-white"
                                : status === "Failed"
                                  ? "bg-red-500 text-white"
                                  : "bg-primary text-white"
                            : `text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 ${getFilterHoverColor(status)}`
                        )}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-muted/20 border-b text-sm font-medium text-muted-foreground">
                <div>Job Name</div>
                <div>Category</div>
                <div>Created At</div>
                <div>Last Run</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              <div className="divide-y">
                {isLoading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Loading jobs...
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No jobs found.
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job.jobId}
                      className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium text-foreground">{job.name}</div>
                      <div className="text-muted-foreground text-sm">{job.category}</div>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(job.createdAt)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {formatDate(job.lastRun)}
                      </div>
                      <div>
                        <Badge
                          className={cn("text-xs px-2 py-1", getStatusColor(job.status))}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRunJob(job)}
                          className="w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                          title="Run Job"
                          disabled={job.status === "Running"}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewJob(job)}
                          className="w-8 h-8 rounded-full p-0"
                          title="View job"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditJob(job)}
                          className="w-8 h-8 rounded-full p-0"
                          title="Edit Job Stages"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {viewingJob && (
          <ViewJobDialog
            job={viewingJob}
            open={!!viewingJob}
            onOpenChange={(open) => {
              if (!open) setViewingJob(null)
            }}
          />
        )}

        {editingJob && (
          <EnhancedEditJobDialog01
            job={editingJob}
            open={!!editingJob}
            onOpenChange={(open) => {
              if (!open) setEditingJob(null)
            }}
            onSave={handleSaveJobStages}
          />
        )}
      </div>
    </div>
  )
}

