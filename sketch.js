var gunData = {"common": {zoom: 0.6, reload: 1.55,recoil: 0.5,display: "Common",regen: 2.5,details:"Shoots a single bullet!"},"spike": {zoom: 0.7, reload: 1.9,recoil: 4, display: "Spike",regen: 2.5,details:"Shoots four short spikes!"},"homing": {zoom: 0.5, reload: 1.6,recoil: 2,display: "Navigation",regen: 3,details:"Bullets avoid nearby walls!"},"bounce": {zoom: 0.7, reload: 1.2,recoil: 2,display: "Bounce",regen: 2.5,details:"Bullets bounce off walls!"},"magic": {zoom: 0.6, reload: 1.2, recoil: 0, display: "Magic",regen: 3.5,details:"Bullets moves towards nearby enemies!"},"shock": {zoom: 0.5, reload: 1.1, recoil: 3,display:"Shockwave",regen: 3,details:"Shoots a barrage of bullets!"},"dash": {zoom: 0.7, reload: 1.5, recoil: -4.5,display:"Dash",regen: 2,details:"Boosts the player forwards!"},"nuclex": {zoom: 0.53, reload: 1.35, recoil: 1,display:"Nuclex",regen: 3,details:"Bullets oscillate back and forth!"}, "recall": {zoom: 0.6, reload: 2, recoil: 0.5,display:"Reverb",regen: 1.45,details:"Bullets slowly start backtracking!"}, "bomb": {zoom: 0.6,reload: 1.7,recoil: 2,display:"Bomb",regen: 3.5,details:"Explodes with bullets on hit!"}, "snipe": {zoom: 0.4,reload:1.1,recoil:3,display:"Sniper",regen: 4,details:"Fast bullets deal double damage!"}, "phase":{zoom: 0.5,reload: 1.2,recoil: 1.6,display:"Phase",regen: 2.7,details:"Triples bullets through walls!"},"jumper":{zoom: 0.55,reload: 1.1,recoil: 1.8,display:"Jumper",regen: 2.9,details:"Jumps people!"}};
//"range": {zoom: 0.75, reload: 1.5,recoil: 2, display: "Ranger",regen: 1.5},
let guns = Object.keys(gunData);
var colors = ['rgb(141,236,243)','rgb(246,161,161)','rgb(241,221,135)','rgb(155,243,168)','rgb(141,176,244)','rgb(237,161,248)'];
var faces = ["scared","happy","evil","dead","shocked","sad","bruh","money","derp","ah"];
var user ="";
var shake = 0
var bullets = [];
var emptySound;
var player;
var particles = [];
var hitParticleQueue = [];
var version = "v3.3.2";
var playingTime = 0;
var helpMsgs = {"How to Play": `WASD or Arrow Keys To Move\nClick or Space to Shoot\nShoot Nodes To Change Stats\nEnter/Return to Open Chat\nTeams Are Sorted by Color\nHealth is Around Player\nAmmo is Around Cursor`,"Weapon Details": "Weapon","Developer Notes": `This Game is still in Development!\nMade By: HF_ang & Emey\nCreated With p5.js and socket.io\nReport Bugs to hfanggamedev\nVersion: ${version}\nHave Fun!!!`};
//"Combat Tips": `Use the Arrow to Track Positions\nPredict Where Enemies are Moving\nUse Walls To Your Advantage\nUse Recoil For Movement\nSave Ammo, Drain Theirs\nMove In All Directions\nShoot Multiple Shots At Once`,
var helpMsg = helpMsgs["How to Play"];
var selectedItem = {...faces}
/*
Version:
 Prototyping Shooting and Socket
 Main UI merged version
 PVP Weapon Changing
-
 New Gun Phase, Added Dummy ChangeObject, Added Spawn Details
-
 Spawn Details Clip, Added New Spawn Details
*/
var gamemode = "custom";
var ipData;
var myIP;
var enables = {spawn: true};
function preload(){
 pixelShader = loadShader("pixel.vert", "pixel.frag");
 emptySound = loadSound("empty-1.mp3")
 let url = "https://api.ipify.org?format=json";
 ipData = loadJSON(url);
}
function setup(){
 myIP = ipData.ip;
 print(myIP)
 let canvas = createCanvas(1280, 720, WEBGL);
 canvas.style('cursor', 'none');
 canvas.position(-width / 2, 0);
 pg = createGraphics(width, height);
 angleMode(DEGREES);
 rectMode(CENTER);
 pg.angleMode(DEGREES);
 pg.rectMode(CENTER);
 pg.textFont('itim')
 mouse = createVector(0, 0);
 pixelShader.setUniform("tex0", pg);
 pg.noSmooth();
 texture(pg);
 textureMode(NORMAL);
 pg.strokeWeight(10);
 player=new Player(640, 360);
 loadSocket();
 setInterval(CustomDraw, 1000/60);
 emptySound.loop();
 emptySound.setVolume(0);
}
var changeObjects = [];
var mouse={x:0,y:0};
var preMouse={x:0,y:0};
var mouseProg = {prog: 0,dir: 1,tween: 0, tweenVel: 0};
var fpsTrack = [];
var cameras = {x:640/2,y:360/2};
var frameCounts = 0;
var zoom = 0.6;
var safeRadius = 600;
function CustomDraw(){
  if(screen>0){
  if(enables.spawn&&changeObjects.length<=0){
changeObjects[changeObjects.length] = new WorldObject(width/2,height/2-safeRadius+130,80,"Gun","static");
  changeObjects[changeObjects.length] = new WorldObject(width/2,height/2+safeRadius-130,80,"Player","static");
 changeObjects[changeObjects.length] = new WorldObject(width/2-safeRadius+130,height/2,80,"Color","static");
 changeObjects[changeObjects.length] = new WorldObject(width/2+safeRadius-130,height/2,80,"Face","static");
  }
  if(!enables.spawn){
changeObjects = [];
  }
}
 player.id = myId;
 if(frameCounts%5==0){
   socket.emit("getRooms", {room: room});
  // console.log(availableRooms);
 }
 //print(cursors)
 if(screen>0){
   playingTime++;
 }
 if(keyIsDown(86)&&!typing&&screen>0){
   zoom+=((0.1)-zoom)/5
 }else{
 zoom+=((gunData[player.gunType].zoom ?? 1)-zoom)/10
  }
 canvas.style.cursor = 'none';
// print(blocks.length)
 delete availableRooms["NO ROOM"];
 delete cursors["NO ROOM"];
 noCursor();
 frameCounts++;
 cameras.x+=(player.x-cameras.x)/10;
 cameras.y+=(player.y-cameras.y)/10;
 pg.resetMatrix()
 //pg.clear();
// print(cameras.x-width/2,cameras.y-height/2)
 //pg.translate(cameras.x-width/2,cameras.y-height/2)
 if(cursors[myId]){
   delete cursors[myId];
 }
// print(cursors)
 mouseProg.tween+=mouseProg.tweenVel;
 if(mouseIsPressed){
   mouseProg.tweenVel-=(mouseProg.tween-(4+sin(frameCounts*7)*2))/5;
   mouseProg.prog+=mouseProg.dir/2;
 }else{
   mouseProg.tweenVel-=(mouseProg.tween-0)/5;
   mouseProg.prog+=mouseProg.dir;
 }
 mouseProg.tween+=min((dist(mouse.x,mouse.y,preMouse.x,preMouse.y))/20,20);
 mouseProg.tweenVel/=1.4;
 mouseProg.dir+=(abs(mouseProg.dir)/mouseProg.dir-mouseProg.dir)/10;
 preMouse = {...mouse};
 mouse = createVector(((mouseX*2-width-(-cameras.x+width/2))-cameras.x)/zoom+cameras.x,(mouseY*2-(-cameras.y+height/2)-cameras.y)/zoom+cameras.y);
 if(screen==0){
   mouse = createVector(((mouseX*2-width-(-cameras.x+width/2))),(mouseY*2-(-cameras.y+height/2)));
 }
 pg.background(20,210);
 if(screen>0){
 pg.translate(-cameras.x+width/2,-cameras.y+height/2)
 pg.translate(random(-shake,shake),random(-shake,shake))
 pg.translate(cameras.x,cameras.y)
 pg.scale(zoom,zoom)
 pg.translate(-cameras.x,-cameras.y)
 shake/=2.5
  
   pg.push();
   pg.noFill();
   pg.strokeWeight(10);
   pg.stroke("rgba(150,255,200,0.8)");
   let radius = safeRadius;
 for(let i=0; i<30; i++){
   pg.arc(width/2,height/2,radius*2,radius*2,i*360/30,(i+0.4)*360/30);
 }
   if(dist(player.x,player.y,width/2,height/2)<=50+radius){
          if(player.maxHealth-player.health>0){
    hitParticleQueue[hitParticleQueue.length] = {id: myId, damage: `+${player.maxHealth-player.health}`, coloring: "rgb(150,255,200)"};
 }
   player.health=player.maxHealth;
   }
   pg.pop();
 for(let i=particles.length-1; i>=0; i--){
   if(particles[i].layer==0){
   particles[i].work();
   if(particles[i].alive<=0){
     particles.splice(i,1);
   }
   }
 }
   for(let i=bullets.length-1; i>=0; i--){
   bullets[i].work();
   if(!bullets[i].alive){
     bullets.splice(i,1);
   }
 }
   //changeObjects[changeObjects.length]
   for(let i = changeObjects.length-1; i>=0; i--){
   changeObjects[i].work();
 }
 //BLOCKS
 for(let i = blocks.length-1; i>=0; i--){
   blocks[i].work();
   if(blocks[i].despawning){
     blocks.splice(i,1);
   }
 }
  player.work();
 noCursor();
/*
 x: player.x,
   y: player.y,
   face: player.face,
   pointingA: player.pointingA,
   directionTween: player.directionTween,
   direction: player.direction,
   coloring: player.coloring,
   cRoom: currentRoom,
*/
   pg.push()
   let angle = atan2(360-cameras.y,640-cameras.x)+90;
     pg.push();
     pg.resetMatrix();
     pg.translate(width/2,height/2);
     pg.rotate(angle);
     pg.strokeWeight(10);
   let targetV = createVector(cameras.x-width/2,cameras.y-height/2);
   targetV.normalize();
   targetV.mult(safeRadius+100)
   let targetX = width/2+targetV.x;
   let targetY = height/2+targetV.y;
  
     let dists = dist(targetX,targetY,cameras.x,cameras.y);
     let baseR = (-dists+((-abs((abs(max(-min((width/zoom)/2*(1/abs(cos(angle+90))),(height/zoom)/2*(1/abs(cos(angle)))),-dist(targetX,targetY,cameras.x,cameras.y))+100)))+dists)));
     let radius2 =baseR*zoom;
    
    // print(((-abs((abs(max(-min((width/zoom)/2*(1/abs(cos(angle+90))),(height/zoom)/2*(1/abs(cos(angle)))),-dist(chosen.x,chosen.y,cameras.x,cameras.y))+100)))+dists)))
     pg.translate(0,radius2);
     pg.stroke("rgba(150,255,200,1)");
    
  
   let size = min(5,(dist(640,360,cameras.x,cameras.y)/200*zoom));
     if(size>0&&dist(player.x,player.y,width/2,height/2)>=50+radius){
       pg.strokeWeight(size*2)
     pg.line(-2*size,size,0,-size);
     pg.line(2*size,size,0,-size);
     pg.ellipse(0,size*5,size/2,size/2);
     }
   pg.pop()
for(let i of Object.keys(players)){
   if(i!=myId){
     let item = players[i];
//print(item?.x,item?.y,item?.direction,item?.face,item.directionTween, item?.pointingA,item?.coloring,item?.username,item?.chatText)
     if(item?.x!=undefined&&item?.y&&item?.direction&&item?.face!=undefined&&item.directionTween!=undefined&& item?.pointingA!=undefined&&item?.coloring!=undefined&&item?.username!=undefined&&item?.chatText!=undefined&&item?.health!=undefined&&item?.healthImpact!=undefined&&item?.healthAngle!=undefined&&item?.ip!=undefined){
    let chosen = new Player(item.x,item.y);
       chosen.direction = item.direction;
       chosen.face = item.face;
       chosen.pointingA = item.pointingA;
       chosen.directionTween = item.directionTween;
       chosen.coloring = item.coloring;
     chosen.displayName = item.username;
     chosen.chatText = "";
     chosen.health = item.health;
     chosen.healthImpact = item.healthImpact;
     chosen.healthAngle = item.healthAngle;
     chosen.id = item.id;
      chosen.ip = item.ip;
       chosen.display();
     let angle = atan2(chosen.y-cameras.y,chosen.x-cameras.x)+90;
     pg.push();
     pg.resetMatrix();
     pg.translate(width/2,height/2);
     pg.rotate(angle);
     pg.strokeWeight(10);
     let dists = dist(chosen.x,chosen.y,cameras.x,cameras.y);
     let baseR = (-dists+((-abs((abs(max(-min((width/zoom)/2*(1/abs(cos(angle+90))),(height/zoom)/2*(1/abs(cos(angle)))),-dist(chosen.x,chosen.y,cameras.x,cameras.y))+100)))+dists)));
     let radius =baseR*zoom;
    
    // print(((-abs((abs(max(-min((width/zoom)/2*(1/abs(cos(angle+90))),(height/zoom)/2*(1/abs(cos(angle)))),-dist(chosen.x,chosen.y,cameras.x,cameras.y))+100)))+dists)))
     pg.translate(0,radius);
     pg.stroke(chosen.coloring);
     let size = min(5,(dist(chosen.x,chosen.y,cameras.x,cameras.y)/100*zoom));
     if(size>0){
       pg.strokeWeight(size*2)
     pg.line(-2*size,size,0,-size);
     pg.line(2*size,size,0,-size);
     }
     let ind = hitParticleQueue.findIndex(hold=>hold.id==item.id);
     if(ind!=-1){
       //print(cameras.x+cos(angle)*radius,cameras.y+sin(angle)*radius);
       let power = random(10,20);
         let angles = random(0,360);
        particles[particles.length] = new Particle(cameras.x+cos(angle+90)*baseR,cameras.y+sin(angle+90)*baseR,cos(angles)*power,sin(angles)*power,"Hit",myId,item.coloring)
      
       particles[particles.length-1].hitValue = hitParticleQueue[ind].damage;
       if(hitParticleQueue[ind]?.coloring){
          particles[particles.length-1].coloring = hitParticleQueue[ind].coloring;
          }
       hitParticleQueue.splice(ind,1);
     }
     pg.pop();
   }
   }
 }
for(let i=particles.length-1; i>=0; i--){
   if(particles[i].layer==1){
   particles[i].work();
   if(particles[i].alive<=0){
     particles.splice(i,1);
   }
   }
 }
     pg.push();
pg.beginClip({ invert: true });
pg.fill(255);
pg.ellipse(player.x,player.y,180+sin(frameCounts*2)*5,180+sin(frameCounts*2)*5);
pg.rect(player.x,player.y-110,user.length*30+sin(frameCounts*2)*5+5,100+sin(frameCounts*2)*5,100);
pg.endClip();
       pg.translate(width/2,height/2);
       pg.strokeWeight(2);
       pg.textSize(50);
let tintV = min((1- dist(player.x,player.y,width/2,height/2) /(200+safeRadius)) *600,255);
       pg.fill(255,tintV)
               pg.stroke(255,tintV)
       pg.textAlign(CENTER,CENTER);
       pg.text(helpMsg,0,0);
       pg.pop();
  mouseSprite(mouse.x,mouse.y,player.coloring,mouseProg,player.ammo,player.gunType);
 for(let i of Object.keys(cursors)){
   if(i!=myId){
     let item = cursors[i];
     if(item?.mouseProg){
        if(!item.coloring){
        item.coloring = "rgb(0,0,0)"
     }
     mouseSprite(item.x,item.y,item.coloring,item.mouseProg,item.ammo,item.gunType);
   }
   }
 }
 //ADDIDTIVE +HP
 if("Self Heals"){
 let ind = hitParticleQueue.findIndex(hold=>hold.id==myId);
 if(ind!=-1){
       //print(cameras.x+cos(angle)*radius,cameras.y+sin(angle)*radius);
       let power = random(10,20);
         let angles = random(0,360);
        particles[particles.length] = new Particle(player.x,player.y,cos(angles)*power,sin(angles)*power,"Hit",myId,player.coloring)
      
       particles[particles.length-1].hitValue = hitParticleQueue[ind].damage;
       if(hitParticleQueue[ind]?.coloring){
          particles[particles.length-1].coloring = hitParticleQueue[ind].coloring;
       }
       hitParticleQueue.splice(ind,1);
 }
}
if("Messages"){
 let ind = hitParticleQueue.findIndex(hold=>hold.message == true);
 if(ind!=-1){
       //print(cameras.x+cos(angle)*radius,cameras.y+sin(angle)*radius);
        particles[particles.length] = new Particle(hitParticleQueue[ind].x,hitParticleQueue[ind].y,random(-3,3),random(-3,-1),"Message",myId,"rgb(255,150,150)")
      
       particles[particles.length-1].hitValue = hitParticleQueue[ind].damage;
       if(hitParticleQueue[ind]?.coloring){
          particles[particles.length-1].coloring = hitParticleQueue[ind].coloring;
       }
       hitParticleQueue.splice(ind,1);
 }
}
    
if(showDetails){
    
 pg.push();
 pg.resetMatrix();
pg.fill(255,350-min(chatTransTween,100));
pg.textSize(50);
pg.noStroke();
pg.strokeWeight(1);
pg.stroke(255,350-min(chatTransTween,150));
fpsTrack[fpsTrack.length]=frameRate()/60*100
pg.text(`FPS: ${floor(fpsTrack[(fpsTrack.length-1)-(fpsTrack.length-1)%5]*60)/100}\nLast Server Update: ${framesSince}\nLobby Code: ${room}\nDetected Players: ${Object.keys(players).length+1}\nParticles: ${particles.length}, Blocks: ${blocks.length}, Bullets: ${bullets.length}`,20,50);
let iter = 0;
pg.strokeWeight(4);
pg.line(355-80,20,355-80,50)
for(let i=fpsTrack.length-1; i>=0; i--){
 pg.line(350+iter+4-80,120-fpsTrack[i-1],350+iter+5-80,120-fpsTrack[i]);
 iter++;
}
pg.pop();
}
let chatIter = 0;
let chatH = 0;
for(let i=chatMessages.length-1; i>=0; i--){
 pg.push();
  pg.resetMatrix();
 textAlign(LEFT,BOTTOM);
 pg.fill(255,350-i*30-max(chatTransTween,-50));
 pg.stroke(255,350-i*30-max(chatTransTween,-50));
 pg.strokeWeight(1);
 pg.textSize(42);
 let chatT = `${(chatMessages[chatIter].entityName!="") ? `${chatMessages[chatIter].entityName}: ` : ""}${chatMessages[chatIter].msg}`
   pg.text(chatT,20,700-i*42);
 pg.pop();
 chatIter++;
}
}else{
 //start pages _______--___-------
 selectionPage()
 mouseSprite(mouse.x,mouse.y,255,mouseProg,6,'common');
}


 //mouseSprite(mouse.x,mouse.y,"rgb(150,250,255)");
 //SHADER ITEMS
 shader(pixelShader);
 pixelShader.setUniform("tex0", pg);
 pixelShader.setUniform("resolution", [width, height]);
 pixelShader.setUniform("pixelSize", 1);
 rect(0, 0, width, height);
 if(frameCount%1==0){
    sendPlayerUpdate();
   sendUpdate();
 }
errorTimer--
framesSince+=1;
if(chatMessages.length!=lastChatMessages.length||typing){
 chatTrans=-2000-(chatMessages.length-lastChatMessages.length)*650;
 if(chatTransTween>650){
 chatTransTween=650;
    }
}
if(chatTransTween>=350){
for(let i=chatMessages.length-1; i>=0; i--){
  if(chatMessages[i]?.entityName==""||chatMessages[i]?.entityName=="Server"){
     chatMessages.splice(i,1);
     }
}
       lastChatMessages = [...chatMessages];
}
chatTrans+=20;
//print(chatTransTween)
chatTransTween+=(chatTrans-chatTransTween)/30;
lastChatMessages = [...chatMessages];
}
var chatTrans = 100;
var chatTransTween = 100;
var lastChatMessages = chatMessages;
var framesSince = 0;
var typing = false;
var currentMessage = "";
var showDetails = false;
function keyPressed(){
 let noKeys = ["Shift","Meta","CapsLock","Control","Alt","Command","Option","Enter","Backspace","ArrowUp","ArrowLeft","ArrowRight","ArrowDown","Escape","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"];
 for(let block of changeObjects){
 if (dist(player.x,player.y,block.x,block.y)<block.radius+50){
   let len = guns.length;
     if(block.type=="Face"){
      len = faces.length;
      }else if(block.type=="Color"){
        len = colors.length;
      }else if(block.type=="Player"){
        len = Object.keys(helpMsgs).length;
      }
   if(!typing){
         if (key=="q"){
           block.gunStage+=len-1;
         }else if (key == "e"){
           block.gunStage++;
         }
 }
       }
}
 if(key==" "&&screen>0&&!typing){
   attemptShoot();
 }
 if(typing){
 if(key=="Backspace"&& currentMessage.length>=1){
     currentMessage= currentMessage.slice(0,currentMessage.length-1);
    }else if(key=="Tab"){
    currentMessage+="  ";
    }else if(!noKeys.includes(key)){
  currentMessage+=key
    }
   if(keyIsDown(13)){
     let isCommand = true;
     let particleData = {damage: `${currentMessage}`, coloring: 255, x: player.x, y: player.y-125,message: true};
             if(currentMessage.length>0&&currentMessage[0]!="/"){
       hitParticleQueue[hitParticleQueue.length] = particleData
               isCommand = false;
     }
     let askedHelp = false;
      if(currentMessage=="/help"){
        askedHelp=true;
       currentMessage=`${player.displayName} asked for help(\"/help\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     chatMessages[chatMessages.length] = {msg: "Here's a List of Commands!", timer: 120, id: myId, entityName: "Server"};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   /help, /copy, /ammo [AMOUNT], /newgun <TYPE>", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   /newface <TYPE>, /newcolor <NUMBER>, /players", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   /tp <PLAYER>, /teleport <PLAYER>, /tp <X> <Y>", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   /teleport <X> <Y>, /cords, /stats, /details", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   /controls, /guns, /customization, /clearchat", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "Note: Report any bugs to devs(\"/details\")", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     }else if(currentMessage=="/controls"){
        askedHelp=true;
       currentMessage=`${player.displayName} asked for help(\"/help\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     chatMessages[chatMessages.length] = {msg: "Here's a List of Game Controls(keyboard)!", timer: 120, id: myId, entityName: "Server"};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Movement: WASD & Arrow Keys", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Shooting: Left Click & Space to shoot", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Return/Enter to open chat", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   v to zoom out(dev tool)", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "Note: This version of the game is built for Mac", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "other browsers/computers may experience bugs...", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     }else  if(currentMessage=="/details"){
        askedHelp=true;
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       currentMessage=`${player.displayName} asked for dev details(\"/details\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
     chatMessages[chatMessages.length] = {msg: "Here's some details on our game!", timer: 120, id: myId, entityName: "Server"};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Created by: Empty Console Team", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Code: HF_ang & Emey", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   Design: HF_ang & Emey & ShyGuy", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   This game is currently in progress!!!", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "Note: Please don't mod or use any of our code without permission!", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "Contact: hfanggamedev(discord) for details on code!", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       //["scared","happy","evil","dead"];
     }else  if(currentMessage=="/customization"){
      
        askedHelp=true;
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       currentMessage=`${player.displayName} asked for customization details(\"/customization\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
     chatMessages[chatMessages.length] = {msg: "Here's a list of customization details(commands)!", timer: 120, id: myId, entityName: "Server"};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       // {"common": {zoom: 0.6, reload: 1.55,recoil: 0.5},"spike": {zoom: 0.8, reload: 1.9,recoil: 4},"range": {zoom: 0.75, reload: 1.5,recoil: 2},"homing": {zoom: 0.5, reload: 1.6,recoil: 2},"bounce": {zoom: 0.7, reload: 1.2,recoil: 2},"magic": {zoom: 0.6, reload: 1.4, recoil: 0}};
        chatMessages[chatMessages.length] = {msg: "Colors(\"/newface <NAME>\")", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   \"scared\", \"happy\", \"evil\", \"dead\"", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "Colors(\"/newcolor <NUMBER>\")", timer: 120, id: myId, entityName: ""};
        ['rgb(141,236,243)','rgb(246,161,161)','rgb(241,221,135)','rgb(155,243,168)','rgb(141,176,244)','rgb(237,161,248)'];
        chatMessages[chatMessages.length] = {msg: "   0: Cyan, 1: Red, 2: Yellow, 3: Green, 4: Blue" , timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "Note: These options are planned to be moved!", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     }else  if(currentMessage=="/guns"){
      
        askedHelp=true;
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       currentMessage=`${player.displayName} asked for game details(\"/guns\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
     chatMessages[chatMessages.length] = {msg: "Here's a list of guns(\"/newgun <NAME>\")!", timer: 120, id: myId, entityName: "Server"};
        chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
       // {"common": {zoom: 0.6, reload: 1.55,recoil: 0.5},"spike": {zoom: 0.8, reload: 1.9,recoil: 4},"range": {zoom: 0.75, reload: 1.5,recoil: 2},"homing": {zoom: 0.5, reload: 1.6,recoil: 2},"bounce": {zoom: 0.7, reload: 1.2,recoil: 2},"magic": {zoom: 0.6, reload: 1.4, recoil: 0}};
        chatMessages[chatMessages.length] = {msg: "   \"common\", \"spike\", \"range\"", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "   \"homing\", \"bounce\", \"magic\"", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
        chatMessages[chatMessages.length] = {msg: "Note: These are simply names(not descriptions)!", timer: 120, id: myId, entityName: ""};
       chatMessages[chatMessages.length] = {msg: "-~-~-~-~-~-~-~-~-~-~-~-~-~-~", timer: 120, id: myId, entityName: ""};
     }else  if(currentMessage=="/stats"){
        askedHelp=true;
       currentMessage=`${player.displayName} toggled stats(\"/stats\")!`
        //Commands: /help, /copy, /ammo [AMOUNT], /newgun <TYPE>, /newface <TYPE>, /newcolor <NUMBER>, /players, /tp <PLAYER>, /teleport <PLAYER>
    
     chatMessages[chatMessages.length] = {msg: "Stat's Shown, Type \"/stats\" to toggle!", timer: 120, id: myId, entityName: "Server"};
       showDetails=!showDetails;
     }
     //showDetails
     else if(currentMessage=="/copy"){
       currentMessage=`${player.displayName} Copied Lobby Code: ${room}!`;
       copyStringToClipboard(room)
     }else if(currentMessage=="/clearchat"){
       currentMessage=`${player.displayName} Cleared Chat(\"/clearchat\")!`;
       chatMessages = [];
       lastChatMessages = [];
     }
     else if(currentMessage.slice(0,5)=="/ammo"){
       let splits = currentMessage.split(" ");
       if (splits.length ==2&&parseInt(splits[1])) {player.ammo+=parseInt(splits[1]); currentMessage=`Given Ammo: ${parseInt(splits[1])}!`;} else{currentMessage=`You Have ${player.ammo} Ammo`;}
     }
     else if(currentMessage.slice(0,8)=="/players"){
       let p = `${player.displayName}`;
       for (let i of Object.keys(players)){
         let item = players[i];
         if(p!=""){
           p+=", "
         }
         p +=item?.username
       }
         //p-=", ";
       currentMessage=`Lobby Players: ${p}!`;
     }
     else if(currentMessage.slice(0,8)=="/newgun "){
       let splits = currentMessage.split(" ");
       if(guns.includes(splits[1])){
       player.gunType = splits[1];
       currentMessage=`Changed ${player.displayName}'s Gun to ${player.gunType}!`;
       }
     }
       else if(currentMessage.slice(0,6)=="/cords"){
       currentMessage=`${player.displayName} is at ${round(player.x)}, ${round(player.y)}!`;
       }
     else if(currentMessage.slice(0,4)=="/tp "||currentMessage.slice(0,10)=="/teleport "){
       let splits = currentMessage.split(" ");
       if (splits.length ==2){
       let t = splits[1]
       let p = `Couldn't Find Player`;
       for (let i of Object.keys(players)){
         let item = players[i];
         if (item.username == splits[1]&&item.username!=player.displayName){
        
         player.x = item.x
           player.y = item.y
           p=str(item?.username)
         }else{
           p=`Couldn't Find Player`
         }
       }
       currentMessage=`Teleported ${player.displayName} to ${p}!`;
       }
       if (splits.length ==3){
       let t = [splits[1],splits[2]]
       let p = `Couldn't Teleport`;
         if (parseInt(splits[1])&&parseInt(splits[2])){
           p = `${splits[1]}, ${splits[2]}`
           player.x = float(splits[1])
           player.y = float(splits[2])
      
         }
         currentMessage=`Teleported ${player.displayName} to ${p}!`;
       }
     }
     else if(currentMessage.slice(0,10)=="/newcolor "){
       let splits = currentMessage.split(" ");
       if(colors[splits[1]]){
       player.coloring = colors[splits[1]];
       currentMessage=`Changed ${player.displayName}'s Color to ${player.coloring}!`;
       }
     }
     else if(currentMessage.slice(0,9)=="/newface "){
       let splits = currentMessage.split(" ");
       if(faces.includes(splits[1])){
       player.face = splits[1];
       currentMessage=`Changed ${player.displayName}'s Face to ${player.face}!`;
       }
     }
        else if(currentMessage.slice(0,1)=="/"){
     currentMessage = "Unknown Command, Type /help to see all commands!";
     }
     if(currentMessage!=""){
     let chatData = {msg: currentMessage, timer: 120, id: myId, entityName: isCommand ? "Server" : user, particleData: particleData };
       if(!askedHelp){
     chatMessages[chatMessages.length] = chatData;
       }
     currentMessage = "";
      socket.emit("updateChat", chatData);
     }
    
      }
   player.chatText = currentMessage;
 }
   if(keyIsDown(13)&&screen>0){
   typing=!typing;
 }
 if(screen ==0&&lobbyType){
   if(key=="Enter"){
       if((Object.keys(availableRooms).includes(lobbyCode)||lobbyCode=="d"&&Object.keys(availableRooms).length>0)&&screen==0&&usernameText){
         if(lobbyCode=="d"){
           lobbyCode=Object.keys(availableRooms)[0]
         }
      joinRoom(lobbyCode)
   room = lobbyCode;
   user=usernameText
   player.displayName=usernameText
     lobbyCode = "";
       }else if(usernameText.length==0){
         roomError(0);
       }
   }
   if(lobbyTyper){
 if(key=="Backspace"&& lobbyCode.length>=1){
     lobbyCode= lobbyCode.slice(0,lobbyCode.length-1);
    }else if(key=="Tab"){
    lobbyCode+="  ";
    }else if(!noKeys.includes(key)){
  lobbyCode+=key
    }
   }
 }
   if(!Object.keys(availableRooms).includes(lobbyCode)&&key=="Enter"&&lobbyType){
         roomError(1);
       }
 if(screen ==0&&usernameType){
 if(key=="Backspace"&& usernameText.length>=1){
     usernameText= usernameText.slice(0,usernameText.length-1);
    }else if(key=="Tab"){
    usernameText+="  ";
    }else if(!noKeys.includes(key)){
  usernameText+=key
    }
 }
 lobbyCode=lobbyCode.slice(0,min(lobbyCode.length,10))
 usernameText=usernameText.slice(0,min(usernameText.length,15))
}
window.addEventListener("paste", (e) => {
 if(lobbyCode[lobbyCode.length-1]=="v") lobbyCode = "";
 const pastedText = (e.clipboardData || window.clipboardData).getData("text");
 if(screen ==0&&lobbyTyper){
  lobbyCode+=pastedText;
   }
   if(screen==0&&usernameType){
  usernameText+=pastedText;
    }
 lobbyCode=lobbyCode.slice(0,min(lobbyCode.length,10))
 usernameText=usernameText.slice(0,min(usernameText.length,15))
// console.log("Pasted:", pastedText);
});
function attemptShoot(){
   if(player.ammo>0&&screen>0&&player.healthImpact<=0.001){
      if(dist(player.x,player.y,width/2,height/2)>50+safeRadius){
      player.ammo-=1;
      }
      let dmgId = generateCode();
     let shotId = generateCode();
   let angle = atan2(mouse.y-player.y,mouse.x-player.x);
   let offset = 0.1;
   let amount = 1;
   if(player.gunType=="spike"){
     offset=50;
     amount =4;
   }else if(player.gunType=="shock"){
     offset=50;
     amount =6;
   }else if(player.gunType=="dash"){
     offset=0;
     amount =3;
   }else if(player.gunType=="range"){
     offset=2;
     amount = 3;
   }else if(player.gunType=="nuclex"){
     amount = 2;
   }
   for(let i=0; i<amount; i++){
     let sizer = 0
     let randomAngle = random(-offset,offset);
     if(player.gunType=="spike"&&i==0){
       randomAngle = 0;
     }
      if(player.gunType=="range"){
        randomAngle=(i-1)*random(25,30);
      }
     // if(player.gunType=="phase"){
     //    randomAngle=(i-1)*random(25,30);
     //  }
     if(player.gunType=="nuclex"){
        randomAngle=0;
      }
     if(player.gunType=="shock"){
        randomAngle=(i-(amount-1)/2)*10;
      }
     if(player.gunType=="dash"){
       if(i==0){
        randomAngle=0;
       }else if(i==1){
         randomAngle=40
       }else if(i==2){
         randomAngle=-40
       }
      }
   let bulletV = createVector(cos(angle+randomAngle),sin(angle+randomAngle));
 bulletV.normalize();
     if(player.gunType=="range"){
        if(i==1){
           bulletV.mult(40);
        }else{
            bulletV.mult(30);
        }
     }else if(player.gunType=="homing"){
        bulletV.mult(20);
     }else if(player.gunType=="bomb"){
       sizer = 100
        bulletV.mult(13);
     }else if(player.gunType=="spike"){
        bulletV.mult(35);
     }else if(player.gunType=="bounce"){
        bulletV.mult(22);
     }else if(player.gunType=="common"){
        bulletV.mult(30);
     }else if(player.gunType=="magic"){
        bulletV.mult(20);
     }else if(player.gunType=="shock"){
        bulletV.mult(14.5);
     }else if(player.gunType=="recall"){
        bulletV.mult(min(dist(mouse.x,mouse.y,player.x,player.y)/20,dist(width/2,height/2,width,height)/20));
     }else if(player.gunType=="nuclex"){
        bulletV.mult(20);
     }else if(player.gunType=="snipe"){
        bulletV.mult(43);
     }else if(player.gunType=="phase"){
       bulletV.mult(30)
     }else if(player.gunType=="jumper"){
       bulletV.mult(18)
     }else{
       bulletV.mult(30);
     }
     if(player.gunType=="dash"){
       if(i==0){
          bulletV.mult(2);
       }else if(i==1){
          bulletV.mult(-0.3);
       }else if(i==2){
          bulletV.mult(-0.3);
       }
      }
     let emittedBullet = player.gunType;
     if(player.gunType=="nuclex"){
       if(i==0){
         emittedBullet="nuclex1"
       }else{
          emittedBullet="nuclex2"
       }
     }
     if(player.gunType!="shock"){
       dmgId = generateCode();
     }
 bullets[bullets.length]=new Bullet(player.x,player.y,bulletV.x,bulletV.y,emittedBullet,myId,player.coloring,dmgId);
     bullets[bullets.length-1].shotId = shotId;
 let bulletData = {x: player.x,y: player.y,xvel: bulletV.x,yvel: bulletV.y,type:  emittedBullet,id: myId,coloring: player.coloring,bId: bullets[bullets.length-1].id,gained: 1,damageId: dmgId,shotId: shotId};
   //recoil
   socket.emit("updateBullet", bulletData);
 }
   let bulletVE = createVector(cos(angle),sin(angle));
   bulletVE.normalize();
 bulletVE.mult(30/4);
     player.kbxvel-=bulletVE.x*gunData[player.gunType].recoil;
   player.kbyvel-=bulletVE.y*gunData[player.gunType].recoil;
    shake = 8
 }else{
    shake = 15
 }
 if(screen>0&&player.healthImpact<=0.001){
 if(dist(player.x,player.y,width/2,height/2)<=50+safeRadius){
   player.healthImpact+=0.5;
 }else{
    player.healthImpact+=15;
 }
 }
}
function mouseReleased(){
 mouseProg.tweenVel+=5;
 mouseProg.dir*=1.3;
 mouseProg.dir=constrain(mouseProg.dir,-11,11);
 attemptShoot();
}
var errorTimer = 0
var errorType
function roomError(type1){
 if (type1==undefined)type1=0
 errorTimer=300
 shake=25;
 errorType=type1
}
function randomId() {
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
 let id = "";
 for (let i = 0; i<10; i++) {
   id += chars.charAt(floor(random(chars.length)));
 }
 return id;
}


//x,y,xvel,yvel,type,id,coloring
function mousePressed(){
 mouseProg.tweenVel-=10;
 mouseProg.dir*=-4;
 mouseProg.dir=constrain(mouseProg.dir,-11,11);
 shake=2
 if (rectHit(rx,500,mouse.x,mouse.y,500,70,5,5)&&screen==0){
   lobbyType = true
   lobbyTyper=true;
   usernameType = false
 }else{
   //print(lobbyCode)
   lobbyTyper=false;
   if(lobbyCode==""){
   lobbyType = false
   }
 }
 if (rectHit(1280/2-220,600,mouse.x,mouse.y,70,70,5,5)&&screen==0){
   lobbyType = false
   lobbyTyper=false;
   hanger = true
 }
 //royale
 if (rectHit(brx,500,mouse.x,mouse.y,200,70,5,5)&&screen==0){
   if (usernameText){
   let code = "NONE";
   let highestRoom = {name: "NONE",players:0};
   // rooms[roomData.name] = { players: {}, blocks: {},
   // type: roomData?.type ?? "custom",started: false, startingPlayers: {}};
    for(let keyR in availableRooms){
       if(availableRooms[keyR].type=="royale"){
          highestRoom = {name: keyR, players: Object.keys(availableRooms[keyR].players).length};
       }
    }
    if(highestRoom?.name=="NONE"){
      createRoom({name: code, type: "royale"});
      code = generateCode();
    }else{
      code = highestRoom.name;
    }
    joinRoom(code)
    gamemode = "royale";
   room = code;
   copyStringToClipboard(code)
   user=usernameText
   player.displayName=usernameText
     setNoiseSeed();
    
   }else{
     roomError(0)
   }
   // currentRoom = true
 }
 if (rectHit(rx4,600,mouse.x,mouse.y,400,70,5,5)&&screen==0){
   usernameType = true
  if(lobbyCode==""){
   lobbyType = false
   }
   lobbyTyper=false;
 }else{
   usernameType = false
 }
 if (rectHit(rx2,500,mouse.x,mouse.y,150,70,5,5)&&screen==0){
   if (usernameText){
   let code = generateCode()
   createRoom({name: code, type: "custom"})
   joinRoom(code)
   room = code;
   copyStringToClipboard(code)
   user=usernameText
   player.displayName=usernameText
     setNoiseSeed();
   }else{
     roomError(0)
   }
   // currentRoom = true
 }
 if (rectHit(1280/2+240,500,mouse.x,mouse.y,150,70,5,5)&&lobbyType||lobbyCode.length>0&&rectHit(1280/2+240,500,mouse.x,mouse.y,150,70,5,5)){
    if(Object.keys(availableRooms).includes(lobbyCode)&&screen==0&&usernameText){
      joinRoom(lobbyCode)
   room = lobbyCode;
   user=usernameText
   player.displayName=usernameText
      setNoiseSeed();
       }else if(usernameText.length==0&&screen==0){
         roomError(0);
       }
 }
 if(!Object.keys(availableRooms).includes(lobbyCode)&&screen==0&&rectHit(1280/2+240,500,mouse.x,mouse.y,150,70,5,5)&&lobbyCode.length>0){
         roomError(1);
       }
}
 function setNoiseSeed(){
   seed = 0;
 let offset=0;
 for(let c of room){
   offset+=5230*c.charCodeAt(0);
   seed+=c.charCodeAt(0)*c.charCodeAt(0)*c.charCodeAt(0)+offset;
 }
 noiseSeed(seed);
 }
function mouseSprite(x,y,color,mouseProgs,ammo,type){
 pg.push();
 pg.strokeWeight(10);
 pg.stroke(color);
 pg.translate(x,y);
 let md = 10+mouseProgs.tween/3;
 let ms = 30+mouseProgs.tween;
 if(color==255){
   ms-=5;
 }
 pg.rotate(mouseProgs.prog*2);
 let sides = ammo;
  for(let i=0; i<sides; i++){
   pg.rotate(360/sides);
   if(type=="common"){
     pg.line(-ms,-ms,-ms+md,-ms);
     pg.line(-ms,-ms,-ms,-ms+md);
   }else if(type=="spike"){
     pg.noFill();
     pg.line(-6-mouseProgs.tween/3,35+mouseProgs.tween/2,6+mouseProgs.tween/3,35+mouseProgs.tween/2);
     pg.line(0,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="snipe"){
     pg.noFill();
     pg.line(-6-mouseProgs.tween/3,25+mouseProgs.tween/2,6+mouseProgs.tween/3,25+mouseProgs.tween/2);
     pg.line(-6-mouseProgs.tween/3,45+mouseProgs.tween/2,6+mouseProgs.tween/3,45+mouseProgs.tween/2);
     pg.line(0,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="range"){
     pg.noFill();
     pg.line(5,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
     pg.line(-5,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
     pg.line(0,20+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }
   else if(type=="homing"){
     pg.noFill();
     pg.line(-5,30+mouseProgs.tween/2,5,40+mouseProgs.tween/2);
     pg.line(5,30+mouseProgs.tween/2,-5,40+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="bounce"){
     pg.noFill();
     pg.ellipse(0,30+mouseProgs.tween/2,11,11+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="magic"){
     pg.noFill();
     pg.beginShape();
     for(let i=0; i<30; i++){
     pg.vertex(sin(i/30*180+mouseProgs.tween*50)*(3+mouseProgs.tween/30),20+mouseProgs.tween/2+i/2);
     }
     pg.endShape();
     pg.beginShape();
     for(let i=0; i<30; i++){
     pg.vertex(sin(i/30*180+mouseProgs.tween*50)*(3+mouseProgs.tween/30),-(20+mouseProgs.tween/2+i/2));
     }
     pg.endShape();
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }
   else if(type=="shock"){
     pg.noFill();
     pg.arc(0,0,80+mouseProgs.tween,80+mouseProgs.tween,(-180/(ammo*2.5)),(180/(ammo*2.5)))
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="dash"){
     pg.noFill();
     pg.line(5,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
     pg.line(-5,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
     pg.line(0,20+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
   }else if(type=="nuclex"){
     pg.noFill();
     // pg.translate(0,10+sin(frameCounts-(360/i)*180/PI)*20)
     pg.line(5,40+mouseProgs.tween/2,0,30+mouseProgs.tween/2);
     pg.line(-5,40+mouseProgs.tween/2,0,30+mouseProgs.tween/2);
     pg.line(0,40+mouseProgs.tween/2,0,20+mouseProgs.tween/2);
   }else if(type=="phase"){
     pg.noFill()
     pg.line(0-mouseProgs.tween/3,35+mouseProgs.tween/2,-6+mouseProgs.tween/3,45+mouseProgs.tween/2);
     pg.line(0-mouseProgs.tween/3,35+mouseProgs.tween/2,6+mouseProgs.tween/3,45+mouseProgs.tween/2);
     pg.line(0,30+mouseProgs.tween/2,0,40+mouseProgs.tween/2);
   }else if(type=="recall"){
     pg.noFill();
     // pg.translate(0,10+sin(frameCounts-(360/i)*180/PI)*20)
     pg.line(12,50+mouseProgs.tween/2,0,30+mouseProgs.tween/2);
     pg.line(-5,45+mouseProgs.tween/2,0,30+mouseProgs.tween/2);
      pg.line(12,30+mouseProgs.tween/2,0,50+mouseProgs.tween/2);
     pg.line(-5,30+mouseProgs.tween/2,0,45+mouseProgs.tween/2);
   }else if(type=="bomb"){
     pg.noFill();
     // pg.translate(0,10+sin(frameCounts-(360/i)*180/PI)*20)
     pg.ellipse(0,35+mouseProgs.tween/2,15,15+mouseProgs.tween/2);
     pg.line(0,20+mouseProgs.tween/2,0,50+mouseProgs.tween/2);
     pg.line(-15,35+mouseProgs.tween/2,15,35+mouseProgs.tween/2);
   }else if(type=="shadow"){
     pg.noFill();
     // pg.translate(0,10+sin(frameCounts-(360/i)*180/PI)*20)
     pg.ellipse(0,35+mouseProgs.tween/2,10,10+mouseProgs.tween/2);
     pg.line(0,25+mouseProgs.tween/2,0,45+mouseProgs.tween/2);
     pg.line(-10,28+mouseProgs.tween/2,10,28+mouseProgs.tween/2);
   }
 }
 if(type=="range"){
    pg.rotate(360/sides/2);
 for(let i=0; i<sides; i++){
   pg.rotate(360/sides);
     pg.noFill();
     pg.line(5,30+mouseProgs.tween/2,0,35+mouseProgs.tween/2);
     pg.line(-5,30+mouseProgs.tween/2,0,35+mouseProgs.tween/2);
     //pg.line(0,20+mouseProgs.tween/2,0,35+mouseProgs.tween/2);
    // pg.arc(0,0,60+mouseProgs.tween,60+mouseProgs.tween,-360/(ammo+30),360/(ammo+30));
 }
 }
 pg.pop();
  pg.push();
 pg.translate(x,y);
 pg.strokeWeight(10);
 pg.stroke(color);
 pg.rotate(15*((mouseProgs.dir/abs(mouseProgs.dir)))+mouseProgs.prog/3)
 let mr = 10;
 pg.line(-mr,0,mr,0);
 pg.line(0,-mr,0,mr);
 pg.pop();
}
function ischar(x){
 var is =0;
 var letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
 for(var i=0; i<letters.length; i++){
   if(x==letters[i]){
      is = i
   }
 }
 if(x=="up"){
   return 38
 }
 if(x=="down"){
   return 40
 }
 if(x=="left"){
   return 37
 }
 if(x=="right"){
   return 39
 }
 is+=65;
 return is
}
function rectHit(x,y,x2,y2,xs,ys,xs2,ys2){
 return(abs(x-x2)<xs/2+xs2/2&&abs(y-y2)<ys/2+ys2/2);
}
function copyStringToClipboard(str) {
 // Replace literal newlines with escaped \n
 const escapedStr = str.replace(/\n/g, '\\n');
  // Create new element
 var el = document.createElement('textarea');
 // Set value (string to be copied)
 el.value = escapedStr;
 // Set non-editable to avoid focus and move outside of view
 el.setAttribute('readonly', '');
 el.style.position = 'absolute';
 el.style.left = '-9999px';
 document.body.appendChild(el);
 // Select text inside element
 el.select();
 // Copy text to clipboard
 document.execCommand('copy');
 // Remove temporary element
 document.body.removeChild(el);
 console.log("Copied To Clipboard!");
}

