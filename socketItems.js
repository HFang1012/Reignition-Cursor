var socket;
var currentRoom = null;
var cursors = {};
var players = {};
var chunkData = {};
var loadedChunks = [];
var chatMessages = [];
var myId;
var allIds = [];
var room = "NO ROOM";
var seed = 0;
var blocks = [];
function loadChunk(x,y){
  x=x-x%1000;
  y=y-y%1000;
  setNoiseSeed()
  let chunkKey = `${x}-${y}`;
  if(!loadedChunks.includes(chunkKey)){
    if(chunkData[chunkKey]){
      for(let block of chunkData[chunkKey].blocks){
        blocks[blocks.length] = new WorldObject(block.x,block.y,block.radius,"Block",block.chunkKey)
      }
    }else{
      let addedBlocks = [];
      let detail = 100;
      for(let i=0; i<=1000; i+=detail){
        for(let c=0; c<=1000; c+=detail){
          let canPlace = true;
          let div = .13727*8;
          let noiseValue = noise((x+i)/div,(y+c)/div)+noise((x+i)/(div+1),(y+c)/(div+1))/30;
            let noiseAngle = (noiseValue-0.8)*5*360;
          let noiseSize=noiseValue*noiseValue*250;
          for(let block of addedBlocks){
            if(dist(block.x,block.y,x+i,y+c)<=block.radius+noiseSize){
              canPlace = false;
            }
          }
           for(let block of blocks){
            if(dist(block.x,block.y,x+i,y+c)<=block.radius+noiseSize){
              canPlace = false;
            }
          }
          if(noiseValue>0.72&&canPlace&&dist(640, 360,x+i,y+c)>safeRadius+noiseSize){
            addedBlocks[addedBlocks.length] = new WorldObject(x+i,y+c,noiseSize,"Block",chunkKey)
          }
        }
      }
      for(let block of addedBlocks){
        blocks[blocks.length] =new WorldObject(block.x,block.y,block.radius,"Block",block.chunkKey)
      }
      chunkData[chunkKey] = {blocks: addedBlocks};
    }
    loadedChunks[loadedChunks.length] = chunkKey;
  //  print(`Generated Chunk: ${chunkKey}`)
  }else{
    //print(2)
  }
}
var availableRooms = {};
function loadSocket(){
socket = io("https://mmorpg-2if7.onrender.com");




// When connected
socket.on("connect", () => {
  myId = socket.id;
  blocks=[];
  console.log("Connected myId:", `${myId}`);
  console.log("Generated Seed:", `${seed}`);
  console.log("Current Room Name:", room);
  if(!allIds.includes(myId)) allIds[allIds.length] = myId
});

// Receive current room list (shown in lobby)
socket.on("rooms_list", (rooms) => {
  for(let keyd of Object.keys(rooms)){
    availableRooms[keyd] = rooms[keyd];
  }
 // console.log("Available rooms:", rooms);
});
  
 socket.on("initialState", (data) => {
  //cursors = { ...data};
  console.log("Joined room. Initial players:", `${Object.keys(cursors).length}`);
  currentRoom = true; // flag you are in a room
});

// New remote player joins your room
socket.on("newPlayer", (data) => {
  if(!allIds.includes(data.id)) allIds[allIds.length] = data.id;
  if(data.id!=socket.id){
 /*
   cursors[data.id] = {x: data.x, y: data.y,mouseProg: {prog: 0,dir: 1,tween: 0, tweenVel: 0,
    ammo: player.ammo,
    gunType: player.gunType,
     coloring: player.coloring}};
    players[data.id] = {
    x: mouse.x,
    y: mouse.y,
    cRoom: currentRoom,
    mouseProg: mouseProg,
    ammo: player.ammo,
    gunType: player.gunType,
    coloring: player.coloring,
      username: "d",
      chatText: ""
  };
  */
  
}
  
});

// Remote player leaves your room
socket.on("removePlayer", (id) => {
  allIds.splice(allIds.indexOf(id),1);
  if(players[id]?.x&&players[id]?.y&&players[id]?.coloring){
    for(let i=0; i<10; i++){
          let power = random(20,40);
          let angle = random(0,360);
          particles[particles.length] = new Particle(players[id].x,players[id].y,cos(angle)*power,sin(angle)*power,"Shape",myId,players[id].coloring)
        }
  }
  delete cursors[id];
  delete players[id];
});
//availableRooms
  socket.on("gotRooms", (data) => {
  if(data.id!=myId){
  availableRooms=data.roomData;
}
})
// Position updates from other players in room
socket.on("update", (data) => {
   if(!allIds.includes(data.id)) allIds[allIds.length] = data.id;
  //print(data.id,myId)
  if(data.id!=myId){
  framesSince=0;
 // print(data.cursorData.gunType)
    cursors [data.id] = {x: data.cursorData.x, y: data.cursorData.y,mouseProg: data.cursorData.mouseProg,
    ammo: data.cursorData.ammo,
    gunType: data.cursorData.gunType,
                       coloring: data.cursorData.coloring};
    cursors[data.id].cRoom = {currentRoom};
}
});
  socket.on("updateCh", (data) => {
    framesSince=0;
   if(!allIds.includes(data.id)) allIds[allIds.length] = data.id;
if(data.id!=myId){
  chatMessages[chatMessages.length] = data.chatData;
   hitParticleQueue[hitParticleQueue.length] = data?.chatData?.particleData
}
});

socket.on("updateP", (data) => {
  framesSince=0;
   if(!allIds.includes(data.id)) allIds[allIds.length] = data.id;
if(!players[data.id]){
  players[data.id]={};
}
    players [data.id] = {...data.playerData};
   players[data.id].cRoom = {currentRoom};
});
  
  socket.on("updateB", (data) => {
    framesSince=0;
    allIds.sort();
    if(allIds.indexOf(myId)!=-1&&data.id == allIds[(allIds.indexOf(myId)+1)%allIds.length]){
      if(!addedBullets.includes(data.bulletData.shotId)){
      // player.ammo+=data.bulletData.gained;
        addedBullets[addedBullets.length] = data.bulletData.shotId;
      }
    }
    if(data.id!=myId){
      shake = 8
bullets[bullets.length]=new Bullet(data.bulletData.x,data.bulletData.y,data.bulletData.xvel,data.bulletData.yvel,data.bulletData.type,data.bulletData.id,data.bulletData.coloring,data.bulletData.damageId);
      bullets[bullets.length-1].id = data.bulletData.bId;
    }
});
    socket.on("updateRb", (data) => {
      framesSince=0;
    let index = bullets.findIndex(holder => holder.id == data?.bulletData?.id);
    if(index!=-1){
      bullets[index].damage(data.bulletData.pId, data.bulletData.damage);
    }
});
  createRoom(room)
  joinRoom(room);
}
var addedBullets = [];
// sending your own updates
function createRoom(roomName) {
  if (!roomName) return;
  socket.emit("create_room", roomName);
  currentRoom = roomName
}

