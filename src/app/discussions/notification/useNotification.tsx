import { useEffect, useState } from 'react';
import discussionsForumSocket from '../sockets/sockets';
import { NotificationData } from '@/app/platform-announcements/interfaces/notification';

const useNotification = (userId: string) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    // Join the user room to receive notifications
    discussionsForumSocket.emit('room:join:user', { id: userId });

    // Listen for notifications
    discussionsForumSocket.on('notification', (data: NotificationData) => {
      console.log('Received data:', data);
      setNotification(data);
    });

    // Cleanup function to leave the user room when component unmounts
    return () => {
      discussionsForumSocket.emit('room:leave:user', { id: userId });
      discussionsForumSocket.off('notification');
    };
  }, [userId]);

  return notification;
};

export default useNotification;