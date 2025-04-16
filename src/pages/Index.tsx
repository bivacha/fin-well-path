
import { Navigate } from "react-router-dom";

// Redirect to the onboarding page
const Index = () => {
  return <Navigate to="/roadmap" replace />;
};

export default Index;
