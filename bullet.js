var damagedBulletIds = [];
class Bullet{
  constructor(x,y,xvel,yvel,type,id,coloring,damageId = generateCode()){
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.baseX = xvel;
    this.baseY = yvel;
    this.type = type;
    this.playerId = id;
    this.coloring = coloring;
    this.angleTick = 0;
    this.alive = true;
    this.life = 120;
    this.homingTarget = null;
     this.homingAvoid = null;
    this.assignHoming();
    this.bounces = 4;
    this.id = generateCode();
    this.damageId = damageId;
    if(this.type=="dash"){
      this.type="range";
    }
    this.emit = "Shape";
    let squares = ["common","spike","range","phase"];
    let magics = ["magic"];
    if(squares.includes(this.type)){
       this.emit = "Square";
   }else if(magics.includes(this.type)){
    this.emit = "Magic";
   }
    this.bulletGoal = 0;
    this.size = 15;
    if (this.type =="bomb"){
      this.size = 90;
    }
    this.canMove = true;
    this.isMain = true;
    this.shotId = 0;
    this.canBlow = true;
  }
  assignHoming(){
    this.homingTarget = null;
     this.homingAvoid= null;
     if(this.type=="homing"){
       let pDist = 100000000;
    for(let i of Object.keys(players)){
    if(i!=myId){
      let item = players[i];
      if(item?.x&&item?.y){
         let dists = dist(item.x,item.y,this.x,this.y);
      if(dists<pDist){
        this.homingTarget=item;
        pDist=dists;
      }
     }
    }
    }
    let cDist = 100000000;
     if(blocks.length>0){
      for(let block of blocks){
        let dists = dist(block.x,block.y,this.x,this.y);
        if(dists<cDist&&dists<=block.radius+270){
          this.homingAvoid=block;
          cDist=dists;
        }
      }
      }
      
    }
  }
  kill(){
    
    if(this.type=="bomb"&&this.alive&&this.canBlow){
      this.canBlow=false;
      this.alive=false;
  let shotId = generateCode();
                let dmgId = generateCode();
  for(let i=0; i<8; i++){
    let bulletData = {x:this.x,y: this.y,xvel: cos(i*360/8)*20,yvel: sin(i*360/8)*20,type:  "range",id:this.playerId,coloring: this.coloring,bId: generateCode(),gained: 0,damageId: dmgId,shotId: shotId};
     bullets[bullets.length]=new Bullet(bulletData.x,bulletData.y,bulletData.xvel,bulletData.yvel,bulletData.type,this.playerId,this.coloring,bulletData.dmgId);
    bullets[bullets.length-1].isMain = false;
    //recoil
    if(this.playerId==myId){
    socket.emit("updateBullet", bulletData);
    }
    }
  }
    this.alive=false;
  }
damage(id, damage=1, coloring = 255, x=0, y=0){
   this.kill()
  if(dist(this.x,this.y,width/2,height/2)>safeRadius+10){
  if(myId==this.playerId){
    
       socket.emit("removeBullet", {id: this.id, pId: id, type: this.type, damage: damage});
}

  if(id==myId){ 
    if(!damagedBulletIds.includes(this.damageId)&&this.coloring!=player.coloring){
      player.health-=damage;
          }
    x = player.x;
    y = player.y;
    coloring = player.coloring
  }
 // print(this.coloring,players[this.playerId]?.coloring,player.coloring)
  if(!damagedBulletIds.includes(this.damageId)&&((this.playerId==myId) ? (this.coloring!=players[id]?.coloring) : (this.coloring!=player.coloring))){
  hitParticleQueue[hitParticleQueue.length] = {id: id, damage: 0-damage, coloring: 255};
  }else{
    hitParticleQueue[hitParticleQueue.length] = {id: id, damage: 0, coloring: 255};
  }
  shake+=10;
  for(let i=0; i<10; i++){
          let power = random(-5,-2);
          let angle = random(0,360);
          particles[particles.length] = new Particle(x-cos(angle)*85,y-sin(angle)*85,cos(angle)*power,sin(angle)*power,"Shape",myId,coloring)
  }
}else{
 // hitParticleQueue[hitParticleQueue.length] = {id: id, damage: 0, coloring: 255};
  damagedBulletIds[damagedBulletIds.length] = this.damageId;
    socket.emit("removeBullet", {id: this.id, pId: id, type: this.type, damage: 0});
   shake+=25;
}
   damagedBulletIds[damagedBulletIds.length] = this.damageId;
    for(let i=0; i<7; i++){
          let power = random(0,30);
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
  }
}
  work(){
    this.angleTick++;
    
    if(this.canMove){
    if(this.type=="spike"){
    this.x+=this.xvel/0.9;
    this.y+=this.yvel/0.9;
      this.xvel/=1.1;
      this.yvel/=1.1;
      this.life-=3.9;
    }else{
      this.x+=this.xvel;
    this.y+=this.yvel;
    }
    }else{
      this.alive = true;
      this.life = 120;
    }
    if(this.playerId==myId&&this.canMove){
    for(let i of Object.keys(players)){
    if(i!=myId){
      let item = players[i];
      if(item?.x!=undefined&&item?.y!=undefined){
        if(dist(this.x,this.y,item.x,item.y)<=this.size/2+50){
          this.damage(item?.id, this.type=="snipe"?2:1, item?.coloring, item.x,item.y);
        }
      }
         
      }
    }
    }

    if(this.life<=0){
        this.kill();
        for(let i=0; i<6; i++){
          let power = random(20,40);
          let angle = random(0,360);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
        }
      }
if(this.canMove){
    if(frameCounts%4==0){
    particles[particles.length] = new Particle(this.x,this.y,random(-5,5),random(-5,5),this.emit,myId,this.coloring);
  }
     for(let block of blocks){
      let distance = dist(block.x,block.y,this.x,this.y);
      if(distance<=this.size/2+block.radius){
        if(this.type!="bounce"||this.bounces<=0){
          if (this.type == "phase"&&this.alive){
            this.alive= false;
            let c = createVector(this.x-block.x,this.y-block.y);
            c.normalize();
            c.mult(block.radius);
            let a1 = atan2(c.y,c.x);
            let a2 = atan2(this.yvel,this.xvel);
            let a3 = a2-a1;
            let a4 = 180-a3-a3;
            let len = sqrt(((block.radius**2)*2)-(2*block.radius*block.radius*cos(a4)));
            let v = createVector(this.xvel,this.yvel);
            v.normalize();
            v.mult(len+30);
            let shotId = generateCode();
                let dmgId = generateCode();
            
  for(let i=0; i<3; i++){
    let angle = a2+(30*(i-1));
    let d = dist(0,0,this.xvel,this.yvel);
    let s1 = cos(angle)*d;
    let s2 = sin(angle)*d;
    let bulletData = {x:block.x+c.x+v.x,y: block.y+c.y+v.y,xvel: s1,yvel: s2,type:  "range",id:this.playerId,coloring: this.coloring,bId: generateCode(),gained: 0,damageId: dmgId,shotId: shotId};
     bullets[bullets.length]=new Bullet(bulletData.x,bulletData.y,bulletData.xvel,bulletData.yvel,bulletData.type,this.playerId,this.coloring,bulletData.dmgId);
    bullets[bullets.length-1].isMain = false;
    //recoil
    if(this.playerId==myId){
    socket.emit("updateBullet", bulletData);
    }
    }
          }
      this.kill();
        let base = atan2(this.y-block.y,this.x-block.x)
        for(let i=0; i<13; i++){
          let power = random(10,30);
          let angle = random(base-120,base+120);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
        }
        base = atan2(this.yvel,this.xvel);
        for(let i=0; i<5; i++){
          let power = random(10,30);
          let angle = random(base-15,base+15);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
        }
        }else{
          let dists = dist(this.x,this.y,block.x,block.y);
          let speed = dist(this.xvel,this.yvel,0,0);
        this.x=block.x-(block.x-this.x)/dists*(block.radius+15);
        this.y=block.y-(block.y-this.y)/dists*(block.radius+15);
          this.bounces--;
          let bounceA = atan2(block.y-this.y, block.x-this.x);
          let newA = (bounceA+180)-(atan2(this.yvel,this.xvel)-(bounceA));
          this.xvel = cos(newA)*(speed+1);
          this.yvel = sin(newA)*(speed+1);

        }
      }
     }
  for(let block of changeObjects){
      let distance = dist(block.x,block.y,this.x,this.y);
      if(distance<=this.size/2+block.radius){
       // print(this.playerId==myId,this.isMain,block.shotsTaken,this.shotId)
        if(this.playerId==myId&&this.isMain&&!block.shotsTaken.includes(this.shotId)){
          block.sizeVel-=10;
            if(dist(player.x,player.y,width/2,height/2)<=50+safeRadius){
        block.gunStage++;
          block.shotsTaken+=this.shotId;
            }
           }
         this.kill();
         let base = atan2(this.y-block.y,this.x-block.x)
        for(let i=0; i<13; i++){
          let power = random(10,20);
          let angle = random(base-120,base+120);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
        }
        base = atan2(this.yvel,this.xvel);
        for(let i=0; i<5; i++){
          let power = random(10,20);
          let angle = random(base-15,base+15);
          particles[particles.length] = new Particle(this.x,this.y,cos(angle)*power,sin(angle)*power,this.emit,myId,this.coloring)
        }
      }
  }
}
    if(this.type=="common"){
      this.life-=0.5;
      pg.push();
      pg.translate(this.x,this.y);
      if(!this.alive){
        pg.scale(0.6,0.6);
      }
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<7; i++){
        pg.vertex(cos(360/7*i)*20,sin(360/7*i)*20);
      }
      pg.endShape(CLOSE);
      pg.pop();
    }
if(this.type=="phase"){
      this.life-=0.5;
      pg.push();
      pg.translate(this.x,this.y);
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<4; i++){
        pg.vertex(cos(360/4*i)*20,sin(360/4*i)*20);
      }
      pg.endShape(CLOSE);
      pg.pop();
    }
    if(this.type=="snipe"){
      this.life-=0.5;
      pg.push();
      pg.translate(this.x,this.y);
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<6; i++){
        pg.vertex(cos(360/7*i)*20,sin(360/7*i)*20);
      }
      pg.endShape(CLOSE);
      pg.pop();
      
    }if(this.type=="bomb"){
      this.life-=0.5;
      pg.push();
      pg.translate(this.x,this.y);
      pg.rotate(frameCounts*2*((this.xvel/abs(this.xvel)) ?? 0))
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<8; i++){
        pg.vertex(cos(360/7*i)*50,sin(360/7*i)*50);
      }
      pg.endShape(CLOSE);
      pg.pop();
      
    }
    if(this.type=="range"){
      this.life-=0.5;
      if(dist(this.xvel,this.yvel,0,0)<=5){
        this.life-=10;
      }
       this.xvel/=1.05;
      this.yvel/=1.05;
      pg.push();
      pg.translate(this.x,this.y);
      if(!this.alive){
        pg.scale(0.6,0.6);
      }
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<7; i++){
        pg.vertex(cos(360/7*i)*20,sin(360/7*i)*20);
      }
      pg.endShape(CLOSE);
      pg.pop();
      
    }
    if(this.type=="homing"){
      this.life-=0.3;
      if(frameCounts%3<=1){
        this.assignHoming();
      }
      if(this.homingAvoid){
        let dir = atan2(this.yvel,this.xvel);
        dir-=600/(atan2(this.homingAvoid.y-this.y,this.homingAvoid.x-this.x)-dir);
        this.xvel/=2;
        this.yvel/=2;
        this.xvel+=cos(dir)*8;
        this.yvel+=sin(dir)*8;
      }
      pg.push();
      pg.translate(this.x,this.y);
      if(!this.alive){
        pg.scale(0.6,0.6);
      }
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.scale(1.4,0.9);
      pg.rotate(45);
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.rect(0,0,30,30,5);
      pg.pop();
    }
