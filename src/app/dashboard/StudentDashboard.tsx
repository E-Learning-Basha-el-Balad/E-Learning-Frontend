'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Types } from 'mongoose';
import { Course } from "../types/Course";
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import StudentDetailsPage from "./StudentCourseDetails";

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



const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'updateDetails' | 'searchCourse' | 'searchInstructor' | 'deleteUser' | 'forms' | 'chat' | 'myCourses'| 'courseDetails'>('performance');
  const [userData, setUserData] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchCourses, setSearchCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  

  const handleButtonClick = (tab: 'performance' | 'updateDetails' |  'searchCourse' | 'searchInstructor' | 'deleteUser' | 'forms' | 'chat' | 'myCourses') => {
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
      } catch (error: any) {
        if (error.response?.status === 401) {
          return;
        }
        console.error('Error fetching user data:', error.response?.data || error.message);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (userData) {
          const response = await axios.get(`http://localhost:3000/courses/enrolled/${userData._id}`);
          setCourses(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch enrolled courses', err);
      }
    };
  
    if (userData) {
      fetchEnrolledCourses();
    }
  }, [userData]); 
  
  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab('courseDetails');
  };
  const handleBackButtonClick = () => {
    setSelectedCourse(null);
    setActiveTab('myCourses');
  };
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
  
    if (query && activeTab === 'searchCourse') {
      try {
        const response = await axios.get(`http://localhost:3000/courses/searchByTitle`, {
          params: { title: query },
          withCredentials: true,
        });
        setSearchCourses(response.data); 
      } catch (error) {
        console.error('Error fetching courses:', error);
        setSearchCourses([]);  
      }
    } else if (!query) {
      setSearchCourses([]);  
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
    overflow-y: auto;  /* This makes the sidebar scrollable */
    padding-bottom: 50px;  /* To avoid the last button being stuck at the bottom */
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
            <div className="profile-icon" role="img" aria-label="user-icon">
              <FaUserCircle />
            </div>
            <div className="profile-info">
              <div className="profile-name">{userData.name}</div>
              <div className="profile-email">{userData.email}</div>
            </div>
          </div>
        )}

        <div className="nav-item">
          <button onClick={() => handleButtonClick('performance')} className={activeTab === 'performance' ? 'active' : ''}>View Performance</button>
          <button onClick={() => handleButtonClick('updateDetails')} className={activeTab === 'updateDetails' ? 'active' : ''}>Update Details</button>
         
          <button onClick={() => handleButtonClick('searchCourse')} className={activeTab === 'searchCourse' ? 'active' : ''}>Search Courses</button>
          <button onClick={() => handleButtonClick('searchInstructor')} className={activeTab === 'searchInstructor' ? 'active' : ''}>Search Instructors</button>
          <button onClick={() => handleButtonClick('deleteUser')} className={activeTab === 'deleteUser' ? 'active' : ''}>Delete User</button>
          <button onClick={() => handleButtonClick('forms')} className={activeTab === 'forms' ? 'active' : ''}>Forms</button>
          <button onClick={() => handleButtonClick('chat')} className={activeTab === 'chat' ? 'active' : ''}>Chat</button>
          <button onClick={() => handleButtonClick('myCourses')} className={activeTab === 'myCourses' ? 'active' : ''}>My Courses</button>
        </div>
      </div>

      <div className="content">
        <div className="details-container">
          <div className="back-button-container">
            <button onClick={() => setActiveTab('performance')}>
              <FaArrowLeft />
            </button>
          </div>

          {activeTab === 'performance' && (
            <div>
              <h1>Performance Tracking</h1>
              {/* Display Performance Tracking */}
            </div>
          )}
          {activeTab === 'updateDetails' && (
            <div>
              <h1>Update Your Details</h1>
              {/* Form for updating user details */}
            </div>
          )}
        
        {activeTab === 'searchCourse' && (
  <div>
    <h1>Search for Courses</h1>
    <input
      type="text"
      placeholder="Search courses by title..."
      value={searchQuery}
      onChange={handleSearchChange}
      className="search-input"
    />
    <div className="course-container">
  {searchCourses.length === 0 && searchQuery.trim() === '' ? (
   
    <p></p>
  ) : (
    searchCourses.map((course) => (
      <div className="course-card" key={course._id}>
        <div className="course-title">{course.title}</div>
        <div className="course-description">{course.description}</div>
        <div className="course-keywords">{course.keywords.join(', ')}</div>
      </div>
    ))
  )}
</div>

  </div>
)}

          {activeTab === 'searchInstructor' && (
            <div>
              <h1>Search Instructors</h1>
             {/* Search for instructors */}
            </div>
          )}
          {activeTab === 'deleteUser' && (
            <div>
              <h1>Delete User</h1>
              {/* Button for deleting the user */}
            </div>
          )}
          {activeTab === 'forms' && (
            <div>
              <h1>Forms</h1>
              {/* Form section */}
            </div>
          )}
          {activeTab === 'chat' && (
            <div>
              <h1>Chat</h1>
              {/* Chat functionality */}
            </div>
          )}
            {activeTab === 'courseDetails' && selectedCourse && (
            <div className="course-details">
              <div className="back-button-container">
                <button onClick={handleBackButtonClick}>
                  <FaArrowLeft />
                  Back to My Courses
                </button>
              </div>
              <StudentDetailsPage course={selectedCourse} /> {/* Pass the selected course to the StudentDetailsPage */}
            </div>
          )}
          {activeTab === 'myCourses' && (
            <div>
              <h1>My Courses</h1>
              {courses.length > 0 ? (
                <div className="course-container">
                  {courses.map(course => (
                    <div
                      className="course-card"
                      key={course._id}
                      onClick={() => handleCourseClick(course)} 
                    >
                      <div className="course-title">{course.title}</div>
                      <div className="course-description">{course.description}</div>
                      <div className="course-keywords">{course.keywords.join(', ')}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You are not enrolled in any courses yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default StudentDashboard;
