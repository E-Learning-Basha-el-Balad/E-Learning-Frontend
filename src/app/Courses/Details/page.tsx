"use client";
import { useState, useEffect } from "react";
import fetcher from "../../utils/fetcher";
import { Course } from "../../types/Course";

const CourseDetailsPage = ({ courseIdInput }: { courseIdInput: string }) => {
  const [course, setCourse] = useState<Course | null>(null); // State for the course details
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch course details when courseIdInput changes
  const fetchCourseDetails = async () => {
    if (!courseIdInput) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch course details from the backend
      const data = await fetcher(
        `http://localhost:3000/courses/${courseIdInput}`,
        { method: "GET" }
      );
      setCourse(data); // Set the fetched course details
    } catch (err) {
      setError("Failed to fetch course details");
    } finally {
      setLoading(false);
    }
  };

  // Automatically fetch details when the component is mounted or courseIdInput changes
  useEffect(() => {
    fetchCourseDetails();
  }, [courseIdInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
      <div className="p-8 bg-white shadow-xl rounded-lg w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">
          Course Details
        </h1>

        {/* Loading or error message */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Display Course Details if available */}
        {course && (
          <div className="mt-6 bg-gray-50 p-6 shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-black">
              {course.title}
            </h1>
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left border-b">Field</th>
                  <th className="px-4 py-2 text-left border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b">Title</td>
                  <td className="px-4 py-2 border-b">
                    {course.title || "N/A"}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b">Description</td>
                  <td className="px-4 py-2 border-b">
                    {course.description || "N/A"}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 border-b">Category</td>
                  <td className="px-4 py-2 border-b">{course.category}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b">Level</td>
                  <td className="px-4 py-2 border-b">{course.level}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 border-b">Instructor</td>
                  <td className="px-4 py-2 border-b">
                    {course.userId || "Unassigned"}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 border-b">Version</td>
                  <td className="px-4 py-2 border-b">{course.versionNumber}</td>
                </tr>
              </tbody>
            </table>

            <h2 className="mt-6 text-xl font-semibold text-black">
              Enrolled Students
            </h2>
            {course.students && course.students.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-black">
                {course.students.map((studentId, index) => (
                  <li key={index}>{studentId}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-600">No students enrolled yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
