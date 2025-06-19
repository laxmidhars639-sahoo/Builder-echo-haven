import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subtitle: "Call us anytime",
    },
    {
      icon: Mail,
      title: "Email",
      details: "info@skytraining.com",
      subtitle: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "123 Aviation Blvd, Sky City, SC 12345",
      subtitle: "Main training facility",
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM",
      subtitle: "Flight training available daily",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your aviation journey? Contact us today to schedule a
            discovery flight or learn more about our training programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input placeholder="Enter your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input placeholder="Enter your last name" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input type="tel" placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Interest
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue">
                  <option>Select a program</option>
                  <option>Private Pilot License</option>
                  <option>Commercial Pilot License</option>
                  <option>Instrument Rating</option>
                  <option>Multi-Engine Rating</option>
                  <option>Flight Instructor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us about your aviation goals and any questions you have..."
                  className="min-h-[120px]"
                />
              </div>
              <Button className="w-full bg-aviation-blue hover:bg-aviation-navy text-white">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <Card
                key={index}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-aviation-blue/10 rounded-lg p-3">
                      <item.icon className="h-6 w-6 text-aviation-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.title}
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {item.details}
                      </p>
                      <p className="text-gray-600 text-sm">{item.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map placeholder */}
            <Card className="shadow-md">
              <CardContent className="p-0">
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      123 Aviation Blvd, Sky City, SC
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
