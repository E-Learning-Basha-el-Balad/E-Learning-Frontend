import io from 'socket.io-client';


const discussionsForumSocket = io('http://localhost:3001/forum');    

export default discussionsForumSocket;