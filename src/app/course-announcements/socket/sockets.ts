import io from 'socket.io-client';

const courseAnnouncementSocket = io('http://localhost:3000/ws/course/announcement');

export default courseAnnouncementSocket;