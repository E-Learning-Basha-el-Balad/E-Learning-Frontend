'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Types } from 'mongoose';
import { Course } from "../types/Course";
import InstructorDetailsPage from "./InstructorCourseDetails";
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gpa: number;
  enrolledCourses: Types.ObjectId[];
  createdCourses: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  gpa: number;
  enrolledCourses: Types.ObjectId[];
  createdAt: string;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'performance' | 'chat' | 'forms' | 'students'>('courses');
  const [userData, setUserData] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchCourses, setSearchCourses] = useState<Course[]>([]);
  const [searchStudents, setSearchStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  const handleCardClick = (course: Course) => setSelectedCourse(course);

  const handleButtonClick = (tab: 'courses' | 'performance' | 'chat' | 'forms' | 'students') => {
    setActiveTab(tab);
  };

  const setUser = (newUser: User) => {
    setUserData(newUser);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/userData", { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error: unknown) {
        if(error instanceof Error)
          console.log(error.message);
        // if (error.response?.status === 401) {
        //   return;
        // }
        // console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses/mycourses", { withCredentials: true });
        setCourses(response.data);
        setSearchCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/students", { withCredentials: true });
        setStudents(response.data);
        setSearchStudents(response.data)
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
    };

    fetchData();
    fetchCourses();
    fetchStudents();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (activeTab === 'courses') {
      const filteredCourses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
      setSearchCourses(filteredCourses);
    } else if (activeTab === 'students') {
      const filteredStudents = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query)
      );
      setSearchStudents(filteredStudents);
    }
  };

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
          background-color: white; 
          font-family: 'CustomFont', sans-serif;
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: flex-start; 
          align-items: flex-start;
          overflow-x: hidden; 
        }
        .sidebar {
          background-color: #31087b;
          color: white;
          font-family: 'CustomFont';
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 250px;
          height: 100vh;
          padding-top: 20px;
          position: fixed;
          top: 0;
          z-index: 50;
        }
        .sidebar .nav-item {
          margin-bottom: 15px;
        }
        .sidebar button {
          background: transparent;
          color: white;
          border: none;
          padding: 12px;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        .sidebar button:hover {
          background-color: #007bff;
        }
        .sidebar button.active {
          background-color: #007bff;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
          margin-left: -50px;
          margin-top: -80px;
        }
        .logo img {
          width: 250px;
          height: 250px;
          display: block;
          margin: 0 auto;
        }
        .profile {
          padding: 10px;
          text-align: center;
          background-color: #400D97;
          margin-bottom: 20px;
          margin-top: -60px;
        }
        .profile .profile-icon {
            margin-top: -15px;
          font-size: 35px;
          color: white;
        }
        .profile .profile-info {
          margin-top: 0px;
          color: white;
          font-size: 12px;
        }
        .profile .profile-name {
          font-weight: bold;
          font-size: 16px;
        }
        .profile .profile-email {
          font-size: 12px;
          color: #bbb;
        }
        .content {
          margin-left: 250px; 
          padding: 20px;
          width: calc(100% - 250px); 
          overflow-x: hidden; 
        }

        .course-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .course-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .course-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .course-description {
          font-size: 14px;
          color: #555;
        }

        .course-keywords {
          margin-top: 10px;
          font-size: 12px;
          color: #777;
        }

        .search-input {
          margin-bottom: 20px;
          padding: 10px;
          width: 100%;
          font-size: 16px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .details-container {
          margin-left: 250px;
          min-height: 100vh;
          width: calc(100% - 250px);
          background-color: white;
        }

        .back-button-container {
          position: fixed;
          top: 20px;
          left: 270px;
          z-index: 40;
        }

        .student-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .student-card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .student-name {
          font-size: 18px;
          font-weight: bold;
        }

        .student-email {
          font-size: 14px;
          color: #555;
        }

        .student-gpa {
          font-size: 14px;
          color: #777;
        }
      `}</style>
      <div className="sidebar">
        
          <img src="/AA.png" alt="Logo" />
        
        {userData && (
          <div className="profile">
            <div className="profile-icon">
              <FaUserCircle />
            </div>
            <div className="profile-info">
              <div className="profile-name">{userData.name}</div>
              <div className="profile-email">{userData.email}</div>
            </div>
          </div>
        )}
        <div className="nav flex-column">
          <div className="nav-item">
            <button
              onClick={() => handleButtonClick('courses')}
              className={activeTab === 'courses' ? 'active' : ''}
            >
              Manage Courses
            </button>
          </div>
          <div className="nav-item">
            <button
              onClick={() => handleButtonClick('performance')}
              className={activeTab === 'performance' ? 'active' : ''}
            >
              Performance Tracking
            </button>
          </div>
          <div className="nav-item">
            <button
              onClick={() => handleButtonClick('forms')}
              className={activeTab === 'forms' ? 'active' : ''}
            >
              Forms
            </button>
          </div>
          <div className="nav-item">
            <button
              onClick={() => handleButtonClick('students')}
              className={activeTab === 'students' ? 'active' : ''}
            >
              Students
            </button>
          </div>
          <div className="nav-item">
            <button
              onClick={() => handleButtonClick('chat')}
              className={activeTab === 'chat' ? 'active' : ''}
            >
              Chats
            </button>
          </div>
        </div>
      </div>
      {selectedCourse ? (
        <div className="details-container">
          <div className="back-button-container">
            <button
              onClick={() => setSelectedCourse(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 space-x-2 transition-colors duration-300 bg-white px-4 py-2 rounded-lg shadow-md"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to All Courses</span>
            </button>
          </div>
          <InstructorDetailsPage course={selectedCourse} />
        </div>
      ) : (
        <div className="content">
          {activeTab === 'courses' && (
            <>
              <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search courses..."
              />
              <div className="course-container">
                {searchCourses.map((course) => (
                  <div key={course._id} onClick={() => handleCardClick(course)} className="course-card">
                    <div className="course-title">{course.title}</div>
                    <div className="course-version">Version: {course.versionNumber}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === 'students' && (
            <>
          <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search students..."
          />
            <div className="student-container">
              {searchStudents.map((student) => (
                <div key={student._id} className="student-card">
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                  <div className="student-gpa">GPA: {student.gpa}</div>
                </div>
              ))}
            </div>
            </>
          )}
          
          {activeTab === 'chat' && <div>Chat content goes here</div>}
        </div>
      )}
    </>
  );
};

export default Dashboard;
