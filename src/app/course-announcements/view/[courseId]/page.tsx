"use client";
import React from 'react';
import ViewCourseAnnouncements from '../ViewCourseAnnouncements';

const CourseAnnouncementsPage = ({ params }: { params: Promise<{ courseId: string }> }) => {
  const [resolvedParams, setResolvedParams] = React.useState<{ courseId: string } | null>(null);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <p>Loading...</p>;
  }

  const { courseId } = resolvedParams;

  return (
    <div>
      <h1>Course Announcements</h1>
      <ViewCourseAnnouncements courseId={courseId} />
    </div>
  );
};

export default CourseAnnouncementsPage;