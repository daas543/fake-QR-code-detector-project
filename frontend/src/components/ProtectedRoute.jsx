import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ message: "Please log in to access this page." }} />;
  }

  return children;
}

export default ProtectedRoute;
