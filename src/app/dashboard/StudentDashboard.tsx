'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Types } from 'mongoose';
import { Course } from "../types/Course";
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gpa: number;
  enrolledCourses: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'updateUserDetails' | 'enrolledCourses' | 'searchCourse' | 'searchInstructor' | 'deleteUser'>('performance');
  const [userData, setUserData] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchCourses, setSearchCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleButtonClick = (tab: 'performance' | 'updateUserDetails' | 'enrolledCourses' | 'searchCourse' | 'searchInstructor' | 'deleteUser') => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/userData", { withCredentials: true });
        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          return;
        }
        console.error('Error fetching user data:', error.response?.data || error.message);
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

    fetchData();
    fetchCourses();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.keywords.some((keyword) => keyword.toLowerCase().includes(query))
    );

    setSearchCourses(filtered);
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
      `}</style>

      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="profile">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <div className="profile-name">{userData?.name}</div>
            <div className="profile-email">{userData?.email}</div>
          </div>
        </div>
        <div className="nav-item">
          <button
            className={activeTab === 'performance' ? 'active' : ''}
            onClick={() => handleButtonClick('performance')}
          >
            Performance Tracking
          </button>
          <button
  className={activeTab === 'updateUserDetails' ? 'active' : ''}
  onClick={() => handleButtonClick('updateUserDetails')}
>
  Update User Details
</button>
<button
  className={activeTab === 'enrolledCourses' ? 'active' : ''}
  onClick={() => handleButtonClick('enrolledCourses')}
>
  Enrolled Courses
</button>
<button
  className={activeTab === 'searchCourse' ? 'active' : ''}
  onClick={() => handleButtonClick('searchCourse')}
>
  Search Course
</button>
<button
  className={activeTab === 'searchInstructor' ? 'active' : ''}
  onClick={() => handleButtonClick('searchInstructor')}
>
  Search Instructor
</button>
<button
  className={activeTab === 'deleteUser' ? 'active' : ''}
  onClick={() => handleButtonClick('deleteUser')}
>
  Delete User
</button>
</div>
{activeTab === 'performance' && (
  <div className="content">
    <h2>Performance Tracking</h2>
    {{activeTab === 'updateUserDetails' && (
  <div className="content">
    <h2>Update User Details</h2>
    {/* Add your update user details form or component here */}
  </div>
)}
{activeTab === 'enrolledCourses' && (
  <div className="content">
    <h2>Enrolled Courses</h2>
    {/* Add your enrolled courses list or component here */}
  </div>
)}
{activeTab === 'searchCourse' && (
  <div className="content">
    <h2>Search Course</h2>
    {/* Add your search course form or component here */}
  </div>
)}
{activeTab === 'searchInstructor' && (
  <div className="content">
    <h2>Search Instructor</h2>
    {/* Add your search instructor form or component here */}
  </div>
)}
{activeTab === 'deleteUser' && (
  <div className="content">
    <h2>Delete User</h2>
    {/* Add your delete user form or component here */}
  </div>
)}
</div>
)}
);
};

export default StudentDashboard;
 