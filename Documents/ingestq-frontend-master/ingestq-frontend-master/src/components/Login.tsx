// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";


// export default function Login() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Simple login simulation
//     if (email && password) {
//       localStorage.setItem("authenticated", "true");
//       localStorage.setItem("user", JSON.stringify({ name: "Demo User", email }));
      
//       toast({
//         title: "Login Successful",
//         description: "Welcome back!",
//       });
//       navigate("/dashboard");
//     } else {
//       toast({
//         title: "Login Failed",
//         description: "Please enter valid credentials",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle className="text-2xl text-center">Login</CardTitle>
//           <CardDescription className="text-center">
//             Enter your credentials to access your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="text-right">
//               <Button 
//                 variant="link" 
//                 className="p-0 text-primary font-medium" 
//                 onClick={() => navigate("/forgot-password")}
//               >
//                 Forgot Password?
//               </Button>
//             </div>
//             <Button onClick={handleLogin} className="w-full">
//               Login
//             </Button>
//             <div className="text-center text-sm">
//               <span className="text-muted-foreground">Don't have an account? </span>
//               <Button 
//                 variant="link" 
//                 className="p-0 text-primary font-medium" 
//                 onClick={() => navigate("/register")}
//               >
//                 Register
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/lib/api";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);


  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      // Save token and user data only if login succeeds
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
localStorage.setItem("userid", String(res.user.user_id));
      toast({
        title: "Login Successful",
        description: res.message,
      });

      navigate("/dashboard"); // Navigate only for registered users
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials or unregistered user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-right">
              <Button 
                variant="link" 
                className="p-0 text-primary font-medium" 
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 text-primary font-medium" 
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
