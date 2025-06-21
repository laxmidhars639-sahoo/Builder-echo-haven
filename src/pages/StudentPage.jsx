import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  Calendar,
  Plane,
  Activity,
} from "lucide-react";
import { coursesAPI, enrollmentAPI } from "@/utils/api";

const StudentPage = () => {
  const { user, enrollInCourse } = useUser();

  const [enrollmentData, setEnrollmentData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contactNumber: user?.phone || "",
    gender: "",
    paymentMode: "",
    installments: "",
    selectedCourse: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const data = await coursesAPI.getAll();

        if (data.status === "success") {
          setCourses(data.data.courses || []);
        } else {
          console.error("Failed to fetch courses:", data.message);
          // Fallback to sample data
          setCourses([
            {
              id: "1",
              title: "Private Pilot License (PPL)",
              duration: "6 months",
              price: 15000,
              description: "Learn to fly single-engine aircraft",
              level: "Beginner",
            },
            {
              id: "2",
              title: "Commercial Pilot License (CPL)",
              duration: "12 months",
              price: 25000,
              description: "Advanced training for commercial aviation",
              level: "Advanced",
            },
            {
              id: "3",
              title: "Instrument Rating (IR)",
              duration: "4 months",
              price: 10000,
              description: "Fly in all weather conditions",
              level: "Intermediate",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        // Fallback to sample data on error
        setCourses([
          {
            id: "1",
            title: "Private Pilot License (PPL)",
            duration: "6 months",
            price: 15000,
            description: "Learn to fly single-engine aircraft",
            level: "Beginner",
          },
          {
            id: "2",
            title: "Commercial Pilot License (CPL)",
            duration: "12 months",
            price: 25000,
            description: "Advanced training for commercial aviation",
            level: "Advanced",
          },
          {
            id: "3",
            title: "Instrument Rating (IR)",
            duration: "4 months",
            price: 10000,
            description: "Fly in all weather conditions",
            level: "Intermediate",
          },
        ]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const paymentModes = [
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "Check",
    "Cash",
  ];

  const installmentOptions = [
    "Direct Payment",
    "Within 3 months",
    "Within 6 months",
    "Within 8 months",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!enrollmentData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!enrollmentData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(enrollmentData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!enrollmentData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(enrollmentData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid contact number";
    }

    if (!enrollmentData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!enrollmentData.paymentMode) {
      newErrors.paymentMode = "Please select a payment mode";
    }

    if (!enrollmentData.installments) {
      newErrors.installments = "Please select an installment option";
    }

    if (!enrollmentData.selectedCourse) {
      newErrors.selectedCourse = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected course details
      const selectedCourse = courses.find(
        (c) => c.id === enrollmentData.selectedCourse,
      );

      // Prepare enrollment data for API
      const apiEnrollmentData = {
        courseId: enrollmentData.selectedCourse,
        studentName: enrollmentData.name,
        email: enrollmentData.email,
        phone: enrollmentData.contactNumber,
        gender: enrollmentData.gender,
        paymentMode: enrollmentData.paymentMode,
        installmentPlan: enrollmentData.installments,
      };

      // Make API call for enrollment
      const data = await enrollmentAPI.create(apiEnrollmentData);

      if (data.status === "success") {
        // Store enrollment in user context
        const enrollmentRecord = {
          id: data.data.enrollment.id || Date.now(),
          courseId: enrollmentData.selectedCourse,
          courseName: selectedCourse?.title,
          enrollmentDate: new Date().toISOString(),
          status: "enrolled",
          paymentMode: enrollmentData.paymentMode,
          installments: enrollmentData.installments,
          progress: 0,
        };

        enrollInCourse(enrollmentRecord);

        console.log("Enrollment successful:", data.data);
        alert(
          `Enrollment successful for ${selectedCourse?.title}! You will receive confirmation email shortly.`,
        );

        // Reset form but keep user data
        setEnrollmentData({
          name: user?.name || "",
          email: user?.email || "",
          contactNumber: user?.phone || "",
          gender: "",
          paymentMode: "",
          installments: "",
          selectedCourse: "",
        });
      } else {
        throw new Error(data.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      setErrors({
        general: error.message || "Enrollment failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />

      <main className="flex-1 pt-16">
        {/* Student Dashboard Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {user?.name || "Student"}!
                </h1>
                <p className="text-gray-600 mt-2">
                  Your pilot training journey starts here
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="border-aviation-blue text-aviation-blue hover:bg-aviation-blue hover:text-white"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    Student Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Flight Hours
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.flightHours || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Courses Enrolled
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.enrolledCourses?.length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificates
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.certificates || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Courses */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    setEnrollmentData((prev) => ({
                      ...prev,
                      selectedCourse: course.id,
                    }))
                  }
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="bg-aviation-blue/10 rounded-lg p-2">
                        <Plane className="h-6 w-6 text-aviation-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {course.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-aviation-blue">
                        {course.price}
                      </span>
                      <Button
                        size="sm"
                        className={`${
                          enrollmentData.selectedCourse === course.id
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-aviation-blue hover:bg-aviation-navy"
                        } text-white`}
                      >
                        {enrollmentData.selectedCourse === course.id
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Enrollment Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-3 text-aviation-blue" />
                Course Enrollment
              </CardTitle>
              <p className="text-gray-600">
                Fill in your details to enroll in your selected course
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEnrollmentSubmit} className="space-y-6">
                {/* Selected Course Display */}
                {enrollmentData.selectedCourse && (
                  <div className="bg-aviation-blue/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-aviation-blue">
                      Selected Course:
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {
                        courses.find(
                          (c) => c.id === enrollmentData.selectedCourse,
                        )?.title
                      }
                    </p>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      name="name"
                      value={enrollmentData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      value={enrollmentData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Contact Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="tel"
                      name="contactNumber"
                      value={enrollmentData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your contact number"
                      className={`pl-10 ${
                        errors.contactNumber ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                {/* Gender Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={enrollmentData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                {/* Payment Mode Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="paymentMode"
                      value={enrollmentData.paymentMode}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue ${
                        errors.paymentMode ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Payment Mode</option>
                      {paymentModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.paymentMode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.paymentMode}
                    </p>
                  )}
                </div>

                {/* Installments Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Plan *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="installments"
                      value={enrollmentData.installments}
                      onChange={handleInputChange}
                      className={`w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aviation-blue ${
                        errors.installments ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select Payment Plan</option>
                      {installmentOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.installments && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.installments}
                    </p>
                  )}
                </div>

                {/* Course Selection Error */}
                {errors.selectedCourse && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">
                      {errors.selectedCourse}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-aviation-blue hover:bg-aviation-navy text-white"
                >
                  {isSubmitting ? "Processing Enrollment..." : "Enroll Now"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentPage;
