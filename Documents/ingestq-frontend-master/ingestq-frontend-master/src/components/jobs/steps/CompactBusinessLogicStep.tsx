import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BusinessRule {
  id: string;
  name: string;
  logic: string;
  description: string;
}

interface CompactBusinessLogicStepProps {
  config?: Record<string, any>;
  onConfigChange?: (config: Record<string, any>) => void;
}

export default function CompactBusinessLogicStep({ config, onConfigChange }: CompactBusinessLogicStepProps) {
  const [rules, setRules] = useState<BusinessRule[]>(config?.rules || []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState<Partial<BusinessRule>>({});

  useEffect(() => {
    if (onConfigChange) {
      onConfigChange({ rules });
    }
  }, [rules]);

  const addRule = () => {
    if (newRule.name && newRule.logic) {
      const rule: BusinessRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: newRule.name!,
        logic: newRule.logic!,
        description: newRule.description || ''
      };
      setRules([...rules, rule]);
      setNewRule({});
      setIsAddDialogOpen(false);
    }
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Business Logic Rules
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Active Rules ({rules.length})</h4>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Business Rule</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      placeholder="Enter rule name"
                      value={newRule.name || ''}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleDescription">Description</Label>
                    <Textarea
                      id="ruleDescription"
                      placeholder="Describe what this rule does"
                      value={newRule.description || ''}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleLogic">Business Logic</Label>
                    <Textarea
                      id="ruleLogic"
                      placeholder="Enter the business logic (e.g., IF condition THEN action)"
                      value={newRule.logic || ''}
                      onChange={(e) => setNewRule({ ...newRule, logic: e.target.value })}
                      rows={4}
                    />
                  </div>
                  <Button onClick={addRule} className="w-full">Add Rule</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {rules.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {rules.map((rule, index) => (
                <div key={rule.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{rule.name}</span>
                        <Badge variant="outline" className="text-xs">Rule {index + 1}</Badge>
                      </div>
                      <div className="bg-muted p-2 rounded text-xs font-mono">
                        {rule.logic}
                      </div>
                      {rule.description && (
                        <p className="text-xs text-muted-foreground">{rule.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/50 rounded-lg">
              No business rules defined. Click "Add Rule" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}