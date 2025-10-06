"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Edit,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Code,
  RefreshCw,
  X,
  FileText,
  Eye,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { runBLValidation, type BLValidationRequest, type BLValidationResponse } from "@/lib/api"

interface ValidationFailure {
  ruleName: string
  rowIndex: number
  values: { [column: string]: any }
  reason: string
}

// Enhanced BL validation response to include failed rows
interface EnhancedBLValidationResponse extends BLValidationResponse {
  body: BLValidationResponse["body"] & {
    details?: {
      [ruleName: string]: {
        passed_count: number
        failed_count: number
        failed_rows?: Array<{
          row_index: number
          values: { [column: string]: any }
          reason: string
        }>
      }
    }
  }
}

export const getS3FileContent = async (bucket: string, key: string): Promise<string> => {
  const token = localStorage.getItem("authToken") || "default-token"
  const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com"
  try {
    const response = await fetch(`${BASE_URL}/buckets/${bucket}/file?key=${encodeURIComponent(key)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch S3 file: ${response.status}`)
    }

    const content = await response.text()
    return content
  } catch (error) {
    console.error("Error fetching S3 file:", error)
    throw error
  }
}

export const getFailedBusinessRulesContent = async (sourceFileName: string, ruleName: string): Promise<string> => {
  const token = localStorage.getItem("authToken") || "default-token"
  const BASE_URL = "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com"

  // Construct the failed rules file name with rules folder: rules/source_rulename_failedrules.txt
  const failedRulesFileName = `rules/${sourceFileName}_AccountType_failedrules.txt`
  const bucket = "failedbusinessrules"

  try {
    const response = await fetch(`${BASE_URL}/buckets/${bucket}/file?key=${encodeURIComponent(failedRulesFileName)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch failed business rules file: ${response.status}`)
    }

    const content = await response.text()
    return content
  } catch (error) {
    console.error("Error fetching failed business rules file:", error)
    throw error
  }
}

interface BusinessRule {
  id: string
  name: string
  description: string
  logic: string
  priority: "high" | "medium" | "low"
  status: "active" | "inactive" | "testing"
  category: "validation" | "transformation" | "calculation"
}

