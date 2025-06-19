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
  const [courses, setCourses] = useState([
    {
      id: "ppl",
      title: "Private Pilot License (PPL)",
      duration: "6-12 months",
      price: "$8,500",
      description: "Learn to fly single-engine aircraft for personal use",
      status: "active",
    },
    {
      id: "cpl",
      title: "Commercial Pilot License (CPL)",
      duration: "12-18 months",
      price: "$25,000",
      description: "Advance your skills for commercial aviation careers",
      status: "active",
    },
    {
      id: "instrument",
      title: "Instrument Rating (IR)",
      duration: "3-6 months",
      price: "$12,000",
      description: "Fly safely in all weather conditions",
      status: "active",
    },
  ]);

  const [students] = useState([
    {
      id: "STU001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      course: "Private Pilot License (PPL)",
      gender: "Female",
      paymentStatus: "Paid",
      accountDetails: "Active",
      enrollmentDate: "2024-01-15",
      phone: "+1 (555) 123-4567",
    },
    {
      id: "STU002",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      course: "Commercial Pilot License (CPL)",
      gender: "Male",
      paymentStatus: "Partial",
      accountDetails: "Active",
      enrollmentDate: "2024-01-14",
      phone: "+1 (555) 234-5678",
    },
    {
      id: "STU003",
      name: "Emma Davis",
      email: "emma.d@email.com",
      course: "Instrument Rating (IR)",
      gender: "Female",
      paymentStatus: "Pending",
      accountDetails: "Pending",
      enrollmentDate: "2024-01-13",
      phone: "+1 (555) 345-6789",
    },
    {
      id: "STU004",
      name: "John Smith",
      email: "john.smith@email.com",
      course: "Private Pilot License (PPL)",
      gender: "Male",
      paymentStatus: "Paid",
      accountDetails: "Active",
      enrollmentDate: "2024-01-12",
      phone: "+1 (555) 456-7890",
    },
    {
      id: "STU005",
      name: "Lisa Brown",
      email: "lisa.brown@email.com",
      course: "Commercial Pilot License (CPL)",
      gender: "Female",
      paymentStatus: "Paid",
      accountDetails: "Active",
      enrollmentDate: "2024-01-11",
      phone: "+1 (555) 567-8901",
    },
  ]);

  const [newCourse, setNewCourse] = useState({
    title: "",
    duration: "",
    price: "",
    description: "",
    status: "active",
  });
  const [editingCourse, setEditingCourse] = useState(null);

  const handleAddCourse = () => {
    if (newCourse.title && newCourse.duration && newCourse.price) {
      const courseId = newCourse.title.toLowerCase().replace(/\s+/g, "-");
      setCourses([...courses, { ...newCourse, id: courseId }]);
      setNewCourse({
        title: "",
        duration: "",
        price: "",
        description: "",
        status: "active",
      });
      alert("Course added successfully!");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setNewCourse(course);
  };

  const handleUpdateCourse = () => {
    setCourses(
      courses.map((course) =>
        course.id === editingCourse.id ? newCourse : course,
      ),
    );
    setEditingCourse(null);
    setNewCourse({
      title: "",
      duration: "",
      price: "",
      description: "",
      status: "active",
    });
    alert("Course updated successfully!");
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== courseId));
      alert("Course deleted successfully!");
    }
  };

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
    { id: "students", label: "List of Students", icon: Users },
    { id: "configure", label: "Configure Page", icon: Settings },
    { id: "tasks", label: "Manage Task", icon: BookOpen },
    { id: "aircraft", label: "Aircraft", icon: Plane },
    { id: "schedule", label: "Schedule", icon: Calendar },
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

              {/* Students List Section */}
              {activeTab === "students" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-6 w-6 mr-3 text-aviation-blue" />
                        List of Students
                      </CardTitle>
                      <p className="text-gray-600">
                        Manage all student enrollments and data
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Student Name
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Student ID
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Course Name
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Gender
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Payment Status
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Account Details
                              </th>
                              <th className="text-left p-4 font-semibold text-gray-900">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student, index) => (
                              <tr
                                key={student.id}
                                className="border-b hover:bg-gray-50"
                              >
                                <td className="p-4">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {student.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {student.email}
                                    </p>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                    {student.id}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <p className="text-gray-900">
                                    {student.course}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <p className="text-gray-900">
                                    {student.gender}
                                  </p>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                      student.paymentStatus === "Paid"
                                        ? "bg-green-100 text-green-800"
                                        : student.paymentStatus === "Partial"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {student.paymentStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                      student.accountDetails === "Active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {student.accountDetails}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      Edit
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Configure Page Section */}
              {activeTab === "configure" && (
                <div className="space-y-6">
                  {/* Add/Edit Course Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="h-6 w-6 mr-3 text-aviation-blue" />
                        {editingCourse ? "Edit Course" : "Add New Course"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course Title
                          </label>
                          <Input
                            value={newCourse.title}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                title: e.target.value,
                              })
                            }
                            placeholder="Enter course title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <Input
                            value={newCourse.duration}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                duration: e.target.value,
                              })
                            }
                            placeholder="e.g., 6-12 months"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price
                          </label>
                          <Input
                            value={newCourse.price}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                price: e.target.value,
                              })
                            }
                            placeholder="e.g., $8,500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={newCourse.status}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                status: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={newCourse.description}
                            onChange={(e) =>
                              setNewCourse({
                                ...newCourse,
                                description: e.target.value,
                              })
                            }
                            placeholder="Enter course description"
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-6">
                        {editingCourse ? (
                          <>
                            <Button
                              onClick={handleUpdateCourse}
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Update Course
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingCourse(null);
                                setNewCourse({
                                  title: "",
                                  duration: "",
                                  price: "",
                                  description: "",
                                  status: "active",
                                });
                              }}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button
                            onClick={handleAddCourse}
                            className="bg-aviation-blue hover:bg-aviation-navy text-white"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Course
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Existing Courses List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Existing Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4">
                        {courses.map((course) => (
                          <div
                            key={course.id}
                            className="border rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {course.title}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                  {course.description}
                                </p>
                                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                                  <span>Duration: {course.duration}</span>
                                  <span>Price: {course.price}</span>
                                  <span
                                    className={`px-2 py-1 rounded ${
                                      course.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {course.status}
                                  </span>
                                </div>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditCourse(course)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Manage Task Section */}
              {activeTab === "tasks" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-6 w-6 mr-3 text-aviation-blue" />
                        Manage Task
                      </CardTitle>
                      <p className="text-gray-600">
                        Manage administrative tasks and operations
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Task Cards */}
                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <Users className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Student Progress Review
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Review and update student progress reports
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Start Review
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <Calendar className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Schedule Management
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Organize flight schedules and instructor
                              assignments
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Manage Schedule
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <Award className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Certificate Processing
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Process and issue student certificates
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Process Certificates
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <DollarSign className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Payment Processing
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Handle student payments and billing
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Process Payments
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <Plane className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Aircraft Maintenance
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Schedule and track aircraft maintenance
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              View Maintenance
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-aviation-blue transition-colors cursor-pointer">
                          <CardContent className="p-6 text-center">
                            <TrendingUp className="h-12 w-12 text-aviation-blue mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Performance Reports
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              Generate academy performance reports
                            </p>
                            <Button
                              size="sm"
                              className="bg-aviation-blue hover:bg-aviation-navy text-white"
                            >
                              Generate Reports
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
