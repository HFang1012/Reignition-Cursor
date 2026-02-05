class WorldObject{
  constructor(x,y,radius,type,chunkKey){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.type = type ?? "Block";
    this.despawning = false;
    this.marked = false;
    this.chunkKey = chunkKey;
    this.gunStage = 0;
    this.shotsTaken = [];
  }
    display(){
      if(this.type=="Gun"){
    pg.push();
    pg.translate(this.x,this.y);
    pg.beginShape();
    pg.strokeWeight(10);
    pg.noFill();
    pg.stroke(255);
    pg.fill(20)
    let sides = floor(this.radius/12);
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i)*this.radius,sin(360/sides*i)*this.radius);
    }
    pg.endShape(CLOSE);
    
    pg.pop();
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