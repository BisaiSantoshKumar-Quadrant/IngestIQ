import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ScheduleConfig {
  scheduleType: "time" | "file";
  frequency?: string;
  time?: string;
}

interface ScheduleStepProps {
  job: { id: string; name: string } | null;
  onConfigChange: (config: ScheduleConfig) => void;
}

export default function ScheduleStep({ job, onConfigChange }: ScheduleStepProps) {
  const [scheduleType, setScheduleType] = useState<"time" | "file">("time");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");

  // Load schedule details from localStorage on mount
  useEffect(() => {
    const storedScheduleType = localStorage.getItem("scheduleType") || "time";
    const storedFrequency = localStorage.getItem("frequency") || "";
    const storedTime = localStorage.getItem("time") || "";
    
    setScheduleType(storedScheduleType as "time" | "file");
    setFrequency(storedFrequency);
    setTime(storedTime);
  }, []);

  // Pass config to parent whenever it changes
  useEffect(() => {
    onConfigChange({
      scheduleType,
      frequency: scheduleType === "time" ? frequency : undefined,
      time: scheduleType === "time" ? time : undefined,
    });
  }, [scheduleType, frequency, time, onConfigChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mt-14 mx-auto p-6">
        <div className="flex items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Schedule Job</h1>
            <p className="text-muted-foreground">
              Configure when and how your job should run
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardDescription>
                Choose how you want to trigger your job execution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trigger Type Selection */}
              <RadioGroup
                value={scheduleType}
                onValueChange={(value: "time" | "file") => setScheduleType(value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="time" id="time-based" />
                  <Label
                    htmlFor="time-based"
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Time-based Schedule
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file-based" />
                  <Label
                    htmlFor="file-based"
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    File Upload Trigger
                  </Label>
                </div>
              </RadioGroup>

              {/* Time-based Config */}
              {scheduleType === "time" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* File-based Config */}
              {scheduleType === "file" && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    The job will be triggered when a newer version of the
                    selected source file is received.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}