import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Clock, MapPin } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Students Trained", value: "2,500+" },
    { icon: Award, label: "Success Rate", value: "98%" },
    { icon: Clock, label: "Flight Hours", value: "50,000+" },
    { icon: MapPin, label: "Training Locations", value: "12" },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About SkyTraining
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            With over 25 years of excellence in aviation training, we've helped
            thousands of aspiring pilots achieve their dreams and build
            successful careers in aviation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Trusted Partner in Aviation Excellence
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Founded in 1998, SkyTraining has established itself as one of the
              premier flight training academies in the country. Our commitment
              to safety, professionalism, and student success has made us the
              preferred choice for aspiring pilots worldwide.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We offer comprehensive training programs from private pilot
              certificates to airline transport pilot licenses, utilizing the
              latest technology and training methodologies to ensure our
              students receive the highest quality education.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-aviation-blue/10 rounded-full p-2 mt-1">
                  <Award className="h-5 w-5 text-aviation-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">FAA Certified</h4>
                  <p className="text-gray-600">
                    Part 61 and Part 141 approved training programs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-aviation-blue/10 rounded-full p-2 mt-1">
                  <Users className="h-5 w-5 text-aviation-blue" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Expert Instructors
                  </h4>
                  <p className="text-gray-600">
                    Experienced CFIs with airline and military backgrounds
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Aircraft hangar"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 border-none shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-0">
                <div className="bg-aviation-blue/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-aviation-blue" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
