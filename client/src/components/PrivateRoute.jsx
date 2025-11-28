// PrivateRoute.jsx
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  const user = localStorage.getItem("user");
  if (user === "undefined" || user === "null") {
    localStorage.removeItem("user");
  }
  if (token === "undefined" || token === "null") {
    localStorage.removeItem("token");
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
