'use client';
//import { useState } from "react";
import { Course } from "../types/Course";
//import axios from "axios";

const StudentDetailsPage = ({ course }: { course: Course }) => {
  //const [loading, setLoading] = useState(false);
 // const [error, setError] = useState<string | null>(null);
 // const [message, setMessage] = useState<string | null>(null);
 // const [red, setRed] = useState<boolean | null>(null);

  return (
    <div className="container py-5">
      <div className="card shadow-lg">
        {/* Header Section */}
        <div className="card-header bg-primary text-white text-center py-4">
          <h1 className="h3" style={{ fontFamily: "CustomFont, sans-serif" }}>
            {course.title}
          </h1>
        </div>

        {/* Content Section */}
        <div className="card-body">
          {/* Description Section */}
          <div className="mb-4">
            <h2 className="h5">DESCRIPTION</h2>
            <p style={{ fontFamily: "CustomFont2" }} className="text-muted">
              {course.description || "No description available"}
            </p>
          </div>

          {/* Category Section */}
          <div className="mb-4">
            <h2 className="h5">CATEGORY</h2>
            <p style={{ fontFamily: "CustomFont2" }} className="text-muted">
              {course.category}
            </p>
          </div>

          {/* Course Details Section */}
          <div className="mb-4">
            <h2 className="h5">COURSE DETAILS</h2>
            <div className="row">
              <div className="col-md-6 mb-3">
                <h3 className="h6">LEVEL</h3>
                <p style={{ fontFamily: "CustomFont2" }} className="text-muted">
                  {course.level}
                </p>
              </div>
              <div className="col-md-6 mb-3">
                <h3 className="h6">VERSION</h3>
                <p style={{ fontFamily: "CustomFont2" }} className="text-muted">
                  {course.versionNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="mb-4">
            <h2 className="h5">KEYWORDS</h2>
            <div className="d-flex flex-wrap gap-2">
              {course.keywords.map((keyword, index) => (
                <span
                  key={index}
                  style={{ fontFamily: "CustomFont2" }}
                  className="badge bg-primary text-white"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Modules Section */}
          <div className="mb-4">
            <h2 className="h5">MODULES</h2>
            <p style={{ fontFamily: "CustomFont2" }} className="text-muted">
              Module goes here
            </p>
          </div>

          {/* Message Box */}
          {/* {message && (
            <div
              className={`alert ${red ? "alert-danger" : "alert-success"} mt-4`}
              role="alert"
            >
              {message}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
