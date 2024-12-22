'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CreateQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId');

  const [formData, setFormData] = useState({
    module_id: moduleId || '',
    typeOfQuestions: [] as string[],
    numOfQuestions: 0,
    questions: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update formData when moduleId changes
  useEffect(() => {
    if (moduleId) {
      setFormData(prev => ({
        ...prev,
        module_id: moduleId
      }));
    }
  }, [moduleId]);

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'typeOfQuestions') {
      // Handle multiple question types
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create quiz');
      }

      alert('Quiz created successfully!');
      router.push(`/quizzes?moduleId=${moduleId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h3 className="mb-0">Create a New Quiz</h3>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation">
                {/* Module ID Input - now readonly when provided via URL */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-folder me-2"></i>
                    Module ID
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-hash"></i>
                    </span>
                    <input
                      type="text"
                      name="module_id"
                      value={formData.module_id}
                      onChange={handleFormChange}
                      className="form-control form-control-lg"
                      placeholder="Enter module ID"
                      required
                      readOnly={!!moduleId} // Make readonly if moduleId is provided
                    />
                  </div>
                </div>

                {/* Question Type Selection */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-list-check me-2"></i>
                    Type of Questions
                  </label>
                  <select
                    name="typeOfQuestions"
                    value={
                      formData.typeOfQuestions.includes('MCQ') && 
                      formData.typeOfQuestions.includes('True/False')
                        ? 'both'
                        : formData.typeOfQuestions[0] || ''
                    }
                    onChange={handleFormChange}
                    className="form-select form-select-lg"
                    required
                  >
                    <option value="">Select question types</option>
                    <option value="MCQ">Multiple Choice Questions</option>
                    <option value="True/False">True/False</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Number of Questions */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    <i className="bi bi-123 me-2"></i>
                    Number of Questions
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-hash"></i>
                    </span>
                    <input
                      type="number"
                      name="numOfQuestions"
                      value={formData.numOfQuestions}
                      onChange={handleFormChange}
                      className="form-control form-control-lg"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Quiz...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Create Quiz
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-lg"
                    onClick={() => router.push(`/questions?moduleId=${moduleId}`)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Questions
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
