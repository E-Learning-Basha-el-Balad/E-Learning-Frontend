// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Course } from '../../types/Course';

// export default function Search() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query"); // Get query from the URL
//   const [searchQuery, setSearchQuery] = useState(query || ""); // Initialize with query
//   const [searchResults, setSearchResults] = useState<Course[]>([]); // Adjust type accordingly
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (query) {
//       // Fetch search results from the backend when the query changes
//       fetchSearchResults(query);
//     }
//   }, [query]);

//   const fetchSearchResults = async (query: string) => {
//     setLoading(true);
//     setError(null);

//     // Split the query by commas and send as an object to the backend
//     const [title, category, level] = query.split(",");

//     try {
//       const response = await fetch("http://localhost:3000/courses/search", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           title,
//           category,
//           level,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSearchResults(data); // Set the search results in the state
//       } else {
//         setError("Failed to fetch search results");
//       }
//     } catch (err) {
//       setError("An error occurred while fetching search results");
//       console.error("Search Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col p-8 bg-gray-800 text-white">
//       <h1 className="text-3xl font-bold mb-6">Search Results</h1>

//       <div className="flex justify-center mb-6">
//         <input
//           type="text"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full max-w-md px-4 py-2 rounded text-black"
//           placeholder="Search for courses by title, category, level..."
//         />
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-400">Loading...</p>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <div className="space-y-4">
//           {searchResults.length > 0 ? (
//             searchResults.map((course: Course) => (
//               <div key={course._id} className="p-4 border rounded-md shadow-sm bg-white text-black">
//                 <h3 className="font-semibold">{course.title}</h3>
//                 <p>Category: {course.category}</p>
//                 <p>Level: {course.level}</p>
//               </div>
//             ))
//           ) : (
//             <p>No courses found.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Course } from "../../types/Course";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (query: string) => {
    setLoading(true);
    setError(null);

    const [title, category, level] = query.split(",");

    try {
      const response = await fetch("http://localhost:3000/courses/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, category, level }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setError("Failed to fetch search results");
      }
    } catch (err) {
      setError("An error occurred while fetching search results");
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchSearchResults(searchQuery);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full max-w-md px-4 py-2 rounded text-black"
          placeholder="Search for courses by title, category, level..."
        />
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((course: Course) => (
              <div
                key={course._id}
                className="p-4 border rounded-md shadow-sm bg-white text-black"
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p>Category: {course.category}</p>
                <p>Level: {course.level}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No courses found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
