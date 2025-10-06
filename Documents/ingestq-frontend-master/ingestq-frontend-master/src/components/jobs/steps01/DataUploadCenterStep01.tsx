
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Database,
  Cloud,
  HardDrive,
  ArrowRight,
  CheckCircle,
  Upload as UploadIcon,
  Server,
  CloudRain,
  ArrowLeft,
  Loader2,
  Folder,
  File,
  X,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getBuckets, getObjects, getFile, getAzureContainers, getAzureBlobs, getAzureBlobFile } from "@/lib/api";

interface SourceConfig {
  connectionString?: string;
  databaseName?: string;
  username?: string;
  password?: string;
  port?: string;
  bucket?: string;
  currentPath?: string;
}

interface DestinationConfig {
  type: string;
  connectionString?: string;
  databaseName?: string;
  username?: string;
  password?: string;
  port?: string;
  bucket?: string;
  currentPath?: string;
}

interface Bucket {
  name: string;
}

interface Object {
  key: string;
  isFolder?: boolean;
}

export default function Upload() {
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [sourceConfig, setSourceConfig] = useState<SourceConfig>({});
  const [destinationConfig, setDestinationConfig] = useState<DestinationConfig>({ type: "" });
  const [isSourceConnected, setIsSourceConnected] = useState<boolean>(false);
  const [isSourceConnecting, setIsSourceConnecting] = useState<boolean>(false);
  const [isDestConnected, setIsDestConnected] = useState<boolean>(false);
  const [isDestConnecting, setIsDestConnecting] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedSourcePath, setSelectedSourcePath] = useState<string>("");
  const [selectedDestPath, setSelectedDestPath] = useState<string>("");
  const [showSourceBrowser, setShowSourceBrowser] = useState<boolean>(false);
  const [showDestBrowser, setShowDestBrowser] = useState<boolean>(false);
  const [showSourceDBBrowser, setShowSourceDBBrowser] = useState<boolean>(false);
  const [showDestDBBrowser, setShowDestDBBrowser] = useState<boolean>(false);
  const [sourceSelectedItem, setSourceSelectedItem] = useState<string | null>(null);
  const [destSelectedItem, setDestSelectedItem] = useState<string | null>(null);
  const [sourceDBSelectedTables, setSourceDBSelectedTables] = useState<string[]>([]);
  const [selectAllTables, setSelectAllTables] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const summaryRef = useRef<HTMLDivElement>(null);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [objects, setObjects] = useState<Object[]>([]);

  const dataSources = [
    { value: "local", label: "Local", icon: HardDrive },
    { value: "s3", label: "S3", icon: Cloud },
    { value: "azure-blob", label: "Azure Blob", icon: CloudRain },
    { value: "database", label: "Database", icon: Server },
  ];

  const destinations = [
    { value: "s3", label: "S3", icon: Cloud },
    { value: "azure-blob", label: "Azure Blob", icon: Database },
    { value: "database", label: "Database", icon: Server },
  ];

  useEffect(() => {
    if (selectedSourcePath) setIsSourceConnected(true);
  }, [selectedSourcePath]);

  useEffect(() => {
    if (selectedDestPath) setIsDestConnected(true);
  }, [selectedDestPath]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      const fileNames = acceptedFiles.map((file) => file.name).join(", ");
      setSelectedSourcePath(fileNames);
      setIsSourceConnected(true);
      localStorage.setItem("selectedBucket", "local");
      localStorage.setItem("selectedFile", acceptedFiles[0].name);
      toast({ title: "Files Uploaded", description: `${acceptedFiles.length} file(s) uploaded successfully` });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const scrollToSummary = () => {
    setTimeout(() => {
      if (summaryRef.current) {
        summaryRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
    }, 100);
  };

  const fetchBuckets = async (type: "source" | "destination") => {
    try {
      const data = selectedSource === "azure-blob" || selectedDestination === "azure-blob" ? await getAzureContainers() : await getBuckets();
      if (Array.isArray(data)) {
        const formattedBuckets = data.map((name: string) => ({ name }));
        setBuckets(formattedBuckets);
      } else {
        setBuckets([]);
        toast({
          title: "Warning",
          description: `Unexpected ${selectedSource === "azure-blob" ? "container" : "bucket"} data format.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch ${selectedSource === "azure-blob" ? "containers" : "buckets"}.`,
        variant: "destructive",
      });
      setBuckets([]);
    }
  };

  const fetchObjects = async (bucketName: string, prefix?: string) => {
    try {
      const data =
        selectedSource === "azure-blob" || selectedDestination === "azure-blob"
          ? await getAzureBlobs(bucketName, prefix)
          : await getObjects(bucketName, prefix);
      setObjects(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch ${selectedSource === "azure-blob" || selectedDestination === "azure-blob" ? "blobs" : "objects"}: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setObjects([]);
    }
  };

  const handleS3Navigation = (item: string, isFolder: boolean, type: "source" | "destination") => {
    const config = type === "source" ? sourceConfig : destinationConfig;
    const setConfig = type === "source" ? setSourceConfig : setDestinationConfig;
    const setSelectedPath = type === "source" ? setSelectedSourcePath : setSelectedDestPath;
    const setIsConnected = type === "source" ? setIsSourceConnected : setIsDestConnected;
    const setShowBrowser = type === "source" ? setShowSourceBrowser : setShowDestBrowser;
    const setSelectedItem = type === "source" ? setSourceSelectedItem : setDestSelectedItem;
    const prefix = type === "source" ? selectedSource : selectedDestination;

    if (item === "..") {
      const parts = (config.currentPath || "").split("/").filter((p) => p);
      if (parts.length === 0) {
        setConfig((prev) => ({ ...prev, bucket: undefined, currentPath: "" }));
        setObjects([]);
        setSelectedPath("");
        setIsConnected(false);
        if (type === "source") {
          localStorage.removeItem("selectedBucket");
          localStorage.removeItem("selectedFile");
        } else {
          localStorage.removeItem("selectedDestFolder");
          localStorage.removeItem("selectedDestBucket");
        }
      } else {
        parts.pop();
        const newPath = parts.join("/") + (parts.length > 0 ? "/" : "");
        setConfig((prev) => ({ ...prev, currentPath: newPath }));
        fetchObjects(config.bucket!, newPath);
        setSelectedPath("");
        setIsConnected(false);
        if (type === "source") {
          localStorage.removeItem("selectedFile");
        } else {
          localStorage.removeItem("selectedDestFolder");
        }
      }
    } else if (isFolder) {
      const newPath = (config.currentPath || "") + item;
      setConfig((prev) => ({ ...prev, currentPath: newPath }));
      fetchObjects(config.bucket!, newPath);
      setSelectedPath("");
      setIsConnected(false);
      if (type === "source") {
        localStorage.removeItem("selectedFile");
      } else {
        localStorage.removeItem("selectedDestFolder");
      }
    } else {
      const fileKey = (config.currentPath || "") + item;
      const fullPath = `${prefix}://${config.bucket}/${fileKey}`;
      setSelectedPath(fullPath);
      setIsConnected(true);
      if (type === "source") {
        localStorage.setItem("selectedBucket", config.bucket!);
        localStorage.setItem("selectedFile", fileKey);
      } else {
        localStorage.setItem("selectedDestFolder", fileKey);
      }
      setShowBrowser(false);
      toast({ title: `${type === "source" ? "File" : "Folder"} Selected`, description: `Selected: ${fullPath}` });
    }
    setSelectedItem(null);
  };

  const handleSelectBucket = (bucket: string, type: "source" | "destination") => {
    const setConfig = type === "source" ? setSourceConfig : setDestinationConfig;
    const setSelectedPath = type === "source" ? setSelectedSourcePath : setSelectedDestPath;
    const setIsConnected = type === "source" ? setIsSourceConnected : setIsDestConnected;
    const setSelectedItem = type === "source" ? setSourceSelectedItem : setDestSelectedItem;

    setConfig((prev) => ({ ...prev, bucket, currentPath: "" }));
    fetchObjects(bucket, "");
    setSelectedPath("");
    setIsConnected(false);
    if (type === "source") {
      localStorage.setItem("selectedBucket", bucket);
      localStorage.removeItem("selectedFile");
    } else {
      localStorage.setItem("selectedDestBucket", bucket);
      localStorage.setItem("selectedDestFolder", "");
    }
    setSelectedItem(null);
  };

  const handleSelectDestinationFolder = () => {
    if (!selectedSourcePath) {
      toast({ title: "Error", description: "Please select a source file first", variant: "destructive" });
      return;
    }
    const sourceFilename = selectedSourcePath.split("/").pop() || "output.csv";
    const destPath = `${selectedDestination}://${destinationConfig.bucket}/${destinationConfig.currentPath || ""}${destSelectedItem || sourceFilename}`;
    setSelectedDestPath(destPath);
    setIsDestConnected(true);
    localStorage.setItem("selectedDestFolder", destSelectedItem || destinationConfig.currentPath || "");
    setShowDestBrowser(false);
    toast({ title: "Destination Selected", description: `Selected: ${destSelectedItem || destinationConfig.currentPath || ""}${sourceFilename}` });
    scrollToSummary();
  };

  const handleSelectDestBucketOrContainer = () => {
    if (!selectedSourcePath) {
      toast({ title: "Error", description: "Please select a source file first", variant: "destructive" });
      return;
    }
    const sourceFilename = selectedSourcePath.split("/").pop() || "output.csv";
    const destPath = `${selectedDestination}://${destSelectedItem}/${sourceFilename}`;
    setSelectedDestPath(destPath);
    setIsDestConnected(true);
    localStorage.setItem("selectedDestBucket", destSelectedItem!);
    localStorage.setItem("selectedDestFolder", "");
    setShowDestBrowser(false);
    toast({ title: "Destination Selected", description: `Selected: ${destSelectedItem}` });
    scrollToSummary();
  };

  const handleConnect = async (type: "source" | "destination") => {
    if (type === "source") {
      if (selectedSource === "local") {
        setShowSourceBrowser(true);
        toast({ title: "Connection Initiated", description: "Please select files to upload" });
      } else if (selectedSource === "s3" || selectedSource === "azure-blob") {
        setIsSourceConnecting(true);
        try {
          await fetchBuckets(type);
          setShowSourceBrowser(true);
        } catch (error) {
          toast({ title: "Error", description: "Failed to connect. Check console for details.", variant: "destructive" });
        } finally {
          setIsSourceConnecting(false);
        }
      } else if (selectedSource === "database") {
        if (!sourceConfig.databaseName || !sourceConfig.username) {
          toast({ title: "Error", description: "Database Name and Username are required", variant: "destructive" });
          return;
        }
        setIsSourceConnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowSourceDBBrowser(true);
        setIsSourceConnecting(false);
        toast({ title: "Connection Successful", description: "Connected to database successfully" });
      }
    } else {
      if (selectedDestination === "s3" || selectedDestination === "azure-blob") {
        if (!selectedSourcePath) {
          toast({ title: "Error", description: "Please select a source file first", variant: "destructive" });
          return;
        }
        setIsDestConnecting(true);
        try {
          await fetchBuckets(type);
          setShowDestBrowser(true);
          if (buckets.length > 0) {
            toast({
              title: "Connection Initiated",
              description: `Please select a ${selectedDestination === "azure-blob" ? "container" : "bucket"}`,
            });
          } else {
            toast({
              title: `No ${selectedDestination === "azure-blob" ? "Containers" : "Buckets"}`,
              description: `No ${selectedDestination === "azure-blob" ? "containers" : "buckets"} found. Check API or credentials.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({ title: "Error", description: "Failed to connect. Check console for details.", variant: "destructive" });
        } finally {
          setIsDestConnecting(false);
        }
      } else if (selectedDestination === "database") {
        if (!destinationConfig.databaseName || !destinationConfig.username) {
          toast({ title: "Error", description: "Database Name and Username are required", variant: "destructive" });
          return;
        }
        setIsDestConnecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsDestConnected(true);
        setSelectedDestPath(destinationConfig.databaseName!);
        setIsDestConnecting(false);
        toast({ title: "Connection Successful", description: "Connected to database successfully" });
        scrollToSummary();
      }
    }
  };

  const handleRemoveSourcePath = () => {
    setSelectedSourcePath("");
    setIsSourceConnected(false);
    setSourceConfig({});
    setUploadedFiles([]);
    localStorage.removeItem("selectedFile");
    localStorage.removeItem("selectedBucket");
  };

  const handleRemoveDestPath = () => {
    setSelectedDestPath("");
    setIsDestConnected(false);
    setDestinationConfig({ type: selectedDestination });
    localStorage.removeItem("selectedDestFolder");
    localStorage.removeItem("selectedDestBucket");
  };

  const renderSourceFields = () => {
    if (selectedSource === "local") {
      return (
        <div className="space-y-4">
          <Button
            onClick={() => handleConnect("source")}
            disabled={isSourceConnecting}
            className="w-full flex items-center gap-2"
          >
            {isSourceConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <HardDrive className="w-4 h-4" />
                Connect to Local
              </>
            )}
          </Button>
          {selectedSourcePath && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <div className="flex-1 text-sm truncate">{selectedSourcePath}</div>
              <Button variant="ghost" size="icon" onClick={handleRemoveSourcePath}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    } else if (selectedSource === "s3" || selectedSource === "azure-blob") {
      return (
        <div className="space-y-4">
          <Button
            onClick={() => handleConnect("source")}
            disabled={isSourceConnecting}
            className="w-full flex items-center gap-2"
          >
            {isSourceConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                Connect to {selectedSource === "azure-blob" ? "Azure Blob" : "S3"}
              </>
            )}
          </Button>
          {selectedSourcePath && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <div className="flex-1 text-sm truncate">{selectedSourcePath}</div>
              <Button variant="ghost" size="icon" onClick={handleRemoveSourcePath}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    } else if (selectedSource === "database") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="db-name">Database Name</Label>
              <Input
                id="db-name"
                value={sourceConfig.databaseName || ""}
                onChange={(e) => setSourceConfig((prev) => ({ ...prev, databaseName: e.target.value }))}
                placeholder="Enter database name"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={sourceConfig.username || ""}
                onChange={(e) => setSourceConfig((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
              />
            </div>
          </div>
          <Button
            onClick={() => handleConnect("source")}
            disabled={isSourceConnecting || !sourceConfig.databaseName || !sourceConfig.username}
            className="w-full flex items-center gap-2"
          >
            {isSourceConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Connect to Database
              </>
            )}
          </Button>
          {selectedSourcePath && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <div className="flex-1 text-sm truncate">{selectedSourcePath}</div>
              <Button variant="ghost" size="icon" onClick={handleRemoveSourcePath}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderDestinationFields = () => {
    if (selectedDestination === "s3" || selectedDestination === "azure-blob") {
      return (
        <div className="space-y-4">
          <Button
            onClick={() => handleConnect("destination")}
            disabled={isDestConnecting}
            className="w-full flex items-center gap-2"
          >
            {isDestConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                Connect to {selectedDestination === "azure-blob" ? "Azure Blob" : "S3"}
              </>
            )}
          </Button>
          {selectedDestPath && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <div className="flex-1 text-sm truncate">{selectedDestPath}</div>
              <Button variant="ghost" size="icon" onClick={handleRemoveDestPath}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    } else if (selectedDestination === "database") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="db-name-dest">Database Name</Label>
              <Input
                id="db-name-dest"
                value={destinationConfig.databaseName || ""}
                onChange={(e) => setDestinationConfig((prev) => ({ ...prev, databaseName: e.target.value }))}
                placeholder="Enter database name"
              />
            </div>
            <div>
              <Label htmlFor="username-dest">Username</Label>
              <Input
                id="username-dest"
                value={destinationConfig.username || ""}
                onChange={(e) => setDestinationConfig((prev) => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
              />
            </div>
          </div>
          <Button
            onClick={() => handleConnect("destination")}
            disabled={isDestConnecting || !destinationConfig.databaseName || !destinationConfig.username}
            className="w-full flex items-center gap-2"
          >
            {isDestConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Connect to Database
              </>
            )}
          </Button>
          {selectedDestPath && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <div className="flex-1 text-sm truncate">{selectedDestPath}</div>
              <Button variant="ghost" size="icon" onClick={handleRemoveDestPath}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleProceed = () => {
    if (!isSourceConnected || !selectedSourcePath) {
      toast({ title: "Error", description: "Please connect and select a source path", variant: "destructive" });
      return;
    }
    if (!isDestConnected || !selectedDestPath) {
      toast({ title: "Error", description: "Please connect and select a destination path", variant: "destructive" });
      return;
    }
    if (!localStorage.getItem("selectedBucket") || !localStorage.getItem("selectedFile")) {
      toast({ title: "Error", description: "Bucket or file not properly set. Please reselect the source.", variant: "destructive" });
      return;
    }
    if ((selectedDestination === "s3" || selectedDestination === "azure-blob") && !localStorage.getItem("selectedDestBucket")) {
      toast({ title: "Error", description: "Destination bucket not properly set. Please reselect the destination.", variant: "destructive" });
      return;
    }
    navigate("/dashboard/schema");
  };

  const handleGoBack = () => {
    navigate("/dashboard/jobs");
  };

  const Breadcrumbs = ({ type }: { type: "source" | "destination" }) => {
    const config = type === "source" ? sourceConfig : destinationConfig;
    const path = config.currentPath || "";
    const bucketOrContainer = config.bucket;
    const prefix = type === "source" ? selectedSource : selectedDestination;

    return (
      <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-2">
        <span
          onClick={() => {
            if (type === "source") {
              setSourceConfig((prev) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setSelectedSourcePath("");
              setIsSourceConnected(false);
              setObjects([]);
              localStorage.removeItem("selectedBucket");
              localStorage.removeItem("selectedFile");
            } else {
              setDestinationConfig((prev) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setSelectedDestPath("");
              setIsDestConnected(false);
              setObjects([]);
              localStorage.removeItem("selectedDestFolder");
              localStorage.removeItem("selectedDestBucket");
            }
          }}
          className="cursor-pointer hover:underline flex items-center"
        >
          <Folder className="w-4 h-4 mr-1" /> Root
        </span>
        {bucketOrContainer && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span
              onClick={() => {
                if (type === "source") {
                  setSourceConfig((prev) => ({ ...prev, currentPath: "" }));
                  fetchObjects(bucketOrContainer, "");
                  setSelectedSourcePath("");
                  setIsSourceConnected(false);
                  localStorage.removeItem("selectedFile");
                } else {
                  setDestinationConfig((prev) => ({ ...prev, currentPath: "" }));
                  fetchObjects(bucketOrContainer, "");
                  setSelectedDestPath("");
                  setIsDestConnected(false);
                  localStorage.removeItem("selectedDestFolder");
                }
              }}
              className="cursor-pointer hover:underline"
            >
              {bucketOrContainer}
            </span>
          </>
        )}
        {path
          .split("/")
          .filter((p) => p)
          .map((part, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-4 h-4" />
              <span
                onClick={() => {
                  const newPath = path.split("/").slice(0, idx + 1).join("/") + "/";
                  if (type === "source") {
                    setSourceConfig((prev) => ({ ...prev, currentPath: newPath }));
                    fetchObjects(sourceConfig.bucket!, newPath);
                    setSelectedSourcePath("");
                    setIsSourceConnected(false);
                    localStorage.removeItem("selectedFile");
                  } else {
                    setDestinationConfig((prev) => ({ ...prev, currentPath: newPath }));
                    fetchObjects(destinationConfig.bucket!, newPath);
                    setSelectedDestPath("");
                    setIsDestConnected(false);
                    localStorage.removeItem("selectedDestFolder");
                  }
                }}
                className="cursor-pointer hover:underline"
              >
                {part}
              </span>
            </React.Fragment>
          ))}
      </div>
    );
  };

  const mockTables = ["customers", "orders", "products", "employees", "departments"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto">
        <Dialog
          open={showSourceBrowser && selectedSource === "local"}
          onOpenChange={(open) => {
            setShowSourceBrowser(open);
            if (!open) {
              setSelectedSourcePath("");
              setIsSourceConnected(false);
              setUploadedFiles([]);
              localStorage.removeItem("selectedFile");
              localStorage.removeItem("selectedBucket");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Local Files</DialogTitle>
              <DialogDescription>Select files to upload from your local device.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/50"
                }`}
              >
                <input {...getInputProps()} />
                <UploadIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  {isDragActive ? "Drop the files here ..." : "Drag & drop files here, or click to select files"}
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                      <File className="w-4 h-4 text-gray-500" />
                      <div className="flex-1 text-sm truncate">{file.name}</div>
                    </div>
                  ))}
                </div>
              )}
              {uploadedFiles.length > 0 && (
                <Button
                  onClick={() => {
                    setShowSourceBrowser(false);
                    toast({ title: "Files Selected", description: `Selected: ${selectedSourcePath}` });
                  }}
                  className="w-fit flex items-center gap-2"
                >
                  Select {uploadedFiles.length} File{uploadedFiles.length !== 1 ? "s" : ""}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showSourceBrowser && (selectedSource === "s3" || selectedSource === "azure-blob")}
          onOpenChange={(open) => {
            setShowSourceBrowser(open);
            if (!open) {
              setSourceConfig((prev) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setSelectedSourcePath("");
              setIsSourceConnected(false);
              setObjects([]);
              localStorage.removeItem("selectedFile");
              localStorage.removeItem("selectedBucket");
              setSourceSelectedItem(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Browse {selectedSource === "azure-blob" ? "Azure Containers" : "S3 Buckets"}</DialogTitle>
              <DialogDescription>
                Select a {selectedSource === "azure-blob" ? "container" : "bucket"} and file for the data source.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Breadcrumbs type="source" />
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {!sourceConfig.bucket ? (
                  buckets.length > 0 ? (
                    buckets.map((bucket) => (
                      <div
                        key={bucket.name}
                        className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                          sourceSelectedItem === bucket.name ? "bg-primary/20 border-primary/50" : ""
                        }`}
                        onDoubleClick={() => handleSelectBucket(bucket.name, "source")}
                        onClick={() => setSourceSelectedItem(bucket.name)}
                      >
                        <Folder className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 font-medium">{bucket.name}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      No {selectedSource === "azure-blob" ? "containers" : "buckets"} available.
                    </div>
                  )
                ) : (
                  <>
                    <div
                      className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0"
                      onDoubleClick={() => handleS3Navigation("..", true, "source")}
                    >
                      <Folder className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 font-medium">..</div>
                    </div>
                    {objects.length > 0 ? (
                      objects.map((obj) => {
                        const isFolder = obj.isFolder || obj.key.endsWith("/");
                        return (
                          <div
                            key={obj.key}
                            className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                              sourceSelectedItem === obj.key ? "bg-primary/20 border-primary/50" : ""
                            }`}
                            onDoubleClick={() => handleS3Navigation(obj.key, isFolder, "source")}
                            onClick={() => setSourceSelectedItem(obj.key)}
                          >
                            {isFolder ? (
                              <Folder className="w-4 h-4 text-blue-500" />
                            ) : (
                              <File className="w-4 h-4 text-gray-500" />
                            )}
                            <div className="flex-1 font-medium">{obj.key.split("/").pop() || obj.key}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No {selectedSource === "azure-blob" ? "blobs" : "objects"} available.
                      </div>
                    )}
                  </>
                )}
              </div>
              {sourceConfig.bucket && sourceSelectedItem && !sourceSelectedItem.endsWith("/") && (
                <Button
                  onClick={() => handleS3Navigation(sourceSelectedItem, false, "source")}
                  className="w-fit flex items-center gap-2"
                >
                  Select {sourceSelectedItem}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showDestBrowser}
          onOpenChange={(open) => {
            setShowDestBrowser(open);
            if (!open) {
              setDestinationConfig((prev) => ({ ...prev, bucket: undefined, currentPath: "" }));
              setSelectedDestPath("");
              setIsDestConnected(false);
              setObjects([]);
              localStorage.removeItem("selectedDestFolder");
              localStorage.removeItem("selectedDestBucket");
              setDestSelectedItem(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Browse {selectedDestination === "azure-blob" ? "Azure Containers" : "S3 Buckets"}</DialogTitle>
              <DialogDescription>
                Select a {selectedDestination === "azure-blob" ? "container" : "bucket"} and folder for the destination.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Breadcrumbs type="destination" />
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {!destinationConfig.bucket ? (
                  buckets.length > 0 ? (
                    buckets.map((bucket) => (
                      <div
                        key={bucket.name}
                        className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                          destSelectedItem === bucket.name ? "bg-primary/20 border-primary/50" : ""
                        }`}
                        onDoubleClick={() => handleSelectBucket(bucket.name, "destination")}
                        onClick={() => setDestSelectedItem(bucket.name)}
                      >
                        <Folder className="w-4 h-4 text-blue-500" />
                        <div className="flex-1 font-medium">{bucket.name}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      No {selectedDestination === "azure-blob" ? "containers" : "buckets"} available.
                    </div>
                  )
                ) : (
                  <>
                    <div
                      className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0"
                      onDoubleClick={() => handleS3Navigation("..", true, "destination")}
                    >
                      <Folder className="w-4 h-4 text-blue-500" />
                      <div className="flex-1 font-medium">..</div>
                    </div>
                    {objects.length > 0 ? (
                      objects.map((obj) => {
                        const isFolder = obj.isFolder || obj.key.endsWith("/");
                        return (
                          <div
                            key={obj.key}
                            className={`flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0 ${
                              destSelectedItem === obj.key ? "bg-primary/20 border-primary/50" : ""
                            }`}
                            onDoubleClick={() => handleS3Navigation(obj.key, isFolder, "destination")}
                            onClick={() => setDestSelectedItem(obj.key)}
                          >
                            {isFolder ? (
                              <Folder className="w-4 h-4 text-blue-500" />
                            ) : (
                              <File className="w-4 h-4 text-gray-500" />
                            )}
                            <div className="flex-1 font-medium">{obj.key}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-muted-foreground">
                        No {selectedDestination === "azure-blob" ? "blobs" : "objects"} available.
                      </div>
                    )}
                  </>
                )}
              </div>
              {destinationConfig.bucket && destSelectedItem && destSelectedItem !== ".." && (
                <div className="text-sm text-muted-foreground">
                  Selected Path: {`${selectedDestination}://${destinationConfig.bucket}/${destinationConfig.currentPath || ""}${destSelectedItem}`}
                </div>
              )}
              {!destinationConfig.bucket && destSelectedItem && (
                <Button
                  onClick={handleSelectDestBucketOrContainer}
                  className="w-fit flex items-center gap-2"
                >
                  Select This {selectedDestination === "azure-blob" ? "Container" : "Bucket"}
                </Button>
              )}
              {destinationConfig.bucket && destSelectedItem && destSelectedItem !== ".." && (
                <Button
                  onClick={handleSelectDestinationFolder}
                  disabled={!selectedSourcePath}
                  className="w-fit flex items-center gap-2"
                >
                  Select This Folder
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showSourceDBBrowser}
          onOpenChange={(open) => {
            setShowSourceDBBrowser(open);
            if (!open) {
              setSourceDBSelectedTables([]);
              setSelectAllTables(false);
              localStorage.removeItem("selectedFile");
              localStorage.removeItem("selectedBucket");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Browse Database Tables</DialogTitle>
              <DialogDescription>Select tables from the database for the data source.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Database: {sourceConfig.databaseName}</div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all-tables"
                  checked={selectAllTables}
                  onCheckedChange={(checked) => setSelectAllTables(checked as boolean)}
                />
                <Label htmlFor="select-all-tables">Select All Tables</Label>
              </div>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {mockTables.map((table) => (
                  <div key={table} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                    <Checkbox
                      id={`table-${table}`}
                      checked={sourceDBSelectedTables.includes(table)}
                      onCheckedChange={(checked) => {
                        if (checked) setSourceDBSelectedTables((prev) => [...prev, table]);
                        else setSourceDBSelectedTables((prev) => prev.filter((t) => t !== table));
                      }}
                    />
                    <Database className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{table}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  if (sourceDBSelectedTables.length > 0) {
                    const fullPath = sourceDBSelectedTables.map((table) => `${sourceConfig.databaseName}.${table}`).join(", ");
                    setSelectedSourcePath(fullPath);
                    setIsSourceConnected(true);
                    setShowSourceDBBrowser(false);
                    localStorage.setItem("selectedBucket", sourceConfig.databaseName!);
                    localStorage.setItem("selectedFile", sourceDBSelectedTables.join(","));
                    toast({ title: "Tables Selected", description: `Selected: ${fullPath}` });
                    setSourceDBSelectedTables([]);
                    setSelectAllTables(false);
                  } else {
                    toast({ title: "Error", description: "Please select at least one table", variant: "destructive" });
                  }
                }}
                disabled={sourceDBSelectedTables.length === 0}
                className="w-fit flex items-center gap-2"
              >
                Select {sourceDBSelectedTables.length} Table{sourceDBSelectedTables.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDestDBBrowser} onOpenChange={setShowDestDBBrowser}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Browse Database Tables</DialogTitle>
              <DialogDescription>Select a table from the database for the destination.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">Database: {destinationConfig.databaseName}</div>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {mockTables.map((table) => (
                  <div
                    key={table}
                    className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setSelectedDestPath(`${destinationConfig.databaseName}.${table}`);
                      setIsDestConnected(true);
                      setShowDestDBBrowser(false);
                      localStorage.setItem("selectedDestFolder", table);
                      toast({ title: "Table Selected", description: `Selected: ${table}` });
                      scrollToSummary();
                    }}
                  >
                    <Database className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{table}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Data Source</CardTitle>
              <CardDescription>Select and configure your data source</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="source-select">Data Source</Label>
                <Select
                  value={selectedSource}
                  onValueChange={(value) => {
                    setSelectedSource(value);
                    setSelectedSourcePath("");
                    setIsSourceConnected(false);
                    setSourceConfig({});
                    localStorage.removeItem("selectedBucket");
                    localStorage.removeItem("selectedFile");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((source) => {
                      const Icon = source.icon;
                      return (
                        <SelectItem key={source.value} value={source.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {source.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {selectedSource && <div className="space-y-4 animate-fade-in">{renderSourceFields()}</div>}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Destination</CardTitle>
              <CardDescription>Select and configure your destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="destination-select">Destination</Label>
                <Select
                  value={selectedDestination}
                  onValueChange={(value) => {
                    setSelectedDestination(value);
                    setSelectedDestPath("");
                    setIsDestConnected(false);
                    setDestinationConfig({ type: value });
                    localStorage.removeItem("selectedDestFolder");
                    localStorage.removeItem("selectedDestBucket");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => {
                      const Icon = dest.icon;
                      return (
                        <SelectItem key={dest.value} value={dest.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {dest.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {selectedDestination && <div className="space-y-4 animate-fade-in">{renderDestinationFields()}</div>}
            </CardContent>
          </Card>
        </div>
        {selectedSource && selectedDestination && isSourceConnected && isDestConnected && (
          <Card ref={summaryRef} className="mt-8 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Configuration Summary
              </CardTitle>
              <CardDescription>Review your selected source and destination</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Source</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(dataSources.find((s) => s.value === selectedSource)?.icon || HardDrive, {
                        className: "w-4 h-4",
                      })}
                      <span className="font-medium">{dataSources.find((s) => s.value === selectedSource)?.label}</span>
                    </div>
                    <p className="text-sm text-green-600">✓ Connected Successfully</p>
                    <p className="text-sm text-muted-foreground">Path: {selectedSourcePath}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Destination</h4>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {React.createElement(destinations.find((d) => d.value === selectedDestination)?.icon || Database, {
                        className: "w-4 h-4",
                      })}
                      <span className="font-medium">{destinations.find((d) => d.value === selectedDestination)?.label}</span>
                    </div>
                    <p className="text-sm text-green-600">✓ Connected Successfully</p>
                    <p className="text-sm text-muted-foreground">Path: {selectedDestPath}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between gap-4">
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}