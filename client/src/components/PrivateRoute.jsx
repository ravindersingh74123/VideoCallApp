// PrivateRoute.jsx
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Fix corrupted storage
  const storedUser = localStorage.getItem("user");
  if (storedUser === "undefined" || storedUser === "null") {
    localStorage.removeItem("user");
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
