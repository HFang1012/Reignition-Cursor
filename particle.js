class Particle{
  constructor(x,y,xvel,yvel,type,id,coloring){
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.type = type;
    this.rotation = random(0,360);
    this.rotateSide = random(0,1)>0.5 ? 1 : -1;
    this.playerId = id;
    this.coloring = coloring;
    this.alive =random(100,120);
    this.sides = floor(random(3,6));
    if(this.type=="Hit"||this.type=="Message"){
      this.rotation = random(-5,5);
    }
    if(this.type=="Magic"){
      this.type = (random(0,1)>0.5) ? "Circle" : "Cross";
    }
    this.hitValue = 1;
    this.layer = 0;
    let higher1 = ["Message","Hit"];
    if(higher1.includes(this.type)){
      this.layer=1;
    }
  }
  work(){
    this.alive-=3.5;
    this.x+=this.xvel;
    this.y+=this.yvel;
    this.xvel/=1.12;
    this.yvel/=1.12;
    if(this.type=="Shape"){
      pg.push();
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide*7;
      pg.rotate(this.rotation);
      pg.rectMode(CENTER);
      pg.noStroke();
      pg.fill(this.coloring);
      pg.beginShape();
      for(let i=0; i<this.sides; i++){
        pg.vertex(cos(360/this.sides*i)*(45*this.alive/140),sin(360/this.sides*i)*(45*this.alive/140));
      }
      //apg.rect(0,0,45*this.alive/100,45*this.alive/100)
      pg.endShape(CLOSE);
      pg.pop();
    }
    if(this.type=="Square"){
      pg.push();
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide*7;
      pg.rotate(this.rotation);
      pg.rectMode(CENTER);
      pg.noStroke();
      pg.fill(this.coloring);
      pg.rect(0,0,45*this.alive/100,45*this.alive/100)
      pg.pop();
    }
    if(this.type=="Circle"){
      pg.push();
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide*7;
      pg.rotate(this.rotation);
      pg.rectMode(CENTER);
      pg.noFill();
      pg.strokeWeight(10);
      pg.stroke(this.coloring);
      pg.ellipse(0,0,35*this.alive/100,35*this.alive/100)
      pg.pop();
    }
    if(this.type=="Cross"){
      pg.push();
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide*7;
      pg.rotate(this.rotation);
      pg.rectMode(CENTER);
       pg.noFill();
      pg.strokeWeight(10);
      pg.stroke(this.coloring);
      pg.line(-15*this.alive/100,0,15*this.alive/100,0);
      pg.line(0,-15*this.alive/100,0,15*this.alive/100);
      pg.pop();
    }
    if(this.type=="Hit"){
      pg.push();
      this.alive+=2;
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide/2.5;
      pg.rotate(this.rotation);
      pg.rectMode(CENTER);
      pg.noStroke();
      pg.stroke(this.coloring)
      pg.fill(this.coloring);
      pg.strokeWeight(3);
      pg.textSize(this.alive/100*150);
      pg.textAlign(CENTER,CENTER);
      pg.text(`${this.hitValue}`,0,0)
      pg.pop();
    }
    if(this.type=="Message"){
      pg.push();
      this.alive+=2;
      pg.translate(this.x,this.y);
      this.rotation+=this.rotateSide/2;
      pg.rotate(this.rotation/3);
      pg.rectMode(CENTER);
      pg.noStroke();
      pg.stroke(this.coloring)
      pg.fill(this.coloring);
      pg.strokeWeight(3);
      pg.textSize(this.alive/100*80);
      pg.textAlign(CENTER,CENTER);
      pg.text(`${this.hitValue}`,0,0)
      pg.pop();
    }
  }
}