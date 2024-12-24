"use client";
import React, { useState } from 'react';
import useCreateCourseAnnouncement from '../hooks/useCreateCourseAnnouncement';
import SelectCourse from '../show-courses/SelectCourse';

const CreateCourseAnnouncementForm = ({ instructorId }: { instructorId: string }) => {
  const [content, setContent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const { createAnnouncement, loading, error } = useCreateCourseAnnouncement();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourse) {
      createAnnouncement(content, instructorId, selectedCourse);
      setContent('');
    } else {
      alert('Please select a course.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SelectCourse instructorId={instructorId} selectedCourse={selectedCourse} onSelect={setSelectedCourse} />
      <div>
        <label htmlFor="content">Announcement Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>Create Announcement</button>
      {error && <p>Error: {error}</p>}
    </form>
  );
};

export default CreateCourseAnnouncementForm;