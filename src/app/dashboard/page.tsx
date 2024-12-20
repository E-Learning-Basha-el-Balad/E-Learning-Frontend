'use client'
import { useSearchParams } from 'next/navigation'; // Import useSearchParams from next/navigation
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';
//import StudentDashboard from './StudentDashboard';
const Dashboard = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role'); // Access query parameter 'role'

  if (!role) {
    return <div>Loading...</div>; // Or show a loading spinner if role is not present
  }

  // Conditional rendering based on role
  if (role === 'instructor') {
    return <InstructorDashboard />;
  } else if (role === 'student') {
    //return <StudentDashboard/>;
  } else if (role === 'admin') {
    return <AdminDashboard/>;
  }

  return <div>Role Not Recognized</div>;
};

export default Dashboard;
