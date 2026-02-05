var devIPs = ["50.207.114.250"];

class Player{
  constructor(x = 0, y = 0){
    this.x = x;
    this.y = y;
    this.spawnPos = {x: x, y: y};
    this.xvel = 0;
    this.yvel = 0;
    this.ammo = 3;
    this.health = 7;
    this.maxHealth = 7;
    this.id = myId;
    this.gunType = guns[floor(random(0,guns.length))];
   // this.gunType="snipe"
   // this.gunType="homin
    this.direction = {x: 0, y: 0};
    this.directionTween = {x:0,y:0};
    this.face = faces[floor(random(0,faces.length))]
    this.coloring =colors[floor(random(0,colors.length))]
    this.pointingA=0;
        if(!this.coloring){
       this.coloring="rgb(0,0,0)";
       }
    this.displayName = user
    this.chatText = "";
    this.radius = 50;
    this.kbxvel = 0;
    this.kbyvel = 0;
    this.healthImpact=0;
    this.healthAngle = 0;
    this.ip = "NONE";
  }
  work() {
    this.ip = myIP;
    if(this.health<=0){
      this.x=this.spawnPos.x
      this.y = this.spawnPos.y
      this.health = 7;
    }
    this.healthImpact/=gunData[this.gunType].reload ?? 1.4;
    let keyInputs = {w: keyIsDown(ischar("w"))||keyIsDown(ischar("up")), a: keyIsDown(ischar("a"))||keyIsDown(ischar("left")), s: keyIsDown(ischar("s"))||keyIsDown(ischar("down")), d: keyIsDown(ischar("d"))||keyIsDown(ischar("right"))};
    let direction = createVector((keyInputs.d-keyInputs.a),(keyInputs.s-keyInputs.w));
    this.direction = {...direction};
    direction.normalize();
    direction.mult(85);
    if(!typing){
    this.xvel+=direction.x;
    this.yvel+=direction.y;
    }
    this.kbxvel/=1.09;
    this.kbyvel/=1.09;
    this.xvel/=10;
    this.yvel/=10;
    this.x+=this.xvel+this.kbxvel;
    this.y+=this.yvel+this.kbyvel;
    for(let block of blocks){
      let distance = dist(block.x,block.y,this.x,this.y);
      if(distance<=this.radius+block.radius){
        let vect = createVector(this.x-block.x,this.y-block.y);
        vect.normalize();
        vect.mult(this.radius+block.radius);
        this.x=block.x+vect.x;
        this.y=block.y+vect.y;
      }
    }
    this.directionTween.x-=(this.directionTween.x-this.direction.x)/5;
    this.directionTween.y-=(this.directionTween.y+this.direction.y)/5;
     this.pointingA = (atan2(mouse.y-this.y,mouse.x-this.x)+90);
    if(playingTime>=200){
    for(let i=-3; i<=3; i++){
      for(let c=-3; c<=3; c++){
      loadChunk(this.x+i*1000,this.y+c*1000);
      }
    }
    }
    this.display();
  }
  display(){
  if(frameCounts%10==0){
     particles[particles.length] = new Particle(this.x,this.y,0,0,"Shape",myId,this.coloring);
  }
    pg.push();
    pg.translate(this.x,this.y);
    pg.strokeWeight(10);
      if(!this.coloring){
       this.coloring="rgb(0,0,0)";
       }
    pg.stroke(this.coloring);
    pg.noFill();
    pg.fill(20)
    pg.beginShape();
    let sides = 7;
    let radius = this.radius;
    let offset = 360/sides/4;
    let yTween = -this.directionTween.y*12;
    pg.rotate(sin(frameCount*3)*3+this.directionTween.x*2*(10+((yTween<0)?yTween*2:yTween)));
    for(let i=0; i<sides; i++){
      pg.vertex(cos(360/sides*i+offset)*radius,sin(360/sides*i+offset)*radius);
    }
    for(let i=0; i<-sides; i++){
      pg.vertex(cos(360/sides*i+offset)*radius,sin(360/sides*i+offset)*radius);
    }
    // ["scared","happy","evil","dead"];
    pg.endShape(CLOSE);
    pg.fill(this.coloring);
    pg.strokeWeight(1);
    pg.textAlign(CENTER,CENTER);
    pg.textSize(100)
    if(this.face=="scared"){
    pg.text(".",-15,-35);
    pg.text(".",15,-35);
      pg.textSize(100)
    pg.text("~",0,5);
    }else if (this.face=="dead"){
       pg.textSize(50)
      pg.strokeWeight(3);
      pg.text("x",-15,-15);
    pg.text("x",15,-15);
      pg.textSize(100)
       pg.strokeWeight(1);
    pg.text("-",0,5);
    }else if (this.face=="happy"){
      pg.textSize(50)
      pg.strokeWeight(3);
      pg.text("^",-20,-5);
    pg.text("^",20,-5);
      pg.textSize(100)
      pg.strokeWeight(1);
    pg.text("-",0,5);
    }else if (this.face=="evil"){
       pg.textSize(50)
      pg.strokeWeight(3);
      pg.text("*",-15,-4);
    pg.text("*",15,-4);
      pg.textSize(100)
      pg.strokeWeight(1);
    pg.text("~",0,5);
    }
    pg.pop();
    
    pg.push();
    pg.translate(this.x,this.y);
    let angle = atan2(mouse.y-this.y,mouse.x-this.x)
    if(myId!=this.id&&cursors[this.id]?.x&&cursors[this.id]?.y){
      angle = atan2(cursors[this.id].y-this.y,cursors[this.id].x-this.x)
    }
    this.healthAngle=angle
    pg.noFill();
    pg.stroke(`rgba(${this.coloring.slice(4,this.coloring.length-1)},${this.healthImpact/15*255+0.45+sin(frameCounts*5)/10})`);
    if(this.healthImpact<=0.0001){
     pg.stroke(`rgba(${this.coloring.slice(4,this.coloring.length-1)},${0.45+sin(frameCounts*5)/10})`);
    }
    pg.strokeWeight(10);
    let angleChange = 270/this.health;
    pg.rotate(this.health/2*angleChange+this.healthAngle+90);
    pg.rotate(-angleChange/2);
    for(let i=0; i<this.health; i++){
      let addon = 70+this.healthImpact*2+abs(i-this.health/2)*1;
      pg.line(-5,addon,0,addon+5)
      pg.line(5,addon,0,addon+5)
      pg.rotate(-angleChange);
    }
    pg.pop();
    
    //weapon?
    pg.push();
    pg.translate(this.x,this.y);
    pg.stroke(this.coloring);
    pg.fill(this.coloring);
    pg.strokeWeight(3);
    pg.textAlign(CENTER,BOTTOM)
    pg.textSize(40)
    pg.text(`${this.displayName}`,0,-95);
    if(devIPs.includes(this.ip)){
      pg.fill("#70A7FF");
      pg.stroke("#70A7FF");
      //pg.text(`(SOMEONE'S PLAYING GAMES IN SCHOOL?!?!?)`,0,130);
    }
    pg.textSize(35);
    pg.fill(255);
    pg.stroke(255);
    pg.strokeWeight(1.5);
   // print(typing,frameCount%10)
    if(this.displayName==user){
     pg.text(`${this.chatText}${(typing&&frameCounts%40>20) ? "|" : " "}`,0,-150);
    }
    pg.rotate(this.pointingA);
    pg.stroke(this.coloring);
    pg.strokeWeight(10);
    if(myId!=this.id&&cursors[this.id]?.x&&cursors[this.id]?.y){
      pg.line(0,-100,0+20*abs(cursors[this.id].x-this.x)/(cursors[this.id].x-this.x),-100);
    }else{
    pg.line(0,-100,0+20*abs(mouse.x-this.x)/(mouse.x-this.x),-100);
    }
    pg.line(0,-100,0,-140);
    pg.pop();
  }
}

