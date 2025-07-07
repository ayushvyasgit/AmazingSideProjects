import { useEffect,useState,useRef } from "react";
import './App.css';

interface Message {
  from: string;
  text: string;
  roomId: string;
}
function App(){
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8080");
    setSocket(ws);

    ws.onmessage = (event)=>{
      const data = JSON.parse(event.data);
      setMessages(prev=>[...prev,data]);
    };

    return () => {
      ws.close();
    };
  },[])
  
  function joinRoom(){
    const room = roomInputRef.current?.value.trim();

    if(socket && room){
      socket.send(JSON.stringify({ type: 'join', roomId: room }));
      setRoomId(room);
      setMessages([]); // clear previous
    }
  }
  //send message 
  function sendMessage() {
    const message = inputRef.current?.value.trim();
    if (socket && message && roomId) {
      socket.send(JSON.stringify({ type: 'message', text: message, roomId }));
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }
  return(

    <div>
      
      <h2>Join a chat room</h2>
      <input ref={roomInputRef} placeholder="RoomId" />
      <button onClick={joinRoom} >Join</button>

      {roomId && (
        <> 
          <h3>Room :{roomId} </h3>
          <div style={{ border: '1px solid #ccc', padding: 10, height: 200, overflowY: 'scroll', marginBottom: 12 }} >
            {messages.map((msg, i) => (
              <div key={i}><b>{msg.from}:</b> {msg.text}</div>
            ))}
          </div>
          <input ref={inputRef} placeholder="Type a message"/>
          <button onClick={sendMessage}>Send </button>
          
        </>
      )}
    </div>
  )
}

export default App;