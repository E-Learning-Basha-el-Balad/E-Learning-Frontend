"use client";
import React from 'react';
import usePlatformAnnouncements from '../hooks/usePlatformAnnouncements';

const ViewPlatformAnnouncements = () => {
  const announcements = usePlatformAnnouncements();

  return (
    <>
      <h1>Platform Announcements</h1>
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

export default ViewPlatformAnnouncements;