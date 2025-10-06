import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/components/types/jobs";

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (job: Job) => void;
}

const jobCategories = [
  "Glue Jobs",
  "Lambda Jobs",
  "Batch Jobs",
  "ADF Jobs",
];

export default function CreateJobDialog({ open, onOpenChange, onSave }: CreateJobDialogProps) {
  const { toast } = useToast();
  const [jobName, setJobName] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSave = () => {
    if (!jobName || !jobCategory) {
      toast({
        title: "Error",
        description: "Job name and category are required.",
        variant: "destructive",
      });
      return;
    }

    const newJob: Job = {
      id: `job-${Date.now()}`,
      name: jobName,
      category: jobCategory,
      lastRun: new Date().toISOString(),
      status: "Pending",
      description: jobDescription,
      isConnected: false,
      pipelines: [],
      stages: [],
    };

    onSave(newJob);
    setJobName("");
    setJobCategory("");
    setJobDescription("");
    onOpenChange(false);
    toast({
      title: "Job Created",
      description: `${jobName} has been created successfully.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobName">Job Name</Label>
            <Input
              id="jobName"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobCategory">Category</Label>
            <Select value={jobCategory} onValueChange={setJobCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!jobName || !jobCategory}>
              Create Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}