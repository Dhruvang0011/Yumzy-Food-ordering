import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default RoleGuard;