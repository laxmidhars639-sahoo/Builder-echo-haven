import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Plane,
  BookOpen,
  Calendar,
  Settings,
  UserPlus,
  PlusCircle,
  Activity,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Shield,
} from "lucide-react";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for admin dashboard
  const stats = [
    {
      icon: Users,
      label: "Total Students",
      value: "156",
      change: "+12%",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: Plane,
      label: "Active Aircraft",
      value: "8",
      change: "+2",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: BookOpen,
      label: "Active Courses",
      value: "24",
      change: "+3",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: "$45,000",
      change: "+15%",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const recentStudents = [
    {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      course: "Private Pilot License",
      status: "Active",
      joinDate: "2024-01-15",
    },
    {
      name: "Mike Chen",
      email: "mike.chen@email.com",
      course: "Commercial Pilot License",
      status: "Active",
      joinDate: "2024-01-14",
    },
    {
      name: "Emma Davis",
      email: "emma.d@email.com",
      course: "Instrument Rating",
      status: "Pending",
      joinDate: "2024-01-13",
    },
  ];

  const upcomingLessons = [
    {
      student: "John Smith",
      instructor: "Capt. Wilson",
      aircraft: "N123AB",
      time: "09:00 AM",
      type: "Cross Country",
    },
    {
      student: "Lisa Brown",
      instructor: "Capt. Johnson",
      aircraft: "N456CD",
      time: "11:00 AM",
      type: "Pattern Work",
    },
    {
      student: "David Lee",
      instructor: "Capt. Miller",
      aircraft: "N789EF",
      time: "02:00 PM",
      type: "Instrument Training",
    },
  ];

  const menuItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "students", label: "Students", icon: Users },
    { id: "instructors", label: "Instructors", icon: Shield },
    { id: "aircraft", label: "Aircraft", icon: Plane },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Admin Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your pilot training academy
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button className="bg-aviation-blue hover:bg-aviation-navy text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Course
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <div className="w-64 flex-shrink-0">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === item.id
                            ? "bg-aviation-blue text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {stat.label}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                              <p
                                className={`text-sm ${stat.color} flex items-center mt-1`}
                              >
                                <TrendingUp className="h-4 w-4 mr-1" />
                                {stat.change}
                              </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                              <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Students */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Student Enrollments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentStudents.map((student, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {student.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {student.email}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {student.course}
                                </p>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    student.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {student.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">
                                  {student.joinDate}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          View All Students
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Today's Schedule */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Today's Flight Schedule</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {upcomingLessons.map((lesson, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {lesson.student}
                                </p>
                                <p className="text-sm text-gray-600">
                                  with {lesson.instructor}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {lesson.type} - {lesson.aircraft}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-aviation-blue">
                                  {lesson.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          View Full Schedule
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Other tab content placeholders */}
              {activeTab === "students" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Student Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Student Management System
                      </h3>
                      <p className="text-gray-500">
                        Manage student enrollments, progress, and certificates
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "instructors" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Instructor Management System
                      </h3>
                      <p className="text-gray-500">
                        Manage instructor schedules, certifications, and
                        assignments
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "aircraft" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aircraft Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Fleet Management System
                      </h3>
                      <p className="text-gray-500">
                        Manage aircraft maintenance, scheduling, and
                        availability
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "courses" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Course Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Course Management System
                      </h3>
                      <p className="text-gray-500">
                        Create and manage training programs, syllabi, and
                        curriculum
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "schedule" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        Schedule Management System
                      </h3>
                      <p className="text-gray-500">
                        Manage flight schedules, instructor assignments, and
                        aircraft bookings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "settings" && (
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        System Configuration
                      </h3>
                      <p className="text-gray-500">
                        Configure system settings, user permissions, and academy
                        preferences
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
