import React, { useState } from 'react'
import io from 'socket.io-client'
import Chatbox from './Chatbox';
import music from './join.wav';

const socket = io.connect("http://localhost:1000")

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const joinNotification = new Audio(music);

  const joinChat = () => {
    if (username && room) {
      socket.emit('joinRoom', room);
      setShowChat(true);
      joinNotification.play();
    }
  }

  return (
    <>
      {
        !showChat &&
        <div className='joinRoom'>
          <h1>Join Chats</h1>
          <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder='Room number' value={room} onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinChat}>Join</button>
        </div>
      }

      {showChat &&
        (
          <Chatbox socket={socket} username={username} room={room} />
        )
      }

    </>
  )
}

export default App