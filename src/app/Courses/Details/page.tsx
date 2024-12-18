"use client";
import { useState } from "react";
import { Course } from "../../types/Course";

const CourseDetailsPage = ({ course, isGuest }: { course: Course, isGuest: boolean }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen d-flex justify-content-center align-items-center bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="card shadow-lg p-4 w-100 w-md-75 w-lg-50">
        <h1 className="card-title text-center text-black mb-4">{course.title}</h1>

        {/* Center the inner card */}
        {course && (
          <div 
            className="card-body d-flex flex-column align-items-center"
            style={{ fontFamily: 'CustomFont2, sans-serif' }}
          >
            {/* Course Info Section */}
            <div className="row mb-4 w-100">
              <div className="col-md-4 font-weight-bold text-black">Description:</div>
              <div className="col-md-8">{course.description || "N/A"}</div>
            </div>
            <div className="row mb-4 w-100">
              <div className="col-md-4 font-weight-bold text-black">Category:</div>
              <div className="col-md-8">{course.category}</div>
            </div>
            <div className="row mb-4 w-100">
              <div className="col-md-4 font-weight-bold text-black">Level:</div>
              <div className="col-md-8">{course.level}</div>
            </div>
            <div className="row mb-4 w-100">
              <div className="col-md-4 font-weight-bold text-black">Instructor:</div>
              <div className="col-md-8">{course.instructor_details[0].name || "Unassigned"}</div>
            </div>
            <div className="row mb-4 w-100">
              <div className="col-md-4 font-weight-bold text-black">Version:</div>
              <div className="col-md-8">{course.versionNumber}</div>
            </div>

            {/* Centered and Styled Enroll Button */}
            <div className="d-flex justify-content-center mt-4 w-100">
              {isGuest && <a href="/login"> <button
                className="btn btn-pink rounded-pill"
                type="button"
                
                style={{
                  backgroundColor: '#ec4899', // Pink color
                  color: '#fff',               // White text
                  border: 'none',              // Remove border
                  padding: '10px 30px',        // Add some padding
                  fontFamily: 'CustomFont2',    // Custom font
                }}
              >
                Login or Create an Account to enroll 
              </button>
              </a>
              }
              {!isGuest && <button
                className="btn btn-pink rounded-pill"
                type="button"
                style={{
                  backgroundColor: '#ec4899', // Pink color
                  color: '#fff',               // White text
                  border: 'none',              // Remove border
                  padding: '10px 30px',        // Add some padding
                  fontFamily: 'CustomFont2',    // Custom font
                }}
              >
                Enroll
              </button>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailsPage;
