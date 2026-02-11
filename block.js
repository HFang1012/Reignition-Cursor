class WorldObject{
  constructor(x,y,radius,type,chunkKey){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseRadius = this.radius;
    this.type = type ?? "Block";
    this.despawning = false;
    this.marked = false;
    this.chunkKey = chunkKey;
    this.gunStage = 1;
    this.preGunStage = 0;
    this.shotsTaken = [];
    this.bullet = new Bullet(this.x,this.y,0,0,"spike",myId,player.coloring,0);
    this.bullet.canMove = false;
    this.sizeVel = 0;
    this.player = new Player(this.x,this.y);
    this.player.health = 0;
    this.player.falsePlayer = true;
  }
    display(){
      if(this.type=="Gun"){
        this.radius+=this.sizeVel;
        this.sizeVel/=1.2;
        this.sizeVel+=(this.baseRadius-this.radius)/10;
        let chosenGun = guns[this.gunStage%guns.length];
        
    pg.push();
    pg.translate(this.x,this.y);
         pg.rotate(-frameCounts*0.5)
    pg.beginShape();
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(player?.coloring);
    pg.fill(20)
    let sides = 9;
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i)*this.radius,sin(360/sides*i)*this.radius);
    }
    //pg.text();
    pg.endShape(CLOSE);
    
    pg.pop();
        pg.push();
        pg.translate(this.x,this.y);
        pg.strokeWeight(2);
        pg.textSize(50);
        pg.fill(player?.coloring)
                pg.stroke(player?.coloring)
        pg.textAlign(CENTER,BOTTOM);
        pg.text(`Switch to Weapon:\n${gunData[chosenGun].display}`,0,205);
        pg.pop();
    mouseSprite(this.x,this.y,player.coloring,{prog: frameCounts,dir: 1,tween: 10+sin(frameCounts*5)*2.5, tweenVel: 0},3,chosenGun);
        pg.fill(20);
        pg.noStroke();
        pg.ellipse(this.x,this.y,50,50);
        player.gunType=guns[(this.gunStage+guns.length-1)%guns.length];
        if(this.preGunStage!=this.gunStage){
          this.bullet = new Bullet(this.x,this.y,0,0,(chosenGun=="nuclex")? "nuclex1" : chosenGun,myId,player.coloring,0);
          this.bullet.canMove = false;
          for(let i=0; i<20; i++){
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x+cos(angle)*(this.baseRadius+40),this.y+sin(angle)*(this.baseRadius+40),cos(angle)*3,sin(angle)*3,"Shape",myId,player.coloring)
        }
        }
        this.bullet.size = min(90,this.bullet.size);
        this.bullet.xvel = cos(frameCounts);
        this.bullet.yvel = sin(frameCounts);
        this.bullet.coloring = player.coloring;
        this.bullet.work();
        this.preGunStage = this.gunStage;
    }
      if(this.type=="Color"){
        this.radius+=this.sizeVel;
        this.sizeVel/=1.2;
        this.sizeVel+=(this.baseRadius-this.radius)/10;
        let chosenGun = guns[this.gunStage%guns.length];
    pg.push();
    pg.translate(this.x,this.y);
        pg.rotate(frameCounts*0.5)
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(colors[(this.gunStage)%colors.length]);
    pg.fill(20)
        for(let c = 0; c<3; c++){
              pg.beginShape();
    let sides = 9-c;
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i+c*50)*(this.radius-c*30),sin(360/sides*i+c*50)*(this.radius-c*30));
    }
              pg.endShape(CLOSE);
        }
    //pg.text();
    
    pg.pop();
        player.coloring=colors[(this.gunStage+colors.length-1)%colors.length];
        if(this.preGunStage!=this.gunStage){
          for(let i=0; i<20; i++){
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x+cos(angle)*(this.baseRadius+40),this.y+sin(angle)*(this.baseRadius+40),cos(angle)*3,sin(angle)*3,"Shape",myId,player.coloring)
        }
        }
        this.preGunStage = this.gunStage;
    }
      
      if(this.type=="Face"){
        this.player.coloring = player.coloring;
        this.radius+=this.sizeVel;
        this.sizeVel/=1.2;
        this.sizeVel+=(this.baseRadius-this.radius)/10;
        let chosenGun = faces[this.gunStage%faces.length];
        this.player.face = chosenGun;
    pg.push();
    pg.translate(this.x,this.y);
        pg.rotate(-frameCounts*0.5)
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(player.coloring);
    pg.fill(20)
        for(let c = 0; c<1; c++){
              pg.beginShape();
    let sides = 9-c;
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i+c*50)*(this.radius-c*30),sin(360/sides*i+c*50)*(this.radius-c*30));
    }
              pg.endShape(CLOSE);
        }
    //pg.text();
    
    pg.pop();
        this.player.display();
        player.face=faces[(this.gunStage+faces.length-1)%faces.length];
        if(this.preGunStage!=this.gunStage){
          for(let i=0; i<20; i++){
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x+cos(angle)*(this.baseRadius+40),this.y+sin(angle)*(this.baseRadius+40),cos(angle)*3,sin(angle)*3,"Shape",myId,player.coloring)
        }
        }
        this.preGunStage = this.gunStage;
    }
       if(this.type=="Player"){
        this.player.coloring = player.coloring;
        this.radius+=this.sizeVel;
        this.sizeVel/=1.2;
        this.sizeVel+=(this.baseRadius-this.radius)/10;
        let chosenGun = faces[this.gunStage%faces.length];
        this.player.face = player.face;
    pg.push();
    pg.translate(this.x,this.y);
        pg.rotate(frameCounts*0.5)
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(player.coloring);
    pg.fill(20)
        for(let c = 0; c<1; c++){
              pg.beginShape();
    let sides = 9-c;
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i+c*50)*(this.radius-c*30),sin(360/sides*i+c*50)*(this.radius-c*30));
    }
              pg.endShape(CLOSE);
        }
             pg.pop();
          pg.push();
        pg.translate(this.x,this.y);
        pg.strokeWeight(2);
        pg.textSize(50);
        pg.fill(player?.coloring)
                pg.stroke(player?.coloring)
        pg.textAlign(CENTER,TOP);
         let keys = Object.keys(helpMsgs);
        pg.text(`Selected Guide:\n${keys[(this.gunStage+keys.length-1)%keys.length]}`,0,-205);
         helpMsg=helpMsgs[keys[(this.gunStage+keys.length-1)%keys.length]];
         let chosenData = gunData[player.gunType];
         if(helpMsg == "Weapon"){
           helpMsg = `Weapon: ${gunData[player.gunType].display}\nCamera Zoom: ${chosenData.zoom*100}%\nShoot Cooldown: ${floor(abs((log(0.001)/log(chosenData.reload)+1)/60*100))/100}s\nRecoil: ${floor(chosenData.recoil*100)}%\nAmmo Reload: ${chosenData.regen-0.5}s\nWeapon Details:\n${chosenData.details}`
           //1/(chosenData.reload^x)=0
           //(chosenData.reload^x)=0
           //log chosenData.reload(0)
         }
        pg.pop();
    //pg.text();
        this.player.display();
        //player.face=faces[(this.gunStage+faces.length-1)%faces.length];
        if(this.preGunStage!=this.gunStage){
          for(let i=0; i<20; i++){
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x+cos(angle)*(this.baseRadius+40),this.y+sin(angle)*(this.baseRadius+40),cos(angle)*3,sin(angle)*3,"Shape",myId,player.coloring)
        }
        }
        this.preGunStage = this.gunStage;
    }
      if(this.type=="Block"){
    pg.push();
    pg.translate(this.x,this.y);
    pg.beginShape();
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(255);
    pg.fill(20)
    if(this.marked){
      pg.fill(255,0,0,100)
    }
    let sides = floor(this.radius/12);
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i)*this.radius,sin(360/sides*i)*this.radius);
    }
    pg.endShape(CLOSE);
    
    pg.pop();
    }
      
    }
  work(){
    this.display();
    if(dist(this.x,this.y,player.x,player.y)>=5000&&this.despawning==false&&this.type=="Block"){
      this.despawn();
      let x = (this.x-this.x%1000)+500;
      let y = (this.y-this.y%1000)+500;
      for(let i=0; i<blocks.length; i++){
        let block = blocks[i];
        if(block.chunkKey==this.chunkKey){
          block.despawn();
         // print(2)
        }
      }
    }
  }
    despawn(){
      this.marked=true;
      this.despawning = true;
      let chunkKey = this.chunkKey;
      let ind = loadedChunks.findIndex(hold => hold==chunkKey);
      if(ind!=-1){
        loadedChunks.splice(ind,1);
        //print("Unloaded Chunk: ", chunkKey)
        //loadChunk(this.x,this.y)
      }
    }
}