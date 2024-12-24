'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaUserMinus } from 'react-icons/fa';

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
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'deleteUser' | 'deleteCourse'>('logs');
  const [logs, setLogs] = useState<Log[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const handleButtonClick = (tab: 'logs' | 'deleteUser' | 'deleteCourse') => {
    setActiveTab(tab);
  };
  const setUser = (newUser: User) => {
    setUserData(newUser);
  };
  useEffect(() => {
    fetchLogs();
    fetchCourses();
    fetchUsers();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/logs', { withCredentials: true });
      setLogs(response.data);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
    } 
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/courses', { withCredentials: true });
      setCourses(response.data);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users', { withCredentials: true });
      setUser(response.data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
    }
  };

  

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${courseId}`, { withCredentials: true });
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error: any) {
      console.error('Error deleting course:', error);
      
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`, { withCredentials: true });
      setUsers(users.filter(user => user._id !== userId)); // Remove the deleted user from the list
    } catch (error: any) {
      console.error('Error deleting user:', error);
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
          {activeTab === 'deleteCourse' && (
            <div>
              <h3>Delete Courses</h3>
              <ul>
                {courses.map(course => (
                  <li key={course._id}>
                    {course.title} <FaTrash onClick={() => handleDeleteCourse(course._id)} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'deleteUser' && (
  <div>
    <h3>Delete Users</h3>
    <ul>
      {users.map(user => (
        <li key={user._id}>
          {user.name} <FaUserMinus onClick={() => handleDeleteUser(user._id)} />
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