if(this.type=="shock"){
  this.xvel/=1.008;
      this.yvel/=1.008;
      this.life-=0.50;
      pg.push();
      pg.translate(this.x,this.y);
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.strokeWeight(10);
      pg.stroke(this.coloring);
      pg.noFill();
      pg.arc(0,0,50,50,-60,60);
      pg.ellipse(0,0,20,20)
      pg.arc(0,0,50,50,-60+180,60+180);
      pg.pop();
    }
if(this.type=="recall"){
  this.life-=0.30;

  this.xvel-=this.baseX/60;
      this.yvel-=this.baseY/60;
  let v = createVector(this.xvel,this.yvel)
  if (dist(0,0,this.xvel,this.yvel)>25&&this.life<100){
    v.normalize()
    v.mult(25)
  }
  this.xvel = v.x
  this.yvel = v.y
      this.life-=0.50;
      pg.push();
      pg.translate(this.x,this.y);
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.strokeWeight(10);
      pg.stroke(this.coloring);
      pg.noFill();
      // pg.arc(0,0,50,50,-60,60);
      pg.ellipse(0,0,30,30)
      // pg.arc(0,0,50,50,-60+180,60+180);
      pg.pop();
    }
    if(this.type=="bounce"){
      this.life-=0.75;
      pg.push();
      pg.translate(this.x,this.y);
      if(!this.alive){
        pg.scale(0.6,0.6);
      }
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.scale(1+dist(this.xvel,this.yvel,0,0)/30,1);
      pg.rotate(45);
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.ellipse(0,0,30,30);
      pg.pop();
    }
