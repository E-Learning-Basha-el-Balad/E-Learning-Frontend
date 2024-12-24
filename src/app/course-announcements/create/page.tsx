"use client";

import React from 'react';
import CreateCourseAnnouncementForm from './form/CreateCourseAnnouncementForm';

const CreateCourseAnnouncementPage = () => {
  const instructorId = '64c19af2b5f1b20edc8a487b'; 

  return (
    <div>
      <h1>Create Course Announcement</h1>
      <CreateCourseAnnouncementForm instructorId={instructorId} />
    </div>
  );
};

export default CreateCourseAnnouncementPage;