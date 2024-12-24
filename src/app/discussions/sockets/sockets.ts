import io from 'socket.io-client';


const discussionsForumSocket = io('http://localhost:3000/forum');    

export default discussionsForumSocket;