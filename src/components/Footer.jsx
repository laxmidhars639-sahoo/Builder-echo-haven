import { Plane, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-aviation-blue rounded-lg p-2">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SkyTraining</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your premier destination for professional pilot training. Building
              aviation careers since 1998.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-aviation-blue cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-aviation-blue cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-aviation-blue cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-aviation-blue cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Training Programs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Training Programs</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Private Pilot License
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Commercial Pilot License
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Instrument Rating
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Multi-Engine Rating
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Flight Instructor
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Airline Transport Pilot
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                About Us
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Our Fleet
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Instructors
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Student Resources
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Safety
              </li>
              <li className="hover:text-aviation-blue cursor-pointer transition-colors">
                Careers
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-gray-300">
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm">
                  123 Aviation Blvd
                  <br />
                  Sky City, SC 12345
                </p>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm">info@skytraining.com</p>
              </div>
              <div>
                <p className="font-medium">Hours</p>
                <p className="text-sm">
                  Mon-Fri: 8AM-8PM
                  <br />
                  Sat-Sun: 9AM-5PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} SkyTraining. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span className="hover:text-aviation-blue cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-aviation-blue cursor-pointer transition-colors">
                Terms of Service
              </span>
              <span className="hover:text-aviation-blue cursor-pointer transition-colors">
                Cookie Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
