'use client';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [chatId, setChatId] = useState(null); // Replace with the actual chat ID
  const [groupName, setGroupName] = useState('');
  const [groupUsers, setGroupUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [myChats, setMyChats] = useState([]);
  const [emptyChats, setMyEmptyChats] = useState([]);
  const [error, setError] = useState('');
  const [messagesMap, setMessagesMap] = useState({});
  // Connect to WebSocket server
  useEffect(() => {
    const newSocket = io('http://localhost:3002'); // Adjust to your backend's WebSocket server URL
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const getMyChats = () => {
      if(socket && localStorage.getItem('userId')){
        socket.emit('myChats', { userId : localStorage.getItem('userId')});
        socket.on('my-chats-reply', (chats) => {
          setMyChats(chats);
          socket.emit('browseUsers');
          socket.on('browse-users-reply', (allUsers) => {
            setMyEmptyChats(allUsers.filter((user) => {
              if(user._id == localStorage.getItem('userId'))
                return false;
              const hasPrivateChat = chats.some((chat) => {
                return (
                  chat.users.length === 2 &&
                  chat.users.includes(String(localStorage.getItem('userId'))) &&
                  chat.users.includes(String(user._id))
                );
              });
        
              return !hasPrivateChat;
            }));
          });
        });
      }
      else{
        setError('Couldn\'t get Chat');
      }
    }
    getMyChats();
  },[socket]);

  const handleChatClick = (currChat) => {
    setError('');
    if (chatId && messages.length > 0) {
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: messages,
      }));
    }

    setChatId(currChat);

    if (messagesMap[currChat]) {
      setMessages(messagesMap[currChat]);
    } else {
      socket.emit('getChat', { _id: currChat });
      socket.on('get-chat-reply', (fetchedMessages) => {
        setMessages(fetchedMessages);
        setMessagesMap((prev) => ({
          ...prev,
          [currChat]: fetchedMessages,
        }));
      });
    }
  };

  const handleSendMessage = () => {
    setError('');
  if (messageInput.trim() && chatId) {
    const newMessage = {
      sender: localStorage.getItem('userId'),
      chat: chatId,
      content: messageInput.trim(),
    };

    socket.emit('newMessage', newMessage);

    socket.on('message-reply', (message) => {
      setMessages((prev) => [...prev, message]);
      setMessagesMap((prev) => ({
        ...prev,
        [chatId]: [...prev[chatId] || [], message],
      }));
    });

    setMessageInput('');
  } else {
    setError('Couldn\'t send message');
  }
};

  const handleNewUserClick = (userId) => {
    setError('');
    setChatId(userId);
    setMessages([]);
  }

  const handleBrowseUsers = () => {
    setError('');
    socket.emit('browseUsers');
    socket.on('browse-users-reply', (allUsers) => setUsers(allUsers.filter((user) => user._id !== localStorage.getItem('userId'))));
  }
  
  const handleUserClick = (userId) => {
    setError('');
    setGroupUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
  };

  const handleCreateGroup = () => {
    setError('');
    if(groupName && groupUsers){
      const newGroup = {
        name : groupName,
        users : [...groupUsers, localStorage.getItem('userId')]
      }
      socket.emit('createGroup', newGroup);
      socket.on('create-group-reply', (newGroupChat) => {setMyChats([...myChats, newGroupChat])});
      setGroupUsers([]);
      setGroupName('');
    }
    else{
      setError('Couldn\'t create group');
    }
  }

  return (
    <div>
      <h1>Chat</h1>
      <div>
  {myChats &&
    myChats.map((chat) => (
      <div key={chat._id}>
        <button
              key={chat._id}
              onClick={() => handleChatClick(chat._id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                marginBottom: '0.5rem',
                textAlign: 'left',
                backgroundColor: chatId === chat._id ? '#f0f0f0' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              {chat.name || 'Unnamed Chat'}
            </button>
      </div>
    ))}
    {emptyChats.length > 0 &&
    emptyChats.map((user) => (
      <div key={user._id}>
        <button
              key={user._id}
              onClick={() => handleNewUserClick(user._id)}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                marginBottom: '0.5rem',
                textAlign: 'left',
                backgroundColor: chatId === user._id ? '#f0f0f0' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              {user.name || 'Unnamed Chat'}
            </button>
      </div>
    ))}
</div>
<div style={{ width: '70%', padding: '1rem' }}>
        <h2>Messages</h2>
        {messages.length > 0 ? (
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{msg.sender}:</strong> {msg.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>Select a chat to view messages</p>
        )}
      </div>
      <div>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            style={{ width: '80%', padding: '0.5rem', marginRight: '0.5rem' }}
          />
          <button onClick={handleSendMessage} style={{ padding: '0.5rem 1rem' }}>
            Send
          </button>
        </div>
        <div>
  <h3>Browse Users</h3>
  <button onClick={handleBrowseUsers}>Browse Users</button>
  <ul style={{ listStyleType: 'none', padding: 0 }}>
    {users.map((user) => (
      <li
        key={user._id}
        onClick={() => handleUserClick(user._id)}
        style={{
          cursor: 'pointer',
          padding: '0.5rem',
          marginBottom: '0.5rem',
          backgroundColor: groupUsers.includes(user._id) ? '#d4f0ff' : '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        {user.name} ({user.role})
      </li>
    ))}
  </ul>
  <div>
    <h4>Selected Users for Group</h4>
    {groupUsers.length > 0 ? (
      <ul>
        {groupUsers.map((userId) => (
          <li key={userId}>{users.find((user) => user._id === userId)?.name}</li>
        ))}
      </ul>
    ) : (
      <p>No users selected yet.</p>
    )}
  </div>
  <div>
    <input
      type="text"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      placeholder="Enter group name..."
      style={{ width: '80%', padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={handleCreateGroup}>Create Group</button>
  </div>
</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}

    </div>
  );
};

export default Chat;