if(this.type.slice(0,6)=="nuclex"){
      let versionN = this.type.slice(6,7);
  let multV = parseInt(versionN) ?? 1;
      this.life-=0.75;
      let vect = createVector(-this.baseY,this.baseX);
  let baseVect = createVector(this.baseX,this.baseY);
      vect.normalize();
  vect.mult(sin(this.angleTick*12+180*multV)*15);
  baseVect.normalize();
  baseVect.mult(22);
  this.xvel=baseVect.x+vect.x;
  this.yvel=baseVect.y+vect.y;
      pg.push();
      pg.translate(this.x,this.y);
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
  pg.noFill();
  let angleDif = 50;
      pg.arc(0,-29,80,80,angleDif,180-angleDif);
  pg.arc(0,29,80,80,angleDif+180,180-angleDif+180);
      pg.pop();
    }
if(this.type=="magic"){
      this.life-=0.2;
      pg.push();
      pg.translate(this.x,this.y);
      pg.rotate(atan2(this.yvel,this.xvel)+frameCounts*2);
        pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.beginShape();
      for(let i=0; i<50; i++){
        pg.vertex(cos(360/50*i)*(20+sin(i/50*360*3)*5),sin(360/50*i)*(20+sin(i/50*360*3)*5));
      }
      pg.endShape(CLOSE);
      let radius = 80;
  pg.noFill();
  pg.stroke(`rgba(${this.coloring.slice(4,this.coloring.length-1)},${0.6})`);
  for(let i=0; i<9; i++){
    pg.arc(0,0,radius*2,radius*2,i*360/9,(i+0.2)*360/9);
  }
  radius = radius+80;
  pg.rotate(360/9);
  pg.stroke(`rgba(${this.coloring.slice(4,this.coloring.length-1)},${0.2})`);
  for(let i=0; i<9; i++){
    pg.arc(0,0,radius*2,radius*2,i*360/9,(i+0.2)*360/9);
  }
      pg.pop();
  
    for(let i of Object.keys(players)){
    if(i!=myId){
      let item = players[i];
      if(item?.x!=undefined&&item?.y!=undefined){
         if(dist(item.x,item.y,this.x,this.y)<=50+radius&&item?.id!=this.playerId){
        this.xvel/=1.15;
        this.yvel/=1.15;
        this.xvel+=(item.x-this.x)/60;
        this.yvel+=(item.y-this.y)/60;
      }
      }
    }
  }
  
    }
    if(this.type=="spike"){
      this.life-=0.5;
      pg.push();
      pg.translate(this.x,this.y);
      if(!this.alive){
        pg.scale(0.6,0.6);
      }
      pg.rotate(atan2(this.yvel,this.xvel));
      pg.scale(1.2,0.8);
      pg.rotate(45);
      pg.strokeWeight(10);
      pg.noFill();
      pg.fill(20);
      pg.stroke(this.coloring);
      pg.rect(0,0,30,30);
      pg.pop();
    }
  }
}