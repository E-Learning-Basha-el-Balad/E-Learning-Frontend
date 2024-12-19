'use client'
import { useSearchParams } from 'next/navigation'; // Import useSearchParams from next/navigation
import InstructorDashboard from './InstructorDashboard';

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
    return <div>Student Dashboard - Not Implemented Yet</div>;
  } else if (role === 'admin') {
    return <div>Admin Dashboard - Not Implemented Yet</div>;
  }

  return <div>Role Not Recognized</div>;
};

export default Dashboard;
