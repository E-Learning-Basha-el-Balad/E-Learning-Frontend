'use client'
import { useSearchParams } from 'next/navigation'; 
import InstructorDashboard from './InstructorDashboard';
import AdminDashboard from './AdminDashboard';
//import StudentDashboard from './StudentDashboard';
const Dashboard = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get('role'); 

  if (!role) {
    return <div>Loading...</div>; 
  }


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
