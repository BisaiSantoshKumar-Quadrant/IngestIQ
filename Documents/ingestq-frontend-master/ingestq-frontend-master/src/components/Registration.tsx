// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";

// interface RegistrationProps {
//   showRegister: boolean;
//   setShowRegister: (value: boolean) => void;
// }

// export default function Registration({ showRegister, setShowRegister }: RegistrationProps) {
//   const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     if (registerData.name && registerData.email && registerData.password) {
//       localStorage.setItem("authenticated", "true");
//       localStorage.setItem(
//         "user",
//         JSON.stringify({ name: registerData.name, email: registerData.email })
//       );

//       setShowRegister(false);

//       toast({
//         title: "Registration successful",
//         description: "Welcome to IngestIQ!",
//       });

//       navigate("/dashboard/upload");
//     }
//   };

//   return (
//     <Dialog open={showRegister} onOpenChange={setShowRegister}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Create your account</DialogTitle>
//           <DialogDescription>Sign up to start using IngestIQ</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               placeholder="Your name"
//               value={registerData.name}
//               onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               value={registerData.email}
//               onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="********"
//               value={registerData.password}
//               onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
//             />
//           </div>
//           <Button onClick={handleRegister} className="w-full bg-primary hover:bg-primary/90">
//             Register
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RegistrationProps {
  showRegister: boolean;
  setShowRegister: (value: boolean) => void;
}

export default function Registration({ showRegister, setShowRegister }: RegistrationProps) {
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (registerData.name && registerData.email && registerData.password) {
      // Remap 'name' to 'username' to match backend expectations
      const payload = {
        full_name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      };

      try {
        const response = await fetch('https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          // Successful registration
          localStorage.setItem("authenticated", "true");
          localStorage.setItem(
            "user",
            JSON.stringify({ name: registerData.name, email: registerData.email })
          );

          setShowRegister(false);

          toast({
            title: "Registration successful",
            description: "Welcome to IngestIQ!",
          });

          navigate("/dashboard/upload");
        } else {
          // Handle error (e.g., 422)
          const errorData = await response.json();
          toast({
            title: "Registration failed",
            description: errorData.message || "Please check your details and try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Incomplete form",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={showRegister} onOpenChange={setShowRegister}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>Sign up to start using IngestIQ</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
          </div>
          <Button onClick={handleRegister} className="w-full bg-primary hover:bg-primary/90">
            Register
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}