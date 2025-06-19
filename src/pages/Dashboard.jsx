import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import {
  User,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Plane,
  Settings,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useUser();

  const userType = user?.userType || "student";
  const userName = user?.name || "User";

  const studentStats = [
    {
      icon: Clock,
      label: "Flight Hours",
      value: user?.flightHours?.toString() || "0",
      color: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Courses Enrolled",
      value: user?.enrolledCourses?.length?.toString() || "0",
      color: "text-green-600",
    },
    {
      icon: Calendar,
      label: "Next Lesson",
      value: user?.enrolledCourses?.length > 0 ? "Tomorrow" : "Not Scheduled",
      color: "text-orange-600",
    },
    {
      icon: Award,
      label: "Certificates",
      value: user?.certificates?.toString() || "0",
      color: "text-purple-600",
    },
  ];

  const adminStats = [
    {
      icon: User,
      label: "Total Students",
      value: "156",
      color: "text-blue-600",
    },
    {
      icon: Plane,
      label: "Active Aircraft",
      value: "8",
      color: "text-green-600",
    },
    { icon: BookOpen, label: "Courses", value: "24", color: "text-orange-600" },
    {
      icon: Calendar,
      label: "Today's Lessons",
      value: "18",
      color: "text-purple-600",
    },
  ];

  const stats = userType === "student" ? studentStats : adminStats;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userName}!
                </h1>
                <p className="text-gray-600 capitalize">{userType} Dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userType === "student" ? (
                  <>
                    <Button className="w-full justify-start bg-aviation-blue hover:bg-aviation-navy">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Schedule a Lesson
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      View Flight Log
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-2" />
                      Track Progress
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full justify-start bg-aviation-blue hover:bg-aviation-navy">
                      <User className="h-4 w-4 mr-2" />
                      Manage Students
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plane className="h-4 w-4 mr-2" />
                      Aircraft Schedule
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Lessons
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userType === "student" ? (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <BookOpen className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Lesson Completed
                          </p>
                          <p className="text-xs text-gray-500">
                            Private Pilot Ground School - 2 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full p-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Flight Scheduled
                          </p>
                          <p className="text-xs text-gray-500">
                            Cross-country flight - Tomorrow 10:00 AM
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 rounded-full p-1">
                          <User className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            New Student Enrolled
                          </p>
                          <p className="text-xs text-gray-500">
                            Sarah Johnson - Private Pilot Course
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-orange-100 rounded-full p-1">
                          <Calendar className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Lesson Rescheduled
                          </p>
                          <p className="text-xs text-gray-500">
                            Aircraft maintenance - N123AB
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for more sections */}
          <div className="mt-8">
            <Card>
              <CardContent className="p-8">
                <div className="text-center text-gray-500">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Dashboard Under Construction
                  </h3>
                  <p className="text-sm">
                    More features coming soon! This is a preview of your{" "}
                    {userType} dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