export default function BusinessLogic() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [rules, setRules] = useState<BusinessRule[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showValidationDialog, setShowValidationDialog] = useState(false)
  const [showFilePreview, setShowFilePreview] = useState(false)
  const [showFailureDetails, setShowFailureDetails] = useState(false)
  const [fileContent, setFileContent] = useState<string>("")
  const [csvData, setCsvData] = useState<Array<{ [key: string]: any }>>([])
  const [csvHeaders, setCsvHeaders] = useState<string[]>([])
  const [loadingFile, setLoadingFile] = useState(false)
  const [editingRule, setEditingRule] = useState<BusinessRule | null>(null)
  const [validationProgress, setValidationProgress] = useState(0)
  const [validationStatus, setValidationStatus] = useState<"running" | "success" | "failed" | null>(null)
  const [validationResults, setValidationResults] = useState<{
    passed: number
    failed: number
    summary: string
  } | null>(null)
  const [validationFailures, setValidationFailures] = useState<ValidationFailure[]>([])
  const [validationDetails, setValidationDetails] = useState<{
    [ruleName: string]: {
      passed_count: number
      failed_count: number
      failed_rows?: Array<{ row_index: number; values: { [column: string]: any }; reason: string }>
    }
  } | null>(null)
  const [filterRule, setFilterRule] = useState<string>("all")
  const [newRule, setNewRule] = useState<Partial<BusinessRule>>({
    name: "",
    description: "",
    logic: "",
    priority: "medium",
    status: "testing",
    category: "validation",
  })
  const [failedRulesContent, setFailedRulesContent] = useState<string>("")

  // Parse CSV content into structured data
  const parseCsvContent = (content: string) => {
    const lines = content.trim().split("\n")
    if (lines.length === 0) return

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    setCsvHeaders(headers)

    const data = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const row: { [key: string]: any } = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      data.push(row)
    }
    setCsvData(data)
  }

  const handleAddRule = () => {
    if (newRule.name && newRule.description && newRule.logic) {
      const rule: BusinessRule = {
        id: Date.now().toString(),
        name: newRule.name,
        description: newRule.description,
        logic: newRule.logic,
        priority: newRule.priority as "high" | "medium" | "low",
        status: newRule.status as "active" | "inactive" | "testing",
        category: newRule.category as "validation" | "transformation" | "calculation",
      }

      setRules((prev) => [...prev, rule])
      setNewRule({
        name: "",
        description: "",
        logic: "",
        priority: "medium",
        status: "testing",
        category: "validation",
      })
      setShowAddDialog(false)

      toast({
        title: "Business rule added",
        description: `Rule "${rule.name}" has been created successfully.`,
      })
    }
  }

  const handleEditRule = (rule: BusinessRule) => {
    setEditingRule({ ...rule })
    setShowEditDialog(true)
  }

  const handleSaveRule = () => {
    if (editingRule) {
      setRules((prev) => prev.map((rule) => (rule.id === editingRule.id ? editingRule : rule)))
      setShowEditDialog(false)
      setEditingRule(null)

      toast({
        title: "Rule updated",
        description: `Rule "${editingRule.name}" has been updated successfully.`,
      })
    }
  }

  const handleRunAllRules = async () => {
    localStorage.setItem("businesslogic", "executed")

    if (rules.length === 0) {
      toast({
        title: "No rules",
        description: "Please add at least one rule before running validation.",
        variant: "destructive",
      })
      return
    }

    // Fetch S3 bucket and key from localStorage with fallback values
    const s3Bucket = localStorage.getItem("selectedBucket") || "default-bucket"
    const s3Key = localStorage.getItem("selectedFile") || "default-key"

    // Validate S3 bucket and key
    if (s3Bucket === "default-bucket" || s3Key === "default-key") {
      toast({
        title: "Configuration Error",
        description: "S3 bucket or key not set in localStorage. Please configure valid S3 details.",
        variant: "destructive",
      })
      return
    }

    setShowValidationDialog(true)
    setValidationStatus("running")
    setValidationProgress(0)
    setValidationResults(null)
    setValidationFailures([])
    setValidationDetails(null)

    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 8
      })
    }, 200)

    try {
      const requestData: BLValidationRequest = {
        payload: {
          input: {
            input_type: "csv",
            Records: [
              {
                s3: {
                  bucket: { name: s3Bucket },
                  object: { key: s3Key },
                },
              },
            ],
          },
          rules: Object.fromEntries(rules.map((rule) => [rule.name, rule.logic])),
        },
      }

      const result = (await runBLValidation(requestData)) as EnhancedBLValidationResponse
      clearInterval(interval)
      setValidationProgress(100)

      // Check if the response contains valid validation results
      if (
        result.body.passed_rules !== undefined &&
        result.body.failed_rules !== undefined &&
        typeof result.body.passed_rules === "number" &&
        typeof result.body.failed_rules === "number"
      ) {
        setValidationResults({
          passed: result.body.passed_rules,
          failed: result.body.failed_rules,
          summary: `Business rules validation completed. ${result.body.passed_rules} rules passed successfully, ${result.body.failed_rules} rules failed validation. Overall success rate: ${Math.round(
            (result.body.passed_rules / (result.body.passed_rules + result.body.failed_rules)) * 100,
          )}%`,
        })

        // Process failure details if available
        if (result.body.details) {
          setValidationDetails(result.body.details)
          const failures: ValidationFailure[] = []
          Object.entries(result.body.details).forEach(([ruleName, ruleDetails]) => {
            if (ruleDetails.failed_rows) {
              ruleDetails.failed_rows.forEach((failedRow) => {
                failures.push({
                  ruleName,
                  rowIndex: failedRow.row_index,
                  values: failedRow.values,
                  reason: failedRow.reason,
                })
              })
            }
          })
          setValidationFailures(failures)
        }

        setValidationStatus("success")
      } else {
        throw new Error(
          // result.body.errorMessage || "Invalid validation results format"
        )
      }
    } catch (error) {
      clearInterval(interval)
      setValidationProgress(100)
      setValidationStatus("failed")
      setValidationResults({
        passed: 0,
        failed: rules.length,
        summary: `Business rules validation failed. Please check the configuration and try again. Error: ${(error as Error).message}`,
      })
      toast({
        title: "Validation Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleViewSource = async () => {
    setLoadingFile(true)
    try {
      const s3Bucket = localStorage.getItem("selectedBucket") || "default-bucket"
      const s3Key = localStorage.getItem("selectedFile") || "default-key"
      const selectedRule = localStorage.getItem("selectedRule") || "default-rule"

      if (s3Bucket === "default-bucket" || s3Key === "default-key") {
        throw new Error("Invalid S3 configuration")
      }

      // Get source file content
      const content = await getS3FileContent(s3Bucket, s3Key)
      setFileContent(content)
      parseCsvContent(content)
      setShowFilePreview(true)

      try {
        // Extract filename without extension from s3Key
        const sourceFileName =
          s3Key
            .split("/")
            .pop()
            ?.replace(/\.[^/.]+$/, "") || "unknown"
        console.log("[v0] Fetching failed rules for:", sourceFileName, selectedRule)
        const failedRulesContent = await getFailedBusinessRulesContent(sourceFileName, selectedRule)
        console.log("[v0] Failed rules content length:", failedRulesContent.length)

        // Store failed rules content for later use
        setFailedRulesContent(failedRulesContent)

        toast({
          title: "Files Loaded",
          description: `Source file and failed business rules file loaded successfully. Failed rules: ${failedRulesContent.length > 0 ? "Found" : "Empty"}`,
          variant: "default",
        })
      } catch (failedRulesError) {
        console.log("[v0] Failed to load failed rules:", failedRulesError)
        setFailedRulesContent("No failed business rules file found or error loading file.")
        toast({
          title: "Failed Rules Not Found",
          description: "Could not load failed business rules file. It may not exist yet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error viewing source:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load file",
        variant: "destructive",
      })
    } finally {
      setLoadingFile(false)
    }
  }

  const handleViewFailureDetails = () => {
    setShowFailureDetails(true)
  }

  const handleBackToNER = () => {
    navigate("/dashboard/ner")
  }

  const handleSkipToETL = () => {
    localStorage.setItem("businesslogic", "skipped")
    navigate("/dashboard/etl")
  }

  const handleContinueToETL = () => {
    navigate("/dashboard/etl")
  }

  const activeRules = rules.filter((rule) => rule.status === "active")
  const testingRules = rules.filter((rule) => rule.status === "testing")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "testing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Filter failures based on selected rule
  const filteredFailures =
    filterRule === "all" ? validationFailures : validationFailures.filter((f) => f.ruleName === filterRule)

  return (
    <div className="max-w-7xl mt-14 mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Logic Rules</h1>
          <p className="text-muted-foreground">
            Define and manage custom business rules for data processing and validation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleRunAllRules}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Code className="w-4 h-4 mr-2" />
            Run All Rules
          </Button>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Rule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{activeRules.length}</p>
                <p className="text-xs text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{testingRules.length}</p>
                <p className="text-xs text-muted-foreground">Testing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600/10 rounded-full flex items-center justify-center">
                <Code className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{rules.length}</p>
                <p className="text-xs text-muted-foreground">Total Rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-chart-2/10 rounded-full flex items-center justify-center">
                <Code className="w-4 h-4 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold text-chart-2">
                  {rules.length > 0 && validationResults
                    ? Math.round(
                        (validationResults.passed / (validationResults.passed + validationResults.failed)) * 100,
                      ) + "%"
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Rules List */}
      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{rule.name}</span>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(rule.status)}`}>
                      {rule.status}
                    </Badge>
                  </CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditRule(rule)}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
              <CardDescription>{rule.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm font-mono">{rule.logic}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBackToNER}>
          <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
          Back
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSkipToETL}>
            <X className="w-4 h-4" />
            Skip
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleContinueToETL}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue to Data transformations
          </Button>
        </div>
      </div>

      {/* Add Rule Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Business Rule</DialogTitle>
            <DialogDescription>Create a new business logic rule for data processing</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                value={newRule.name || ""}
                onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rule name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newRule.description || ""}
                onChange={(e) => setNewRule((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this rule does"
              />
            </div>
            <div>
              <Label htmlFor="logic">Business Logic</Label>
              <Textarea
                id="logic"
                value={newRule.logic || ""}
                onChange={(e) => setNewRule((prev) => ({ ...prev, logic: e.target.value }))}
                placeholder="Enter the business logic (e.g., IF condition THEN action)"
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Add Rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Business Rule</DialogTitle>
            <DialogDescription>Modify the business logic rule configuration</DialogDescription>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Rule Name</Label>
                <Input
                  id="edit-name"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingRule.description}
                  onChange={(e) => setEditingRule((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                />
              </div>
              <div>
                <Label htmlFor="edit-logic">Business Logic</Label>
                <Textarea
                  id="edit-logic"
                  value={editingRule.logic}
                  onChange={(e) => setEditingRule((prev) => (prev ? { ...prev, logic: e.target.value } : null))}
                  rows={4}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveRule} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Run All Rules Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Rules Validation</DialogTitle>
            <DialogDescription>Running validation on all configured business logic rules</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {validationStatus === "running" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <p className="text-lg font-medium">Validating Business Rules...</p>
                  <p className="text-sm text-muted-foreground">Processing {rules.length} business logic rules</p>
                </div>
                <Progress value={validationProgress} className="w-full" />
                <p className="text-center text-sm text-muted-foreground">{validationProgress}% Complete</p>
              </div>
            )}
            {validationStatus === "success" && validationResults && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-success">Validation Complete!</h3>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">{validationResults.passed}</div>
                        <div className="text-sm text-muted-foreground">Rules Passed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-destructive">{validationResults.failed}</div>
                        <div className="text-sm text-muted-foreground">Rules Failed</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{validationResults.summary}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setShowValidationDialog(false)} className="flex-1">
                    Edit Business Rules
                  </Button>
                  {validationResults.failed > 0 && validationFailures.length > 0 && (
                    <Button
                      onClick={handleViewFailureDetails}
                      variant="outline"
                      className="flex-1 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      View Failed Rows
                    </Button>
                  )}
                  {validationResults.failed > 0 && (
                    <Button
                      onClick={handleViewSource}
                      disabled={loadingFile}
                      variant="outline"
                      className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      {loadingFile ? (
                        "Loading..."
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          View File
                        </>
                      )}
                    </Button>
                  )}
                  <Button onClick={handleContinueToETL} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue to Data Transformations
                  </Button>
                </div>
              </div>
            )}
            {validationStatus === "failed" && validationResults && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-destructive">Validation Failed!</h3>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{validationResults.summary}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowValidationDialog(false)} className="flex-1">
                    Edit Business Rules
                  </Button>
                  <Button
                    onClick={handleViewSource}
                    disabled={loadingFile}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    {loadingFile ? "Loading..." : "View File"}
                  </Button>
                  <Button
                    onClick={handleRunAllRules}
                    variant="outline"
                    className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Failure Details Dialog */}
      <Dialog open={showFailureDetails} onOpenChange={setShowFailureDetails}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Validation Failure Details</span>
            </DialogTitle>
            <DialogDescription>Detailed breakdown of rows where business rules failed validation</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filter by Rule */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <Label>Filter by Rule:</Label>
              <select
                value={filterRule}
                onChange={(e) => setFilterRule(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All Rules</option>
                {validationDetails &&
                  Object.keys(validationDetails).map((ruleName) => (
                    <option key={ruleName} value={ruleName}>
                      {ruleName}
                    </option>
                  ))}
              </select>
              <Badge variant="outline" className="ml-2">
                {filteredFailures.length} failed rows
              </Badge>
            </div>

            {/* Failure Summary by Rule */}
            {validationDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(validationDetails).map(([ruleName, details]) => (
                  <Card key={ruleName} className="border-red-200">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm truncate" title={ruleName}>
                          {ruleName}
                        </h4>
                        <Badge variant="destructive" className="text-xs">
                          {details.failed_count} failed
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>✅ {details.passed_count} passed</span>
                        <span>❌ {details.failed_count} failed</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Failed Rows Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-red-50 border-b sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium text-red-800">Row #</th>
                      <th className="text-left p-3 font-medium text-red-800">Rule</th>
                      <th className="text-left p-3 font-medium text-red-800">Reason</th>
                      <th className="text-left p-3 font-medium text-red-800">Data Values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFailures.length > 0 ? (
                      filteredFailures.map((failure, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-mono text-red-600">{failure.rowIndex + 1}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {failure.ruleName}
                            </Badge>
                          </td>
                          <td className="p-3 text-red-600">{failure.reason}</td>
                          <td className="p-3">
                            <div className="max-w-md overflow-x-auto">
                              <div className="flex flex-wrap gap-1">
                                {Object.entries(failure.values)
                                  .slice(0, 5)
                                  .map(([key, value]) => (
                                    <span
                                      key={key}
                                      className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
                                      title={`${key}: ${value}`}
                                    >
                                      <strong>{key}:</strong>&nbsp;{String(value).substring(0, 20)}
                                      {String(value).length > 20 && "..."}
                                    </span>
                                  ))}
                                {Object.keys(failure.values).length > 5 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{Object.keys(failure.values).length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No failed rows found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowFailureDetails(false)}>
                Close
              </Button>
              <Button
                onClick={handleViewSource}
                disabled={loadingFile}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                {loadingFile ? (
                  "Loading..."
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    View Complete Source File
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Source File Preview Dialog */}
      <Dialog open={showFilePreview} onOpenChange={setShowFilePreview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Source File Analysis</span>
            </DialogTitle>
            <DialogDescription>Complete source CSV file with highlighted validation failures</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="table" className="h-full">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="raw">Raw Content</TabsTrigger>
              <TabsTrigger value="failedRules">Failed Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="h-full">
              {csvHeaders.length > 0 && csvData.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[60vh] overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b sticky top-0">
                        <tr>
                          <th className="text-left p-2 font-medium border-r">Row #</th>
                          {csvHeaders.map((header, index) => (
                            <th key={index} className="text-left p-2 font-medium border-r min-w-24">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.map((row, rowIndex) => {
                          const hasFailure = validationFailures.some((f) => f.rowIndex === rowIndex)
                          return (
                            <tr
                              key={rowIndex}
                              className={`border-b hover:bg-gray-50 ${hasFailure ? "bg-red-50 border-red-200" : ""}`}
                            >
                              <td className={`p-2 font-mono border-r ${hasFailure ? "text-red-600 font-bold" : ""}`}>
                                {rowIndex + 1}
                                {hasFailure && <AlertTriangle className="w-3 h-3 inline ml-1 text-red-500" />}
                              </td>
                              {csvHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="p-2 border-r max-w-32 truncate" title={row[header]}>
                                  {row[header]}
                                </td>
                              ))}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-gray-50 border-t text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Total rows: {csvData.length}</span>
                      {validationFailures.length > 0 && (
                        <span className="text-red-600">
                          <AlertTriangle className="w-4 h-4 inline mr-1" />
                          {validationFailures.length} rows with validation failures (highlighted in red)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No CSV data to display. Please ensure the file is properly formatted.
                </div>
              )}
            </TabsContent>

            <TabsContent value="raw">
              <Textarea value={fileContent} readOnly className="font-mono text-sm min-h-[60vh] resize-none" />
            </TabsContent>

            <TabsContent value="failedRules">
              {failedRulesContent ? (
                <Textarea
                  value={failedRulesContent}
                  readOnly
                  className="font-mono text-sm min-h-[60vh] resize-none"
                  placeholder="No failed business rules content available"
                />
              ) : (
                <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
                  <p>No failed business rules data available. Click "View Source File" first.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
