"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetcher from '../../utils/fetcher';
import { Course, DifficultyLevel } from '../../types/Course';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<DifficultyLevel>(DifficultyLevel.Beginner);
  const [description, setDescription] = useState('');
  const [createdBy, setCreatedBy] = useState(''); // Instructor ID
  const [userId, setUserId] = useState(''); // User ID for the request body (Instructor's User ID)
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const [students, setStudents] = useState<string[]>([]); // Initialize students as an empty array
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Prepare the new course object
    const newCourse: Omit<Course, '_id' | 'updated_at' | 'versions' | 'versionNumber'> = {
      title,
      category,
      level,
      description,
      created_by: createdBy,
      students, // Use the updated students array
      created_at: createdAt,
      userId,
      DifficultyLevel: DifficultyLevel.Beginner
    };

    try {
      const response = await fetcher('http://localhost:3000/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      console.log('API Response:', response);

      if (response && response._id) {
        router.push('/Courses'); // Redirect to the homepage
      } else {
        setError('Server returned an invalid response. Check the server logs.');
        console.error('Invalid response structure:', response);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('404')) {
        setError('User not found or invalid instructor role.');
      } else if (err instanceof Error && err.message.includes('400')) {
        setError('Failed to create course. Ensure the user is an instructor and all fields are correct.');
      } else {
        setError('Failed to create the course. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create a New Course</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Course Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value as DifficultyLevel)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value={DifficultyLevel.Beginner}>Beginner</option>
              <option value={DifficultyLevel.Intermediate}>Intermediate</option>
              <option value={DifficultyLevel.Advanced}>Advanced</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Course Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">
              Created By (Instructor ID)
            </label>
            <input
              id="createdBy"
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID (Instructor's User ID)
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
              Creation Date
            </label>
            <input
              id="createdAt"
              type="datetime-local"
              value={new Date(createdAt).toISOString().slice(0, -1)}
              onChange={(e) => setCreatedAt(new Date(e.target.value).toISOString())}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="students" className="block text-sm font-medium text-gray-700">
              Students (Initial Enrollment)
            </label>
            <input
              id="students"
              type="text"
              value={students.join(', ')}
              onChange={(e) => setStudents(e.target.value.split(',').map((s) => s.trim()))}
              placeholder="Add student IDs separated by commas (optional)"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating Course...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
