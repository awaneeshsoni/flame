import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return !user ? children : <Navigate to="/dashboard" />;
}
