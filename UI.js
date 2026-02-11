var screen = 0
var lobbyCode = ''
var buttons = [[0,0,150,70,200,100]]
var scl = 1
var scls = 1
var x = 1280/2-100
var rx=1280/2-100
var lobbyType = false
var lobbyTyper = false;
var x2=1280/2+250
var rx2=1280/2+250
var x3=1280/2-235
var rx3=1280/2-235
var enterScl = 1
var enterScls = 1
var usernameText = ''
var x4 = 1280/2
var rx4 = 1280/2
var usernameType = false
var lobbyBoxSize = 500
var lobbyBoxAim = 500
var brx = 270
var rbrs = 1
var brs = 1
function selectionPage(){
  pg.translate(random(-shake,shake),random(-shake,shake));
  shake/=2;
  pg.push()
  pg.strokeWeight(10)
  pg.noFill()
  pg.stroke(colors[0])
  pg.rect(rx4,600,400,70,15)
  pg.textSize(45)
  pg.fill(colors[0])
  pg.strokeWeight(3)
  pg.fill(colors[0])
  pg.textAlign(CENTER,CENTER)
  
  if (usernameText.length==0&&!usernameType){
    // pg.stroke(150)
    pg.text(`USERNAME`,rx4,600)
  }else{
    pg.text(`${usernameText}${(usernameType&&frameCounts%40>20) ? "|" : " "}`,rx4,600)
  }
  pg.pop()
  
  pg.push()
  pg.stroke('rgb(253,231,231)')
  pg.fill('rgb(253,231,231)')
  // pg.noFill()
  pg.strokeWeight(5)
  // pg.ellipse(0,0,100,100)
  pg.textSize(120)
  pg.textAlign(CENTER,CENTER)
  pg.text('REIGNITION\nCURSOR',1280/2,200+sin(frameCounts*3)*10)
   pg.textSize(70) 
  pg.strokeWeight(2)
  pg.text('The Game',1280/2,370+sin(frameCounts*3)*10)
  pg.noFill()
  pg.stroke(colors[2])
  pg.strokeWeight(10)
  pg.translate(rx2,500)
  pg.scale(scl,scl)
  pg.rect(0,0,150,70,15)
  pg.fill(colors[2])
  pg.textSize(45)
  pg.strokeWeight(3)
  pg.text('HOST',0,0,500)
  pg.scale(1/scl,1/scl)
  pg.translate(-rx2,-500)
  
  pg.textSize(45)
  pg.strokeWeight(10)
  pg.noFill()
  pg.stroke(colors[4])
  pg.rect(rx,500,lobbyBoxSize,70,15)
  pg.strokeWeight(3)
  pg.fill(colors[4])
  let setColor = `rgba(${colors[4].slice(4,colors[4].length-1)},${max(1-(rx-540)/50,0)})`
  pg.stroke(setColor);
  pg.fill(setColor);
  pg.text(`LOBBY CODE`,540+80,500-(rx-540)*2)
  if (lobbyCode.length==0&&!lobbyType){
    // pg.stroke(150)
  }else{
    pg.stroke(colors[4])
    pg.fill(colors[4])
    pg.text(`${lobbyCode}${(lobbyTyper&&frameCounts%40>20) ? "|" : " "}`,rx,500)
  }
  pg.pop()
  
  pg.push()
  pg.textSize(45)
  pg.stroke(colors[4])
  pg.strokeWeight(3)
  pg.fill(colors[4])
  pg.translate(rx3,500)
  pg.scale(enterScl,enterScl)
  pg.textAlign(CENTER,CENTER)
  pg.text("ENTER",0,0)
  pg.scale(1/enterScl,1/enterScl)
  pg.translate(-rx3,-500)
  pg.pop()
  if (errorTimer>0){
    pg.push()
    pg.textAlign(CENTER,CENTER)
    pg.textSize(errorTimer>290?map(errorTimer,300,290,0,45):45)
    pg.strokeWeight(3)
    pg.stroke(246,161,161,
            (errorTimer<200?map(errorTimer,200,0,255,0):(errorTimer>290?map(errorTimer,300,290,0,255):255)))
    pg.fill(246,161,161,
            (errorTimer<200?map(errorTimer,200,0,255,0):(errorTimer>290?map(errorTimer,300,290,0,255):255)))
    if (errorType==0){
    pg.text("Invalid Username!",1280/2,430)
    }else if(errorType==1){
      pg.text("Invalid Lobby!",1280/2,430)
    }
    // pg.ellipse(1280/2,750/2,50000,50000)
    pg.pop()
  }
  if (lobbyType){
    let d = dist(x3,0,rx3,0)
    pg.push()
    pg.fill(237,161,248,map(d,470,0,0,255))
    pg.stroke(237,161,248,map(d,470,0,0,255))
    pg.textAlign(CENTER,CENTER)
    pg.strokeWeight(3)
    pg.textSize(45)
    pg.translate(brx,500)
    pg.scale(rbrs,rbrs)
    pg.text("ROYALE",0,0)
    pg.noFill();
    pg.strokeWeight(10);
    pg.rect(0,0,200,70,15);
    pg.scale(1/rbrs,1/rbrs)
    pg.translate(-brx,-500)
    pg.pop();
  }
  
  //x,y,x2,y2,xs,ys,xs2,ys2
  if (rectHit(rx2,500,mouse.x,mouse.y,150,70,5,5)){
    scls = 1.2
    
    x3=1280/2-255
    if (lobbyType){
      x=1280/2-50
    }else{
      x=1280/2-130
    }
  }else{
    scls = 1
    x=1280/2-100
    x3=1280/2-235
    if (lobbyType&&!rectHit(rx3,500,mouse.x,mouse.y,150,70,5,5)){
      x=1280/2-40
    }
  }
  if (lobbyType){
    x2=1280/2+400
    x3=1280/2+240
    
    lobbyBoxAim=380
    if (rectHit(rx3,500,mouse.x,mouse.y,150,70,5,5)){
      enterScls = 1.2
      x=1280/2-50
      x2=1280/2+420
    }else{
      enterScls = 1
      // x2=1280/2+250
      // x=1280/2-120
    }
    if (rectHit(rx2,500,mouse.x,mouse.y,150,70,5,5)){
      x3=1280/2+220
    }else{
      x3=1280/2+240
    }
  }else{
    x2=1280/2+250
    lobbyBoxAim=500
    if (rectHit(rx2,500,mouse.x,mouse.y,150,70,5,5)){
      x3=1280/2-265
    }else{
      x3=1280/2-235
    }
   if (!rectHit(rx3,500,mouse.x,mouse.y,150,70,5,5)){
      enterScls = 1
    }
  }
  if (rectHit(brx,500,mouse.x,mouse.y,150,70,5,5)&&screen==0&&lobbyType){
    brs = 1.2
  }else{
    brs = 1
  }
  
  scl-=(scl-scls)/5
  rbrs-=(rbrs-brs)/5
  enterScl-=(enterScl-enterScls)/5
  rx-=(rx-x)/5
  rx2-=(rx2-x2)/5
  rx3-=(rx3-x3)/5
  lobbyBoxSize-=(lobbyBoxSize-lobbyBoxAim)/5
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  let id = "";
  for (let i = 0; i<10; i++) {
    id += chars.charAt(floor(random(chars.length)));
  }
  return id;
}