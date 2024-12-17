"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle Sidebar visibility
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Redirect functions
  const handleCreateCourseButtonClick = () => {
    router.push('/Courses/Create');
  };

  const handleCourseDetailsButtonClick = () => {
    router.push('/Courses/Details');
  };

  const handleAllCoursesButtonClick = () => {
    router.push('/Courses/AllCourses');
  };

  const handleEnrollButtonClick = () => {
    router.push('/Courses/Enroll'); // Redirect to enroll page
  };

  const handleUpdateCourseButtonClick = () => {
    router.push('/Courses/update'); // Redirect to update course page
  };

  const handleDeleteCourseButtonClick = () => {
    router.push('/Courses/Delete'); // Redirect to delete course page
  };

  const handleEnrolledStudentButtonClick = () => {
    router.push('/Courses/EnrolledStudent'); // Redirect to enrolled students page
  };

  const handleSearchSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Navigate to search results page with the query
    router.push(`/Courses/Search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform ease-in-out duration-300`}
      >
        <div className="flex flex-col items-start p-4 space-y-4 mt-12"> {/* Added margin-top */}
          <button
            onClick={() => router.push('/')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Home
          </button>
          <button
            onClick={() => router.push('/Courses/AllCourses')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            All Courses
          </button>
          <button
            onClick={() => router.push('/Courses/Create')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Create Course
          </button>
          <button
            onClick={() => router.push('/Courses/Details')}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Course Details
          </button>
          <button
            onClick={handleEnrollButtonClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Enroll
          </button>
          <button
            onClick={handleUpdateCourseButtonClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Update Course
          </button>
          <button
            onClick={handleDeleteCourseButtonClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Delete Course
          </button>
          {/* New button for enrolled students */}
          <button
            onClick={handleEnrolledStudentButtonClick}
            className="w-full text-left px-4 py-2 hover:bg-gray-700"
          >
            Enrolled Students
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Hamburger Icon for Sidebar */}
        <button
          onClick={handleSidebarToggle}
          className="fixed top-4 left-4 p-3 bg-gray-800 text-white rounded-md"
        >
          &#9776;
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome to Course Management</h1>
          <p className="text-gray-400">Use the search bar to find courses</p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <form onSubmit={handleSearchSubmit} className="flex max-w-md w-full">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded text-black"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
