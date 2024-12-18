"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Course, Instructor } from '../types/Course'; // Renamed to Instructor
import { FaBookOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import CourseDetailsPage from "../Courses/Details/page";
import InstructorDetailsPage from "./details";

const AllInstructorsPage = ({ isGuest }: { isGuest: boolean }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]); // Renamed to instructors
  const [guest, setGuest] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/instructors"); // Adjust URL as per API
        setInstructors(response.data);
      } catch (err) {
        setError("Failed to fetch instructors. Please try again later.");
      }
    };

    fetchInstructors();
  }, []);

  const handleCardClick = (instructor: Instructor) => setSelectedInstructor(instructor);


  return (
    <>
      <style>{`
        @font-face {
          font-family: 'CustomFont';
          src: url('/Bungee-Regular.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        @font-face {
          font-family: 'CustomFont2';
          src: url('/Fredoka.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        body {
          background-color: #31087b;
          background-image: url(svgurl);
          font-family: 'CustomFont', sans-serif;
          margin: 0;
          padding: 0;
          display: block;
          overflow-x: hidden;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans">
        {selectedInstructor ? (
          <div>
            <button
              onClick={() => setSelectedInstructor(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 space-x-2 transition-colors duration-300"
            >
              <FaBookOpen className="mr-2" />
              <span>Back to All Instructors</span>
            </button>
            <InstructorDetailsPage Instructor={selectedInstructor} isGuest={false}></InstructorDetailsPage>
            
            {/* Render selected instructor details */}
          
            </div>
    
        ) : (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-extrabold text-white bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-12 text-center mt-0">
              Explore Instructors
            </h1>

            {error ? (
              <p className="text-center text-red-600 text-xl">{error}</p>
            ) : instructors.length === 0 ? (
              <p className="text-center text-gray-600 text-xl">No instructors found</p>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.email} // Assuming email is unique for each instructor
                    className="col"
                    onClick={() => handleCardClick(instructor)}
                  >
                    <div className="card h-100 cursor-pointer">
                      {/* Instructor Image Placeholder */}
                      <div
                        className="card-img-top bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "200px" }}
                      >
                        <span className="text-gray-600 text-2xl font-bold opacity-50">
                          {instructor.role || "Instructor"}
                        </span>
                      </div>

                      {/* Instructor Details */}
                      <div className="card-body" style={{ fontFamily: 'CustomFont2, sans-serif' }}>
                        <h5 className="card-title text-dark">{instructor.name}</h5>
                        <p className="card-text">
                          <strong>Email:</strong> {instructor.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AllInstructorsPage;
