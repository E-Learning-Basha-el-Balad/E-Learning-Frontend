"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Course } from "../../types/Course";
import CourseDetailsPage from "../Details/page";
import { FaTrash, FaEdit, FaUserPlus, FaBookOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [role, setRole] = useState<string>(""); 
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses/Allcourses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/userData", { withCredentials: true });
        setRole(response.data.role);
      } catch {
        setRole("");
      }
    };

    fetchCourses();
    fetchUserRole();
  }, []);

  const handleCardClick = (courseId: string) => setSelectedCourseId(courseId);

  const handleDelete = async (courseId: string) => {
    try {
      await axios.delete(`http://localhost:3000/courses/delete/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
      alert("Course deleted successfully!");
    } catch (error) {
      alert("Failed to delete course.");
    }
  };

  const handleUpdate = (courseId: string) => router.push(`/courses/update/${courseId}`);
  const handleEnrollStudents = (courseId: string) => router.push(`/courses/Enroll/${courseId}`);

  // Color mapping for course categories
  const categoryColors = {
    default: "bg-gradient-to-br from-indigo-50 to-purple-50",
    Technology: "bg-gradient-to-br from-blue-50 to-cyan-50",
    Business: "bg-gradient-to-br from-green-50 to-teal-50",
    Design: "bg-gradient-to-br from-pink-50 to-rose-50",
    Language: "bg-gradient-to-br from-yellow-50 to-amber-50"
  };

  const getCategoryBackground = (category?: string) => {
    return categoryColors[category as keyof typeof categoryColors] || categoryColors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans">
      {selectedCourseId ? (
        <div>
          <button
            onClick={() => setSelectedCourseId(null)}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 space-x-2 transition-colors duration-300"
          >
            <FaBookOpen className="mr-2" />
            <span>Back to All Courses</span>
          </button>
          <CourseDetailsPage courseIdInput={selectedCourseId} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 text-center">
            Explore Courses
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse w-16 h-16 bg-indigo-500 rounded-full"></div>
            </div>
          ) : error ? (
            <p className="text-center text-red-600 text-xl">{error}</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-600 text-xl">No courses found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  onClick={() => handleCardClick(course._id)}
                  className="group cursor-pointer"
                >
                  <div className={`
                    ${getCategoryBackground(course.category)}
                    rounded-2xl 
                    shadow-lg 
                    overflow-hidden 
                    transform 
                    transition-all 
                    duration-300 
                    hover:-translate-y-3 
                    hover:shadow-2xl 
                    border-2 border-transparent 
                    hover:border-indigo-200
                  `}>
                    {/* Course Image Placeholder */}
                    <div className="h-48 bg-white/30 flex items-center justify-center">
                      <span className="text-gray-600 text-2xl font-bold opacity-50">
                        {course.category || "Course"}
                      </span>
                    </div>

                    {/* Course Details */}
                    <div className="p-6 bg-white/80 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 mb-2 flex items-center">
                        <span className="font-semibold mr-2">Instructor:</span> 
                        {course.userId || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {course.created_at ? new Date(course.created_at).toLocaleDateString() : "Recently"}
                      </p>
                    </div>

                    {/* Instructor Actions */}
                    {role === "instructor" && (
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(course._id);
                          }}
                          className="bg-red-500/20 p-2 rounded-full hover:bg-red-500/40 transition-colors"
                          title="Delete Course"
                        >
                          <FaTrash size={18} className="text-red-600" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(course._id);
                          }}
                          className="bg-blue-500/20 p-2 rounded-full hover:bg-blue-500/40 transition-colors"
                          title="Edit Course"
                        >
                          <FaEdit size={18} className="text-blue-600" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollStudents(course._id);
                          }}
                          className="bg-green-500/20 p-2 rounded-full hover:bg-green-500/40 transition-colors"
                          title="Enroll Students"
                        >
                          <FaUserPlus size={18} className="text-green-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCoursesPage;