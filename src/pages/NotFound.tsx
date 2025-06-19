import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="bg-aviation-blue/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Plane className="h-12 w-12 text-aviation-blue" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Flight Path Not Found
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Looks like this page has taken an unexpected route. Let's get you
              back on course!
            </p>
            <Link to="/">
              <Button
                size="lg"
                className="bg-aviation-blue hover:bg-aviation-navy text-white"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Home Base
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
