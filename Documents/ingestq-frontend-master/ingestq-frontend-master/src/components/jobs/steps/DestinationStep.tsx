import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, Folder, CheckCircle, X } from "lucide-react";

interface Job {
  id: string;
  name: string;
}

interface DestinationStepProps {
  job: Job | null;
}

export default function DestinationStep({ job }: DestinationStepProps) {
  const [destType, setDestType] = useState("s3");
  const [credentials, setCredentials] = useState({
    accessKey: "",
    secretKey: ""
  });
  const [selectedPath, setSelectedPath] = useState("");
  const [showBrowser, setShowBrowser] = useState(false);
  const [outputFormat, setOutputFormat] = useState("parquet");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const destinationTypes = [
    { value: "s3", label: "Amazon S3", icon: Cloud },
    { value: "azure", label: "Azure Blob", icon: Cloud },
    { value: "database", label: "Database", icon: Database },
  ];

  const mockFolders = [
    { name: "processed", type: "folder" },
    { name: "analytics", type: "folder" },
    { name: "reports", type: "folder" },
    { name: "backup", type: "folder" }
  ];

  const handleConnect = async () => {
    if (!credentials.accessKey || !credentials.secretKey) {
      alert("Please enter credentials first");
      return;
    }
    
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleBrowse = () => {
    if (!isConnected) {
      alert("Please connect first");
      return;
    }
    setShowBrowser(true);
  };

  const handleRemovePath = () => {
    setSelectedPath("");
  };

  const renderDestinationConfig = () => {
    switch (destType) {
      case "s3":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destAccessKey">AWS Access Key ID</Label>
                <Input
                  id="destAccessKey"
                  placeholder="AKIA..."
                  value={credentials.accessKey}
                  onChange={(e) => setCredentials({ ...credentials, accessKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destSecretKey">AWS Secret Access Key</Label>
                <Input
                  id="destSecretKey"
                  type="password"
                  placeholder="Enter secret key"
                  value={credentials.secretKey}
                  onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                />
              </div>
            </div>
            
            {selectedPath && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Path selected:</span>
                    <span className="text-sm text-green-700">{selectedPath}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePath}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-start">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || isConnected || !credentials.accessKey || !credentials.secretKey || !!selectedPath}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            {isConnected && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="destSelectedPath">Selected Destination Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="destSelectedPath"
                      placeholder="Browse and select destination folder..."
                      value={selectedPath}
                      readOnly
                    />
                    <Button variant="outline" onClick={handleBrowse}>
                      <Folder className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parquet">Parquet</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="avro">Avro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {showBrowser && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Browse S3 Bucket - Select Destination</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {mockFolders.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => {
                          setSelectedPath(`s3://analytics-processed-data/${item.name}/`);
                          setShowBrowser(false);
                        }}
                      >
                        <Folder className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setShowBrowser(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case "azure":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destConnectionString">Connection String</Label>
                <Input
                  id="destConnectionString"
                  placeholder="DefaultEndpointsProtocol=https;AccountName=..."
                  value={credentials.accessKey}
                  onChange={(e) => setCredentials({ ...credentials, accessKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destContainerName">Container Name</Label>
                <Input
                  id="destContainerName"
                  placeholder="processed-data"
                  value={credentials.secretKey}
                  onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                />
              </div>
            </div>
            
            {selectedPath && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Path selected:</span>
                    <span className="text-sm text-green-700">{selectedPath}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePath}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-start">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || isConnected || !credentials.accessKey || !credentials.secretKey || !!selectedPath}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>

            {isConnected && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="destSelectedPath">Selected Destination Path</Label>
                  <div className="flex gap-2">
                    <Input
                      id="destSelectedPath"
                      placeholder="Browse and select destination folder..."
                      value={selectedPath}
                      readOnly
                    />
                    <Button variant="outline" onClick={handleBrowse}>
                      <Folder className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parquet">Parquet</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="avro">Avro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        );
      case "database":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destHost">Host</Label>
                <Input 
                  id="destHost" 
                  placeholder="analytics-db.cluster.amazonaws.com"
                  value={credentials.accessKey}
                  onChange={(e) => setCredentials({ ...credentials, accessKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destPort">Port</Label>
                <Input 
                  id="destPort" 
                  placeholder="5432"
                  value={credentials.secretKey}
                  onChange={(e) => setCredentials({ ...credentials, secretKey: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destDatabase">Database</Label>
                <Input 
                  id="destDatabase" 
                  placeholder="analytics"
                  onChange={(e) => setSelectedPath(e.target.value ? `${e.target.value}.processed_customers` : "")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destTable">Table</Label>
                <Input 
                  id="destTable" 
                  placeholder="processed_customers"
                  onChange={(e) => setSelectedPath(credentials.accessKey ? `${credentials.accessKey}.${e.target.value}` : "")}
                />
              </div>
            </div>
            
            {selectedPath && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Table selected:</span>
                    <span className="text-sm text-green-700">{selectedPath}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePath}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-start">
              <Button 
                onClick={handleConnect}
                disabled={isConnecting || isConnected || !credentials.accessKey || !credentials.secretKey || !!selectedPath}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Connecting...
                  </>
                ) : isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Configuration options will appear here based on the selected destination type.
          </div>
        );
    }
  };

  // Reset connection state when destination type changes
  const handleDestTypeChange = (value: string) => {
    setDestType(value);
    setIsConnected(false);
    setCredentials({ accessKey: "", secretKey: "" });
    setSelectedPath("");
    setShowBrowser(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Destination Configuration
          </CardTitle>
          <CardDescription>
            Configure where the processed data will be stored.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Currently Active</Badge>
            <span className="text-sm text-muted-foreground">Amazon S3 - analytics-processed-data</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destType">Destination Type</Label>
              <Select value={destType} onValueChange={handleDestTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {destinationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderDestinationConfig()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}