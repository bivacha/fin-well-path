
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const showBackButton = location.pathname !== "/";
  
  return (
    <header className="border-b bg-white p-4 sticky top-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button variant="ghost" size="icon" asChild>
              <Link to={location.pathname === "/hr-dashboard" ? "/" : location.pathname === "/roadmap" ? "/" : "/roadmap"}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <h1 className="text-xl font-semibold text-finpurple-dark">
            FinWell
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {location.pathname !== "/" && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {location.pathname !== "/hr-dashboard" && (
            <Button variant="outline" asChild>
              <Link to="/hr-dashboard">
                HR Dashboard
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
