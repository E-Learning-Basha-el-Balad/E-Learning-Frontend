import { useState, useEffect } from 'react';
import courseAnnouncementSocket from '../../socket/sockets';

const useCreateCourseAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCreated = () => {
      setLoading(false);
    };

    const handleError = (response: any) => {
      setLoading(false);
      setError(response.message);
    };

    courseAnnouncementSocket.on('announcement:created', handleCreated);
    courseAnnouncementSocket.on('announcement:create:error', handleError);

    return () => {
      courseAnnouncementSocket.off('announcement:created', handleCreated);
      courseAnnouncementSocket.off('announcement:create:error', handleError);
    };
  }, []);

  const createAnnouncement = (content: string, instructor: string, course: string) => {
    setLoading(true);
    setError(null);
    courseAnnouncementSocket.emit('announcement:create', { content, instructor, course });
  };

  return { createAnnouncement, loading, error };
};

export default useCreateCourseAnnouncement;