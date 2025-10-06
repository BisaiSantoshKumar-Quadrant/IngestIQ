import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, X } from "lucide-react";
import type { Job } from "@/components/types/jobs";
import type { Pipeline } from "@/components/types/pipeline";

interface PipelineDetailsDialogProps {
  job: Job;
  pipelines: Pipeline[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditPipeline: (pipeline: Pipeline) => void;
  onDeletePipeline: (pipelineId: string) => void;
}

export default function PipelineDetailsDialog({ job, pipelines, open, onOpenChange, onEditPipeline, onDeletePipeline }: PipelineDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pipelines for {job.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {pipelines.length === 0 ? (
            <p className="text-muted-foreground">No pipelines associated with this job.</p>
          ) : (
            pipelines.map((pipeline) => (
              <div key={pipeline.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">{pipeline.name}</h4>
                  <p className="text-xs text-muted-foreground">Created: {pipeline.createdAt} • {pipeline.jobs.length} jobs</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditPipeline(pipeline)}
                    title="Edit Pipeline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" title="Delete Pipeline">
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Pipeline?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{pipeline.name}" and disconnect it from all jobs. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeletePipeline(pipeline.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}