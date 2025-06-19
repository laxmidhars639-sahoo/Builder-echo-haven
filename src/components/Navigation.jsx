import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const handleSectionClick = (sectionId) => {
    // If we're on the homepage, scroll to section
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If we're on another page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-aviation-blue rounded-lg p-2">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkyTraining</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleSectionClick("home")}
              className="text-gray-700 hover:text-aviation-blue transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleSectionClick("about")}
              className="text-gray-700 hover:text-aviation-blue transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => handleSectionClick("contact")}
              className="text-gray-700 hover:text-aviation-blue transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Login/Signup Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-aviation-blue"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-aviation-blue hover:bg-aviation-navy text-white">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
