import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-16 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Master the Skies with{" "}
              <span className="text-aviation-blue">Professional</span> Pilot
              Training
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of successful pilots who started their journey with
              SkyTraining. From private pilot licenses to commercial aviation,
              we provide world-class training with experienced instructors and
              modern aircraft.
            </p>

            {/* Features List */}
            <div className="space-y-3">
              {[
                "FAA Certified Training Programs",
                "Modern Fleet of Training Aircraft",
                "Experienced CFI Instructors",
                "Flexible Scheduling Options",
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-aviation-blue hover:bg-aviation-navy text-white px-8"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white"
              >
                Schedule Discovery Flight
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Pilot in cockpit"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-aviation-blue/20 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
