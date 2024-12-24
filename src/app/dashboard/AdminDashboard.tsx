'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUserMinus } from 'react-icons/fa';
import { ObjectId } from 'mongoose';

interface Log {
  _id: string;
  type: string;
  message: string;
  email?: string;
  endpoint?: string;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  students: string[];
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gpa: number;
  enrolledCourses: string[];
  createdCourses: string[];
  createdAt: string;
  setActive: boolean;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'user info' | 'courses' | 'performance' | 'chat' | 'forums' | 'students' | 'deleteUser' | 'deleteCourse' | 'logs'>('courses');
  const [logs, setLogs] = useState<Log[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userIdToDelete, setUserIdToDelete] = useState<string>('');
  const [courseIdToDelete, setCourseIdToDelete] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonClick = (tab: 'user info' | 'courses' | 'performance' | 'chat' | 'forums' | 'students' | 'deleteUser' | 'deleteCourse' | 'logs') => {
      setActiveTab(tab);
    };
  const handleForumClick = (course: Course) => {
    setSelectedForumCourse(course);
    setActiveTab('forums');
  };
  const setUser = (newUser: User) => {
    setUserData(newUser);
  };
  useEffect(() => {
    fetchLogs();
   
    
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/logs', { withCredentials: true });
      setLogs(response.data);
    } catch (error: any) {
      setError('Error fetching logs');
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };
 const handleGet= async (userId:string) => { 
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error: any) {
      //setError("Cant delete user");
     
    } finally {
      setLoading(false);
    }

  };
  const handleCheck = async (courseId: string) => { 
    setLoading(true);
    setError(null);
    try{
      const response = await axios.get('http://localhost:3000/courses/check', { withCredentials: true });
      setCourses(response.data);
    }catch(error:any){}
   finally {
    setLoading(false);
  }

};
  const handleDeleteUser = async () => {
    if (!userIdToDelete) {
      setError('Please enter a valid User ID.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the user with ID: ${userIdToDelete}?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    handleGet(userIdToDelete);
    
    try {
      await axios.delete('http://localhost:3000/users/deleteuser', {
        withCredentials: true,
        data: { userId: userIdToDelete },
      });

      setUsers(users.filter((user) => user._id !== userIdToDelete));
      setUserIdToDelete('');
      alert('User deleted successfully.');
    } catch (error: any) {
      setError("Can't delete user");
     
    } finally {
      setLoading(false);
    }
  };
  

  const handleDeleteCourse = async () => {
    if (!courseIdToDelete) {
      alert('Please enter a valid Course ID.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the course with ID: ${courseIdToDelete}?`)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    handleCheck(courseIdToDelete);

    try {
      await axios.delete("http://localhost:3000/courses/delete", {
        withCredentials: true,
        data: { courseId: courseIdToDelete },
      });

      setCourses(courses.filter((course) => course._id !== courseIdToDelete));
      setCourseIdToDelete('');
      alert('Course deleted successfully.');
    } catch (error: any) {
      setError('Failed to delete the course');
      
    } finally {
      setLoading(false);
    }
  };
  

  

  

  

  

  

  return (
    <>
      <style jsx>{`
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
      <div className="background">
        <div className="sidebar">
          <button onClick={() => handleButtonClick('logs')}>Logs</button>
          <button onClick={() => handleButtonClick('deleteUser')}>Delete User</button>
          <button onClick={() => handleButtonClick('deleteCourse')}>Delete Course</button>
          {error && (
  <div style={{ color: 'red', marginTop: '20px' }}>
    <strong>Error:</strong> {error}
  </div>
)}
        </div>
        <div className="dashboard-container" style={{ marginLeft: '250px' }}>
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          {activeTab === 'logs' && (
            <div className="logs-table-container">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Email</th>
                    <th>Endpoint</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td>{log.type}</td>
                      <td>{log.message}</td>
                      <td>{log.email || 'N/A'}</td>
                      <td>{log.endpoint || 'N/A'}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'deleteUser' && (
        <div>
          <h3>Delete Users</h3>
          {/* Input field for user ID */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="userId" style={{ display: 'block', marginBottom: '10px' }}>
              Enter User ID:
            </label>
            <input
              type="text"
              id="userId"
              value={userIdToDelete}
              onChange={(e) => setUserIdToDelete(e.target.value)}
              placeholder="User ID"
              style={{
                padding: '10px',
                width: '300px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>
          {/* Red delete button */}
          <button
            style={{
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            onClick={handleDeleteUser}
          >
            Delete User
          </button>
          {/* List of users with delete icons */}
          <ul style={{ marginTop: '30px', listStyleType: 'none', padding: 0 }}>
            {users.map((user) => (
              <li key={user._id} style={{ marginBottom: '10px', fontSize: '16px' }}>
                {user.name} ({user._id}){' '}
                <FaUserMinus
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={() => {
                    setUserIdToDelete(user._id); // Prefill user ID
                    handleDeleteUser(); // Trigger delete
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {activeTab === 'deleteCourse' && (
            <div>
              <h3>Delete Courses</h3>
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="courseId" style={{ display: 'block', marginBottom: '10px' }}>
                  Enter Course ID:
                </label>
                <input
                  type="text"
                  id="courseId"
                  value={courseIdToDelete}
                  onChange={(e) => setCourseIdToDelete(e.target.value)}
                  placeholder="Course ID"
                  style={{
                    padding: '10px',
                    width: '300px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '16px',
                  }}
                />
              </div>
              <button
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={handleDeleteCourse}
              >
                Delete Course
              </button>
              <ul style={{ marginTop: '30px', listStyleType: 'none', padding: 0 }}>
                {courses.map((course) => (
                  <li key={course._id} style={{ marginBottom: '10px', fontSize: '16px' }}>
                    {course.title} ({course._id}){' '}
                    <FaTrash
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => {
                        setCourseIdToDelete(course._id);
                        handleDeleteCourse();
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


       
export default AdminDashboard;