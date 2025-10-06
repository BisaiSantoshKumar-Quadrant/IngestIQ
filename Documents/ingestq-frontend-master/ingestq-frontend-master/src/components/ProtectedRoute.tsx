
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // For now, we'll assume the user is always authenticated
  // In a real app, you would check authentication status here
  return <>{children}</>;
}
