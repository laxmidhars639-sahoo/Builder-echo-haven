import { useState } from "react";
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
} from "lucide-react";

const StudentPage = () => {
  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    gender: "",
    paymentMode: "",
    installments: "",
    selectedCourse: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample courses data
  const courses = [
    {
      id: "ppl",
      title: "Private Pilot License (PPL)",
      duration: "6-12 months",
      price: "$8,500",
      description: "Learn to fly single-engine aircraft for personal use",
    },
    {
      id: "cpl",
      title: "Commercial Pilot License (CPL)",
      duration: "12-18 months",
      price: "$25,000",
      description: "Advance your skills for commercial aviation careers",
    },
    {
      id: "instrument",
      title: "Instrument Rating (IR)",
      duration: "3-6 months",
      price: "$12,000",
      description: "Fly safely in all weather conditions",
    },
  ];

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Enrollment data:", enrollmentData);
      alert(
        "Enrollment successful! You will receive confirmation email shortly.",
      );
      // Reset form
      setEnrollmentData({
        name: "",
        email: "",
        contactNumber: "",
        gender: "",
        paymentMode: "",
        installments: "",
        selectedCourse: "",
      });
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed. Please try again.");
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
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Student Portal
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome to your pilot training journey
              </p>
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
                    <p className="text-2xl font-bold text-gray-900">0</p>
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
                    <p className="text-2xl font-bold text-gray-900">0</p>
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
                    <p className="text-2xl font-bold text-gray-900">0</p>
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
