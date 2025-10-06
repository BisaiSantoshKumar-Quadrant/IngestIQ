import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sentResetCode, setSentResetCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Simulate sending reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentResetCode(code);
      setIsCodeSent(true);
      toast({
        title: "Reset Code Sent",
        description: `A reset code has been sent to ${email}.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode === sentResetCode && newPassword) {
      // Simulate password reset
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated.",
      });
      navigate("/login");
    } else {
      toast({
        title: "Error",
        description: "Invalid reset code or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            {isCodeSent 
              ? "Enter the reset code and your new password" 
              : "Enter your email to receive a password reset code"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCodeSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button onClick={handleSendResetCode} className="w-full">
                Send Reset Code
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-code">Reset Code</Label>
                <Input
                  id="reset-code"
                  placeholder="Enter 6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <Button onClick={handleResetPassword} className="w-full">
                Reset Password
              </Button>
            </div>
          )}
          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Remember your password? </span>
            <Button 
              variant="link" 
              className="p-0 text-primary font-medium" 
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}