"use client";
import React from 'react';
import useCourseAnnouncements from './hooks/useCourseAnnouncements';

const ViewCourseAnnouncements = ({ courseId }: { courseId: string }) => {
  const announcements = useCourseAnnouncements(courseId);

  return (
    <>
      <ul>
        {announcements.map(announcement => (
          <li key={announcement._id}>
            {announcement.content} - {new Date(announcement.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ViewCourseAnnouncements;