function joinRoom(roomName) {
  socket.emit("join_room", roomName);
  currentRoom = roomName
}
function sendPlayerUpdate() {
  if(room=="NO ROOM") return;
  if (!myId) return;
  if (!currentRoom) return; // do NOT send updates from lobby
//face, pointingA, directionTween, direction, coloring, 
  const myData = {
    x: player.x,
    y: player.y,
    face: player.face,
    pointingA: player.pointingA,
    directionTween: player.directionTween,
    direction: player.direction,
    coloring: player.coloring,
    cRoom: currentRoom,
    username: user,
    chatText: player.chatText,
    health: player.health,
    healthImpact: player.healthImpact,
    healthAngle: player.healthAngle,
    id: myId,
    ip: myIP
  };
  player[myId] = myData;
  socket.emit("updateData", myData); // client NEVER uses .to()
}
// sending your own updates
function sendUpdate() {
  if(room=="NO ROOM") return;
  if (!myId) return;
  if (!currentRoom) return; // do NOT send updates from lobby

  const myData = {
    x: mouse.x,
    y: mouse.y,
    cRoom: currentRoom,
    mouseProg: mouseProg,
    ammo: player.ammo,
    gunType: player.gunType,
    coloring: player.coloring,
  };
  //cursors[myId] = myData;
  socket.emit("updateCursor", myData); // client NEVER uses .to()
  
}