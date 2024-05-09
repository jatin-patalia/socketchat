import React, { useEffect, useRef, useState } from 'react'
import music from './notification.mp3';
import music2 from './sending.mp3';

const Chatbox = ({ socket, username, room }) => {
    const [message, setMessage] = useState("");
    const [allMessage, setAllMessage] = useState([]);
    const receiveNotification = new Audio(music);
    const sendNotification = new Audio(music2);


    const sendMessage = async () => {
        if (message) {
            const messageData = {
                id: Math.random(),
                room: room,
                author: username,
                message: message,
                time:new Date().toLocaleString([], {
                    hour:'2-digit',
                    minute:'2-digit'
                })
            }

            await socket.emit("sendMessage", messageData);
            setAllMessage((list) => [...list, messageData])
            setMessage("")
            sendNotification.play();
        }
    }

    useEffect(() => {
        const handleReceivedMsg = (data) => {
            setAllMessage((list) => [...list, data])
            receiveNotification.play();

        }
        socket.on("receiveMessage", handleReceivedMsg);
        return () => {
            socket.off("receiveMessage", handleReceivedMsg);

        }

    }, [socket])

    const ref = useRef(null)
    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight
    }, [allMessage])


    return (
        <>
            <div className='container'>
                <div className="chatContainer">
                    <h2>Welcome {username} in chatroom no {room}</h2>
                    <div className="chatBox">
                        <div className='scrolling' ref={ref} style={{ height: '350px', overflowY: 'auto' }}>


                            {allMessage.map((item) => (
                                <div key={item.id} className='msg_content' id={username == item.author ? 'you' : 'other'}>

                                    <div>
                                        <div className='msg' id={username == item.author ? 'authorColor' : 'otherColor'}>
                                            <p>{item.message}</p>
                                        </div>

                                        <div className='msg_detail'>
                                            <p className='authorName'>{item.author}</p>
                                            <p className='time'>{item.time}</p>
                                        </div>
                                    </div>


                                </div>
                            ))
                            }
                        </div>
                        <div className="chatBody">
                            <input onKeyPress={(e) => { e.key === "Enter" && sendMessage() }} type="text" placeholder='Type your message' value={message} onChange={(e) => setMessage(e.target.value)} />
                            <button onClick={sendMessage}>&#9658;</button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}

export default Chatbox