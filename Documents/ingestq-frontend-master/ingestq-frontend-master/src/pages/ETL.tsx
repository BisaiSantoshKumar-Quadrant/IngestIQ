import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Calendar, 
  Play, 
  ArrowLeft, 
  RefreshCw, 
  Settings,
  Cloud,
  HardDrive,
  Folder,
  File,
  ChevronRight,
  X,
  Upload,
  SkipForward,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getBuckets, getObjects, uploadFile } from "@/lib/api";

// ================== ETL API ==================

export interface ETLRequest {
  payload: {
    file_paths: {
      [filePath: string]: {
        output_path: string;
      };
    };
    gname?: string;
  };
}

export interface ETLResponse {
  statusCode: number;
  body: {
    statusCode: number;
    body: string; // e.g. "{\"etl_method\": \"Glue\", \"s3_output\": \"s3://bucket/parquet/file.parquet\"}"
  };
}

export interface CheckJobResponse {
  status_code: number;
  success: boolean;
}

const getAuthToken = () => {
  const token = localStorage.getItem("authToken") || "";
  console.log("Auth Token exists:", !!token);
  return token;
};

const getBaseUrl = () => {
  // Use the hardcoded URL that was working in your first code
  const baseUrl = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com";
  console.log("Base URL:", baseUrl);
  return baseUrl;
};

export const runETL = async (data: ETLRequest): Promise<ETLResponse> => {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/invoke-etl`;
  
  console.log("API Request URL:", url);
  console.log("API Request Data:", JSON.stringify(data, null, 2));
  console.log("Authorization Header:", `Bearer ${token.substring(0, 20)}...`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers));

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      console.error("Received HTML instead of JSON:", htmlText.substring(0, 200));
      throw new Error(`Server returned HTML page instead of JSON. Status: ${response.status}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Failed to invoke ETL: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);
    
    if (result.body && result.body.body) {
      try {
        const bodyData = JSON.parse(result.body.body);
        console.log("S3 Output Path:", bodyData.s3_output || "Not specified");
      } catch (parseError) {
        console.warn("Could not parse body.body as JSON:", result.body.body);
      }
    }
    
    return result;
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    // Add more detailed error information
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error("Network error: Unable to connect to the server. Please check your internet connection and server status.");
    }
    throw error;
  }
};

