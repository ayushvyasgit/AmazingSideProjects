import { WebSocketServer } from "ws";

const ws = new WebSocketServer({ port: 8080 });

const rooms = new Map(); // mark userId and Socket on room 
ws.on("connection" , function(socket){
  console.log("new client added ")
  //1 on connection take the roomid
   let joinedRoom: string | null = null; // ✅ changed from const to let//initally null as it can be null
    //user send roomid to server first through socket 
  socket.on("message", (msg: string | Buffer) => {
    try{
      const data = JSON.parse(msg.toString());

      if(data.type==='join' && data.roomId){
        //1.1add it to map  , and add the socket 
        joinedRoom = data.roomId;
        if(!rooms.has(joinedRoom)){
          rooms.set(joinedRoom,new Set());
        }
      }
      rooms.get(joinedRoom).add(socket);
      console.log(`"user joined" + ${joinedRoom}` );
      return;

  //2 now if user send msg and rooms are joined ,send msg to room maped user

      if(data.type ==='message' && joinedRoom){
        const clients = rooms.get(joinedRoom) // take room users 
      // ✅ With this (remove `client !== socket`)
        for (const client of clients) {
        // orr if (client.readyState === 1 && client !== socket) {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              from: 'User',
              text: data.text,
              roomId: joinedRoom
            }));
          }
        }
      }
    }
    catch(err: any) {
      console.error("Invalid message received:", err.message);
    }
  });

  //Handle disconnection of user 

  socket.on('close',()=>{
    if(joinedRoom && rooms.has(joinedRoom)){//check if joinedRoom is their

      rooms.get(joinedRoom).delete(socket);
      
      //clean if the room is empty \

      if(rooms.get(joinedRoom).size===0 ){

        rooms.delete(joinedRoom);

      }
    }
  })
})

console.log("websocket is running ")
