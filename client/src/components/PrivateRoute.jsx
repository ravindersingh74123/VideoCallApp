// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { storage } from "../utils/storage";

export default function PrivateRoute({ children }) {
  const token = storage.getToken();
  const user = storage.getUser();

  if (!token || !user) {
    storage.clearAll();
    return <Navigate to="/login" replace />;
  }

  return children;
}
