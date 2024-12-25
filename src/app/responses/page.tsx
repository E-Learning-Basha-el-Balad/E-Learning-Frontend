'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userIds, setUserIds] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  // Fetch quizzes when the page loads
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get('jwt');
        const response = await fetch(`http://localhost:3000/quizzes`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        setQuizzes(data);
        
        // Initialize userIds state with empty strings for each quiz
        const initialUserIds = data.reduce((acc: any, quiz: any) => {
          acc[quiz._id] = '';
          return acc;
        }, {});
        setUserIds(initialUserIds);
      } catch (err) {
        setError('Failed to load quizzes  or you are not authorized to access this page');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const handleUserIdChange = (quizId: string, value: string) => {
    setUserIds(prev => ({
      ...prev,
      [quizId]: value
    }));
  };

  const handleStartQuiz = (quizId: string) => {
    const userId = userIds[quizId];
    if (!userId.trim()) {
      alert('Please enter a User ID before starting the quiz');
      return;
    }
    router.push(`/responses/quiz?quiz_id=${quizId}&user_id=${userId}`);
  };

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4">Available Quizzes</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="alert alert-info" role="alert">
          No quizzes available.
        </div>
      )}

      <div className="row">
        {quizzes.map((quiz: any) => (
          <div key={quiz._id} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Quiz for Module: {quiz.module_id}</h5>
                <p className="card-text">
                  <span className="badge bg-primary me-2">
                    Questions: {quiz.numOfQuestions}
                  </span>
                  <span className="badge bg-success">
                    Types: {quiz.typeOfQuestions.join(', ')}
                  </span>
                </p>
                <div className="mb-3">
                  <label className="form-label">Enter User ID:</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={userIds[quiz._id]}
                    onChange={(e) => handleUserIdChange(quiz._id, e.target.value)}
                    placeholder="Enter your User ID"
                    required
                  />
                </div>
                <button 
                  className="btn btn-primary w-100"
                  onClick={() => handleStartQuiz(quiz._id)}
                  disabled={!userIds[quiz._id]}
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
