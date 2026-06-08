import { Navigate } from "react-router-dom";

export function Analytics() {
  // Since Dashboard serves as the main Analytics center for now, redirect there.
  return <Navigate to="/" replace />;
}
