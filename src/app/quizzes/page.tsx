'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    module_id: '',
    typeOfQuestions: [] as string[],
    numOfQuestions: 0,
    questions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch quizzes when the page loads
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/quizzes`, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch quizzes');
        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        setError('Failed to load quizzes');
      }
    };
    fetchQuizzes();
  }, []);

  // Modified handleFormChange to handle select dropdown
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'typeOfQuestions') {
      // Handle typeOfQuestions based on select value
      let types: string[] = [];
      switch (value) {
        case 'MCQ':
          types = ['MCQ'];
          break;
        case 'True/False':
          types = ['True/False'];
          break;
        case 'both':
          types = ['MCQ', 'True/False'];
          break;
        default:
          types = [];
      }
      setFormData({
        ...formData,
        typeOfQuestions: types,
      });
    } else if (name === 'numOfQuestions') {
      setFormData({
        ...formData,
        numOfQuestions: parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle edit button click
  const handleEdit = (quiz: any) => {
    setEditingQuiz(quiz);
    setFormData({
      module_id: quiz.module_id,
      typeOfQuestions: quiz.typeOfQuestions || [],
      numOfQuestions: quiz.numOfQuestions || 0,
      questions: quiz.questions || [],
    });
  };

  // Handle update form submission
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/quizzes/${editingQuiz._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typeOfQuestions: formData.typeOfQuestions,
          numOfQuestions: formData.numOfQuestions,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quiz');
      }

      const updatedQuiz = await response.json();
      setQuizzes(prevQuizzes =>
        prevQuizzes.map(quiz =>
          quiz._id === updatedQuiz._id ? updatedQuiz : quiz
        )
      );

      setEditingQuiz(null);
      alert('Quiz updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete operation
  const handleDelete = async (quizId: string) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const response = await fetch(`http://localhost:3000/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete quiz');
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
      alert('Quiz deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  return (
    <main className="container py-4">
      <h1 className="text-center mb-4">Quizzes</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {editingQuiz ? (
        <div className="card mb-4 p-4">
          <h5 className="card-title">
            Edit Quiz for Module: {editingQuiz.module_id}
          </h5>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Module ID:</label>
              <input
                type="text"
                value={formData.module_id}
                className="form-control"
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Number of Questions:</label>
              <input
                type="number"
                name="numOfQuestions"
                value={formData.numOfQuestions}
                onChange={handleFormChange}
                className="form-control"
                min="1"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Types of Questions:</label>
              <select
                name="typeOfQuestions"
                value={
                  formData.typeOfQuestions.includes('MCQ') && 
                  formData.typeOfQuestions.includes('True/False') 
                    ? 'both'
                    : formData.typeOfQuestions[0] || ''
                }
                onChange={handleFormChange}
                className="form-select"
                required
              >
                <option value="">Select question types</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="True/False">True/False </option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-primary flex-grow-1"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Quiz'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingQuiz(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="row">
          {quizzes.map((quiz: any) => (
            <div key={quiz._id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body position-relative">
                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                    onClick={() => handleDelete(quiz._id)}
                    title="Delete this quiz"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="btn btn-primary btn-sm position-absolute bottom-0 end-0 m-2"
                    onClick={() => handleEdit(quiz)}
                    title="Edit this quiz"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <h5 className="card-title">
                    Quiz for Module: {quiz.module_id}
                  </h5>
                  <div className="card-text">
                    <p className="mb-2">
                      <span className="badge bg-primary me-2">
                        Questions: {quiz.numOfQuestions}
                      </span>
                      <span className="badge bg-success">
                        Types: {quiz.typeOfQuestions.join(', ')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