export const checkJobGName = async (jobName: string): Promise<CheckJobResponse> => {
  const token = getAuthToken();
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/check-job-gname?gname=${encodeURIComponent(jobName)}`;
  
  console.log("Check Job URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Check Job Response Status:", response.status);

    // Check if response is HTML (error page)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      console.error("Received HTML instead of JSON:", htmlText.substring(0, 200));
      throw new Error(`Server returned HTML page instead of JSON. Status: ${response.status}`);
    }

    const result: CheckJobResponse = await response.json();
    console.log("✅ Check Job GName Response - Status:", response.status, "Data:", result);
    return { ...result, status_code: response.status };
  } catch (error: any) {
    console.error("Check Job Error:", error.message);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error("Network error: Unable to connect to the server for job name validation.");
    }
    throw error;
  }
};

interface DataSource {
  id: string;
  name: string;
  type: "S3 Bucket" | "Local File" | "Azure Blob";
  status: "Connected" | "Error" | "Pending";
  bucketName?: string;
  fileName?: string;
  inputPath?: string;
  outputPath?: string;
  localFile?: File;
  s3Path?: string; // Add this for uploaded local files
}

interface Transformation {
  id: string;
  name: string;
  status: "Completed" | "Running" | "Pending" | "Failed";
  progress: number;
}

interface Bucket {
  name: string;
}

interface Object {
  key: string;
  isFolder?: boolean;
}

const initialTransformations: Transformation[] = [
  { id: "tf-1", name: "Data Cleaning", status: "Pending", progress: 0 },
  { id: "tf-2", name: "Data Standardization", status: "Pending", progress: 0 },
];

// Helper function to extract bucket name from S3 path
const getBucketFromS3Path = (s3Path: string): string => {
  const match = s3Path.match(/s3:\/\/([^\/]+)/);
  return match ? match[1] : "";
};

// Helper function to get file name without extension
const getFileNameWithoutExtension = (fileName: string): string => {
  return fileName.replace(/\.[^/.]+$/, "");
};

export default function ETL() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>(initialTransformations);
  const [isJobRunning, setIsJobRunning] = useState(false);
  const [jobName, setJobName] = useState<string>("");
  const [isUploadToggleOn, setIsUploadToggleOn] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showS3Browser, setShowS3Browser] = useState<boolean>(false);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load only the most recent file from Upload step
  useEffect(() => {
    const loadRecentFile = () => {
      const selectedBucket = localStorage.getItem("selectedBucket");
      const selectedFile = localStorage.getItem("selectedFile");

      if (selectedBucket && selectedFile) {
        const newDataSources: DataSource[] = [];
        
        if (selectedBucket !== "local") {
          // Handle S3 file
          const inputPath = `s3://${selectedBucket}/${selectedFile}`;
          const outputPath = `s3://${selectedBucket}/parquet/${getFileNameWithoutExtension(selectedFile.split('/').pop() || selectedFile)}.parquet`;
          
          const newDataSource: DataSource = {
            id: `s3-${Date.now()}`,
            name: `S3 Data - ${selectedFile.split('/').pop()}`,
            type: "S3 Bucket",
            status: "Connected",
            bucketName: selectedBucket,
            fileName: selectedFile,
            inputPath: inputPath,
            outputPath: outputPath,
          };
          newDataSources.push(newDataSource);

          // Initialize selectedFiles in localStorage as an array if not already set
          const existingFiles = JSON.parse(localStorage.getItem("selectedFiles") || "[]");
          if (!existingFiles.some((file: any) => file.inputPath === inputPath)) {
            existingFiles.push({
              bucket: selectedBucket,
              key: selectedFile,
              inputPath: inputPath,
              outputPath: outputPath
            });
            localStorage.setItem("selectedFiles", JSON.stringify(existingFiles));
          }
        } else {
          // Handle local file - get the bucket from existing sources for consistent output path
          const existingBucket = getBucketFromExistingSources();
          const inputPath = `local://${selectedFile}`;
          const outputPath = existingBucket 
            ? `s3://${existingBucket}/parquet/${getFileNameWithoutExtension(selectedFile)}.parquet`
            : `processed/${getFileNameWithoutExtension(selectedFile)}.parquet`;
          
          const newDataSource: DataSource = {
            id: `local-${Date.now()}`,
            name: `Local File - ${selectedFile}`,
            type: "Local File",
            status: "Connected",
            fileName: selectedFile,
            inputPath: inputPath,
            outputPath: outputPath,
          };
          newDataSources.push(newDataSource);

          // Initialize selectedLocalFiles in localStorage as an array if not already set
          const existingLocalFiles = JSON.parse(localStorage.getItem("selectedLocalFiles") || "[]");
          if (!existingLocalFiles.some((file: any) => file.inputPath === inputPath)) {
            existingLocalFiles.push({
              name: selectedFile,
              inputPath: inputPath,
              outputPath: outputPath
            });
            localStorage.setItem("selectedLocalFiles", JSON.stringify(existingLocalFiles));
          }
        }

        setDataSources(newDataSources);
        if (newDataSources.length > 0) {
          toast({
            title: "File Loaded",
            description: `Loaded recent file: ${selectedFile}`,
          });
        }
      }
    };

    loadRecentFile();
  }, []);

  // Helper function to get bucket name from existing sources or selected files
  const getBucketFromExistingSources = (): string => {
    // First check existing data sources
    const s3Source = dataSources.find(source => source.type === "S3 Bucket" && source.bucketName);
    if (s3Source?.bucketName) {
      return s3Source.bucketName;
    }

    // Then check localStorage for selected files
    const selectedFiles = JSON.parse(localStorage.getItem("selectedFiles") || "[]");
    if (selectedFiles.length > 0 && selectedFiles[0].bucket) {
      return selectedFiles[0].bucket;
    }

    // Check if there's a selected bucket in localStorage
    const selectedBucket = localStorage.getItem("selectedBucket");
    if (selectedBucket && selectedBucket !== "local") {
      return selectedBucket;
    }

    return "";
  };

  const handleSelectSourceType = (type: "s3" | "local") => {
    if (type === "s3") {
      handleOpenS3Browser();
    } else if (type === "local") {
      handleSelectLocalFile();
    }
  };

  const handleSelectLocalFile = () => {
    toast({
      title: "File Selection",
      description: "Please select only .py files",
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.py')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select only .py files",
      });
      return;
    }

    setSelectedFile(file);
    toast({
      title: "File Selected Successfully",
      description: `${file.name} has been selected and is ready to upload`,
    });
  };

  const handleOpenS3Browser = async () => {
    try {
      const bucketData = await getBuckets();
      if (Array.isArray(bucketData)) {
        const formattedBuckets = bucketData.map((name: string) => ({ name }));
        setBuckets(formattedBuckets);
      } else {
        setBuckets([]);
        toast({
          title: "Warning",
          description: "Unexpected bucket data format.",
          variant: "destructive",
        });
      }
      setShowS3Browser(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch S3 buckets",
      });
    }
  };

  const handleSelectBucket = async (bucketName: string) => {
    setSelectedBucket(bucketName);
    setCurrentPath("");
    try {
      const objectData = await getObjects(bucketName, "");
      setObjects(objectData || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch bucket contents: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      setObjects([]);
    }
    setSelectedItem(null);
  };

  const handleS3Navigation = async (item: string, isFolder: boolean) => {
    if (item === "..") {
      const parts = currentPath.split("/").filter((p) => p);
      if (parts.length === 0) {
        setSelectedBucket("");
        setCurrentPath("");
        setObjects([]);
        try {
          const bucketData = await getBuckets();
          if (Array.isArray(bucketData)) {
            const formattedBuckets = bucketData.map((name: string) => ({ name }));
            setBuckets(formattedBuckets);
          }
        } catch (error) {
          console.error("Error fetching buckets:", error);
        }
      } else {
        parts.pop();
        const newPath = parts.join("/") + (parts.length > 0 ? "/" : "");
        setCurrentPath(newPath);
        try {
          const objectData = await getObjects(selectedBucket, newPath);
          setObjects(objectData || []);
        } catch (error) {
          console.error("Error navigating back:", error);
        }
      }
    } else if (isFolder) {
      const newPath = (currentPath || "") + item + "/";
      setCurrentPath(newPath);
      try {
        const objectData = await getObjects(selectedBucket, newPath);
        setObjects(objectData || []);
      } catch (error) {
        console.error("Error navigating into folder:", error);
      }
    } else {
      const fileKey = (currentPath || "") + item;
      const outputPath = `s3://${selectedBucket}/parquet/${getFileNameWithoutExtension(fileKey.split('/').pop() || fileKey)}.parquet`;
      
      const existingSource = dataSources.find(
        source => source.inputPath === `s3://${selectedBucket}/${fileKey}`
      );
      
      if (existingSource) {
        toast({
          title: "File Already Selected",
          description: `${selectedBucket}/${fileKey} is already in your sources`,
          variant: "destructive",
        });
        return;
      }

      const newId = `s3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newDataSource: DataSource = {
        id: newId,
        name: `S3 Data - ${fileKey.split('/').pop()}`,
        type: "S3 Bucket",
        status: "Connected",
        bucketName: selectedBucket,
        fileName: fileKey,
        inputPath: `s3://${selectedBucket}/${fileKey}`,
        outputPath: outputPath,
      };

      setDataSources(prev => [...prev, newDataSource]);
      
      const existingFiles = JSON.parse(localStorage.getItem("selectedFiles") || "[]");
      const newFileInfo = {
        bucket: selectedBucket,
        key: fileKey,
        inputPath: `s3://${selectedBucket}/${fileKey}`,
        outputPath: outputPath
      };
      
      const updatedFiles = [...existingFiles, newFileInfo];
      localStorage.setItem("selectedFiles", JSON.stringify(updatedFiles));
      
      setShowS3Browser(false);
      toast({
        title: "S3 File Added",
        description: `Added: ${selectedBucket}/${fileKey}`,
      });
    }
    setSelectedItem(null);
  };

  const handleSelectS3File = () => {
    if (!selectedItem || !selectedBucket) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file from S3",
      });
      return;
    }
    const item = selectedItem;
    const fileKey = (currentPath || "") + item;
    const outputPath = `s3://${selectedBucket}/parquet/${getFileNameWithoutExtension(fileKey.split('/').pop() || fileKey)}.parquet`;
    
    const existingSource = dataSources.find(
      source => source.inputPath === `s3://${selectedBucket}/${fileKey}`
    );
    
    if (existingSource) {
      toast({
        title: "File Already Selected",
        description: `${selectedBucket}/${fileKey} is already in your sources`,
        variant: "destructive",
      });
      return;
    }

    const newId = `s3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newDataSource: DataSource = {
      id: newId,
      name: `S3 Data - ${fileKey.split('/').pop()}`,
      type: "S3 Bucket",
      status: "Connected",
      bucketName: selectedBucket,
      fileName: fileKey,
      inputPath: `s3://${selectedBucket}/${fileKey}`,
      outputPath: outputPath,
    };

    setDataSources(prev => [...prev, newDataSource]);
    
    const existingFiles = JSON.parse(localStorage.getItem("selectedFiles") || "[]");
    const newFileInfo = {
      bucket: selectedBucket,
      key: fileKey,
      inputPath: `s3://${selectedBucket}/${fileKey}`,
      outputPath: outputPath
    };
    
    const updatedFiles = [...existingFiles, newFileInfo];
    localStorage.setItem("selectedFiles", JSON.stringify(updatedFiles));
    
    setShowS3Browser(false);
    setSelectedItem(null);
    toast({
      title: "S3 File Added",
      description: `Added: ${selectedBucket}/${fileKey}`,
    });
  };

  const handleRemoveDataSource = (sourceId: string) => {
    const sourceToRemove = dataSources.find(source => source.id === sourceId);
    
    if (sourceToRemove) {
      setDataSources(prev => prev.filter(source => source.id !== sourceId));
      
      if (sourceToRemove.type === "S3 Bucket") {
        const existingFiles = JSON.parse(localStorage.getItem("selectedFiles") || "[]");
        const updatedFiles = existingFiles.filter((file: any) => 
          file.inputPath !== sourceToRemove.inputPath
        );
        localStorage.setItem("selectedFiles", JSON.stringify(updatedFiles));
      }
      
      if (sourceToRemove.type === "Local File") {
        const existingLocalFiles = JSON.parse(localStorage.getItem("selectedLocalFiles") || "[]");
        const updatedLocalFiles = existingLocalFiles.filter((file: any) => 
          file.inputPath !== sourceToRemove.inputPath
        );
        localStorage.setItem("selectedLocalFiles", JSON.stringify(updatedLocalFiles));
      }
      
      toast({
        title: "Data Source Removed",
        description: `Removed: ${sourceToRemove.name}`,
      });
    }
  };

  const handleUploadLocalFile = async () => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file first",
      });
      return;
    }

    // Get user ID from localStorage or token (you might need to adjust this based on your auth setup)
    const getUserId = () => {
      // Try to get user ID from localStorage first
      const userId = localStorage.getItem("userId");
      if (userId) return userId;
      
      // If not found, try to extract from token (this depends on your token structure)
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // If your token is a JWT, decode it to get user ID
          const payload = JSON.parse(atob(token.split('.')[1]));
          return payload.user_id || payload.sub || payload.id;
        } catch (e) {
          console.warn("Could not extract user ID from token");
        }
      }
      
      // Fallback - you might want to handle this differently
      return "default-user";
    };

    setIsUploading(true);
    
    try {
      const userId = getUserId();
      console.log("Uploading file:", selectedFile.name, "for user:", userId);
      
      // Call the actual upload API
      const uploadResponse = await uploadFile(selectedFile, userId, "scripts");
      
      if (uploadResponse.success && uploadResponse.s3_path) {
        // Check if file already exists in data sources
        const existingSource = dataSources.find(
          source => source.fileName === selectedFile.name && source.type === "Local File"
        );
        
        if (existingSource) {
          toast({
            title: "File Already Uploaded",
            description: `${selectedFile.name} is already in your sources`,
            variant: "destructive",
          });
          setIsUploading(false);
          return;
        }

        // Get the target bucket for consistent output path
        const targetBucket = getBucketFromExistingSources();
        const bucketFromUpload = getBucketFromS3Path(uploadResponse.s3_path);
        
        // Use the bucket from upload response, but construct consistent output path
        const finalBucket = targetBucket || bucketFromUpload;
        const outputPath = `s3://${finalBucket}/parquet/${getFileNameWithoutExtension(selectedFile.name)}.parquet`;

        // Create new data source with S3 path from upload
        const newDataSource: DataSource = {
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: `Local File - ${selectedFile.name}`,
          type: "Local File",
          status: "Connected",
          fileName: selectedFile.name,
          inputPath: uploadResponse.s3_path, // Use the actual S3 path returned from upload
          outputPath: outputPath, // Consistent output path in parquet folder
          localFile: selectedFile,
          s3Path: uploadResponse.s3_path,
        };

        setDataSources(prev => [...prev, newDataSource]);
        
        // Store in localStorage
        const existingLocalFiles = JSON.parse(localStorage.getItem("selectedLocalFiles") || "[]");
        const newLocalFileInfo = {
          name: selectedFile.name,
          inputPath: uploadResponse.s3_path,
          outputPath: outputPath,
          s3_path: uploadResponse.s3_path
        };
        
        const updatedLocalFiles = [...existingLocalFiles, newLocalFileInfo];
        localStorage.setItem("selectedLocalFiles", JSON.stringify(updatedLocalFiles));
        
        toast({
          title: "Upload Successful",
          description: `${selectedFile.name} uploaded and will be processed to ${finalBucket}/parquet/`,
        });
        
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(uploadResponse.message || "Upload failed");
      }
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload the file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleScheduleJob = () => {
    if (jobName) {
      localStorage.setItem("jobName", jobName);
    }
    navigate("/dashboard/schedule-job");
    toast({
      title: "Proceeding to Job Scheduling",
      description: "Configure when your job should run",
    });
  };

  const handleGoBack = () => {
    navigate("/dashboard/business-logic");
  };

  const handleSkip = () => {
    localStorage.setItem('datatransformations', 'skipped');
    if (jobName) {
      localStorage.setItem("jobName", jobName);
    }
    navigate("/dashboard/schedule-job");
    toast({
      title: "NER Skipped",
      description: "Named Entity Resolution has been skipped",
    });
  };

  const handleRunJob = async () => {
    if (!jobName) {
      toast({
        title: "Error",
        description: "Please enter a job name before running the ETL job.",
        variant: "destructive",
      });
      return;
    }

    if (dataSources.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one data source before running the ETL job.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check job name uniqueness before proceeding
      console.log("Checking job name availability...");
      const checkJobResponse = await checkJobGName(jobName);
      if (checkJobResponse.status_code === 409) {
        toast({
          title: "Validation Error",
          description: "Same job name already exists. Please try a different name.",
          variant: "destructive",
        });
        return;
      } else if (!checkJobResponse.success) {
        toast({
          title: "Validation Error",
          description: "Job name is not available. Please try a different name.",
          variant: "destructive",
        });
        return;
      }

      console.log("Job name is available, starting ETL process...");
      setIsJobRunning(true);
      setTransformations((prev) =>
        prev.map((t) => ({ ...t, status: "Running" as const, progress: 0 }))
      );

      // Simulate progress for each step sequentially
      for (let i = 0; i < transformations.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTransformations((prev) =>
          prev.map((t, index) =>
            index === i
              ? { ...t, progress: 100, status: "Completed" as const }
              : t
          )
        );
      }

      // Process all data sources (both S3 and uploaded local files)
      const allSources = dataSources.filter(source => 
        source.type === "S3 Bucket" || (source.type === "Local File" && source.s3Path)
      );

      if (allSources.length > 0) {
        console.log("Processing data sources...");
        const file_paths: { [filePath: string]: { output_path: string } } = {};
        
        allSources.forEach(source => {
          let inputPath = source.inputPath;
          
          // Use S3 path for uploaded local files
          if (source.type === "Local File" && source.s3Path) {
            inputPath = source.s3Path;
          }
          
          if (inputPath && source.outputPath) {
            file_paths[inputPath] = { output_path: source.outputPath };
          }
        });

        const data: ETLRequest = { 
          payload: { 
            file_paths,
            gname: jobName 
          } 
        };
        
        console.log("Calling ETL API with file paths:", file_paths);
        const response = await runETL(data);
        const bodyData = JSON.parse(response.body.body);
        
        toast({
          title: "Success",
          description: `ETL job completed for ${Object.keys(file_paths).length} files. Output stored in parquet format.`,
        });
      }

      localStorage.setItem('datatransformations', 'executed');
      localStorage.setItem("jobName", jobName);
      setIsJobRunning(false);
      setTransformations((prev) =>
        prev.map((t) => ({ ...t, status: "Completed" as const }))
      );

    } catch (error: any) {
      console.error("ETL Job Error:", error);
      setIsJobRunning(false);
      setTransformations((prev) =>
        prev.map((t) => ({ ...t, status: "Failed" as const, progress: 0 }))
      );
      
      toast({
        title: "ETL Error",
        description: error.message || "An error occurred while running the ETL job.",
        variant: "destructive",
      });
    }
  };

  const Breadcrumbs = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-2">
        <span
          onClick={async () => {
            setSelectedBucket("");
            setCurrentPath("");
            setObjects([]);
            setSelectedItem(null);
            try {
              const bucketData = await getBuckets();
              if (Array.isArray(bucketData)) {
                const formattedBuckets = bucketData.map((name: string) => ({ name }));
                setBuckets(formattedBuckets);
              }
            } catch (error) {
              console.error("Error resetting to root:", error);
            }
          }}
          className="cursor-pointer hover:underline flex items-center"
        >
          <Folder className="w-4 h-4 mr-1" /> Root
        </span>
        {selectedBucket && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={async () => {
                setCurrentPath("");
                setSelectedItem(null);
                try {
                  const objectData = await getObjects(selectedBucket, "");
                  setObjects(objectData || []);
                } catch (error) {
                  console.error("Error navigating to bucket root:", error);
                }
              }}
              className="cursor-pointer hover:underline"
            >
              {selectedBucket}
            </span>
          </>
        )}
        {currentPath &&
          currentPath
            .split("/")
            .filter((p) => p)
            .map((part, idx, arr) => (
              <div key={idx} className="flex items-center">
                <ChevronRight className="w-4 h-4" />
                <span
                  onClick={async () => {
                    const newPath = arr.slice(0, idx + 1).join("/") + "/";
                    setCurrentPath(newPath);
                    setSelectedItem(null);
                    try {
                      const objectData = await getObjects(selectedBucket, newPath);
                      setObjects(objectData || []);
                    } catch (error) {
                      console.error("Error navigating to path:", error);
                    }
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {part}
                </span>
              </div>
            ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mt-14 mx-auto p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept=".py"
          onChange={handleFileChange}
          className="hidden"
        />

        <Dialog open={showS3Browser} onOpenChange={(open) => {
          setShowS3Browser(open);
          if (!open) {
            setSelectedBucket("");
            setCurrentPath("");
            setObjects([]);
            setSelectedItem(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Browse S3 Buckets</DialogTitle>
              <DialogDescription>Select a bucket and file for the data source.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Breadcrumbs />
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {!selectedBucket ? (
                  buckets.length > 0 ? (
                    buckets.map((bucket) => (
                      <div
                        key={bucket.name}
                        className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                          selectedItem === bucket.name ? "bg-primary/20 border-primary/50" : ""
                        }`}
                        onDoubleClick={() => handleSelectBucket(bucket.name)}
                        onClick={() => setSelectedItem(bucket.name)}
                      >
                        <Folder className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 font-medium">{bucket.name}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      No buckets available.
                    </div>
                  )
                ) : (
                  <>
                    <div
                      className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0"
                      onDoubleClick={() => handleS3Navigation("..", true)}
                    >
                      <Folder className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 font-medium">..</div>
                    </div>
                    {objects.length > 0 ? (
                      objects.map((obj) => {
                        const isFolder = obj.isFolder || obj.key.endsWith("/");
                        const displayName = obj.key.split("/").pop() || obj.key;
                        return (
                          <div
                            key={obj.key}
                            className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                              selectedItem === obj.key ? "bg-primary/20 border-primary/50" : ""
                            }`}
                            onDoubleClick={() => handleS3Navigation(obj.key, isFolder)}
                            onClick={() => setSelectedItem(obj.key)}
                          >
                            {isFolder ? (
                              <Folder className="w-4 h-4 text-blue-500" />
                            ) : (
                              <File className="w-4 h-4 text-gray-500" />
                            )}
                            <div className="flex-1 font-medium">{displayName}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No objects available.
                      </div>
                    )}
                  </>
                )}
              </div>
              {selectedBucket && selectedItem && !selectedItem.endsWith("/") && (
                <Button
                  onClick={handleSelectS3File}
                  className="w-fit flex items-center gap-2"
                >
                  Add {selectedItem.split("/").pop() || selectedItem}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between mb-6">
          <div className="text-start">
            <h1 className="text-3xl font-bold text-foreground">Data Transformations</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleScheduleJob} variant="secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Job
            </Button>
            <Button
              onClick={handleRunJob}
              disabled={isJobRunning || !jobName || dataSources.length === 0}
              className={cn(isJobRunning && "opacity-75")}
            >
              <Play className="w-4 h-4 mr-2" />
              {isJobRunning ? "Running..." : "Run Steps"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <div>
                    <CardTitle>Sources ({dataSources.length})</CardTitle>
                    <CardDescription>Connected sources for ingestion</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="upload-toggle">Upload File</Label>
                  <Switch
                    id="upload-toggle"
                    checked={isUploadToggleOn}
                    onCheckedChange={setIsUploadToggleOn}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isUploadToggleOn && (
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleSelectSourceType("s3")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Cloud className="w-4 h-4" />
                    Upload from S3
                  </Button>
                  <Button
                    onClick={() => handleSelectSourceType("local")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <HardDrive className="w-4 h-4" />
                    Upload from Local
                  </Button>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="jobName">Job Name</Label>
                <Input
                  id="jobName"
                  type="text"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter job name"
                />
              </div>
              
              {selectedFile && (
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full p-2 bg-primary/10">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Selected Python File</p>
                        <p className="text-xs text-muted-foreground">File: {selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                        Selected
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleUploadLocalFile}
                        disabled={isUploading}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {dataSources.map((source) => (
                  <div key={source.id} className="p-3 border rounded-lg bg-background">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full p-2 bg-muted">
                          <FileText className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{source.name}</p>
                          {source.type === "S3 Bucket" && (
                            <>
                              <p className="text-xs text-muted-foreground truncate">Bucket: {source.bucketName || "N/A"}</p>
                              <p className="text-xs text-muted-foreground truncate">File: {source.fileName || "N/A"}</p>
                              <p className="text-xs text-green-600 truncate">Output: {source.outputPath}</p>
                            </>
                          )}
                          {source.type === "Local File" && (
                            <>
                              <p className="text-xs text-muted-foreground truncate">File: {source.fileName || "N/A"}</p>
                              {source.s3Path && (
                                <p className="text-xs text-muted-foreground truncate">Uploaded to: {source.s3Path}</p>
                              )}
                              <p className="text-xs text-green-600 truncate">Output: {source.outputPath}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "text-white text-xs",
                            source.status === "Connected" && "bg-green-500 hover:bg-green-600",
                            source.status === "Error" && "bg-red-500 hover:bg-red-600",
                            source.status === "Pending" && "bg-yellow-500 hover:bg-yellow-600"
                          )}
                        >
                          {source.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            toast({
                              title: "Data Source Settings",
                              description: `Configure settings for ${source.name}`,
                            });
                          }}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveDataSource(source.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {dataSources.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sources added yet</p>
                    <p className="text-xs">Enable "Upload File" to add sources</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Data Transformations
              </CardTitle>
              <CardDescription>Data processing and transformation steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {transformations.map((transform) => (
                <div key={transform.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{transform.name}</p>
                    <Badge
                      className={cn(
                        "text-white",
                        transform.status === "Completed" && "bg-green-500 hover:bg-green-600",
                        transform.status === "Running" && "bg-blue-500 hover:bg-blue-600",
                        transform.status === "Pending" && "bg-yellow-500 hover:bg-yellow-600",
                        transform.status === "Failed" && "bg-red-500 hover:bg-red-600"
                      )}
                    >
                      {transform.status}
                    </Badge>
                  </div>
                  <Progress value={transform.progress} />
                </div>
              ))}
              {!isJobRunning &&
                transformations.every((t) => t.status === "Completed") && (
                  <p className="text-sm text-green-600 font-medium mt-2">
                    ETL Job Completed Successfully
                  </p>
                )}
              {!isJobRunning &&
                transformations.some((t) => t.status === "Failed") && (
                  <p className="text-sm text-red-600 font-medium mt-2">
                    ETL Job Failed
                  </p>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex items-center gap-2"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}