var screen = 0
var lobbyCode = ''
var buttons = [[0, 0, 150, 70, 200, 100]]
var scl = 1
var scls = 1
var x = 1280 / 2 - 100
var rx = 1280 / 2 - 100;
var lobbyType = false
var lobbyTyper = false;
var x2 = 1280 / 2 + 250
var rx2 = 1280 / 2 + 250
var x3 = 1280 / 2 - 235
var rx3 = 1280 / 2 - 235
var enterScl = 1
var enterScls = 1
var usernameText = ''
var x4 = 1280 / 2
var rx4 = 1280 / 2 + 40
var usernameType = false
var lobbyBoxSize = 500
var lobbyBoxAim = 500
var brx = 270
var rbrs = 1
var brs = 1
var mouseAvailable = false
var tab = 0;
var examplePlayer;
var t

var ht = 1
var hs = ht

var leavet = 1
var leaves = leavet

var selectedItemButton = {};
var hanger = false;

function selectionPage() {

  if (!mouseIsPressed && !mouseAvailable) {
    mouseAvailable = true;
  }
  pg.translate(random(-shake, shake), random(-shake, shake));
  shake /= 2;
  pg.push()
  pg.strokeWeight(10)
  pg.noFill()
  pg.stroke(colors[0])
  pg.rect(rx4, 600, 400, 70, 15)
  pg.textSize(45)
  pg.fill(colors[0])
  pg.strokeWeight(3)
  pg.fill(colors[0])
  pg.textAlign(CENTER, CENTER)
  if (usernameText.length == 0 && !usernameType) {
    // pg.stroke(150)
    pg.text(`USERNAME`, rx4, 600)
  } else {
    pg.text(`${usernameText}${(usernameType && frameCounts % 40 > 20) ? "|" : " "}`, rx4, 600)
  }
  pg.pop()
  pg.push()
  pg.stroke('rgb(253,231,231)')
  pg.fill('rgb(253,231,231)')
  // pg.noFill()
  pg.strokeWeight(5)
  // pg.ellipse(0,0,100,100)
  pg.textSize(120)
  pg.textAlign(CENTER, CENTER)
  pg.text('REIGNITION\nCURSOR', 1280 / 2, 200 + sin(frameCounts * 3) * 10)
  pg.textSize(70)
  pg.strokeWeight(2)
  pg.text('The Game', 1280 / 2, 370 + sin(frameCounts * 3) * 10)
  pg.noFill()
  pg.stroke(colors[2])
  pg.strokeWeight(10)
  pg.translate(rx2, 500)
  pg.scale(scl, scl)
  pg.rect(0, 0, 150, 70, 15)
  pg.fill(colors[2])
  pg.textSize(45)
  pg.strokeWeight(3)
  pg.text('HOST', 0, 0, 500)
  pg.scale(1 / scl, 1 / scl)
  pg.translate(-rx2, -500)
  pg.textSize(45)
  pg.strokeWeight(10)
  pg.noFill()
  pg.stroke(colors[4])
  pg.rect(rx, 500, lobbyBoxSize, 70, 15)
  pg.strokeWeight(3)
  pg.fill(colors[4])
  let setColor = `rgba(${colors[4].slice(4, colors[4].length - 1)},${max(1 - (rx - 540) / 50, 0)})`
  pg.stroke(setColor);
  pg.fill(setColor);
  pg.text(`LOBBY CODE`, max(rx, 0) + 80, 500 - max(rx - 540, 0) * 2)
  if (lobbyCode.length == 0 && !lobbyType) {
    // pg.stroke(150)
  } else {
    pg.stroke(colors[4])
    pg.fill(colors[4])
    pg.text(`${lobbyCode}${(lobbyTyper && frameCounts % 40 > 20) ? "|" : " "}`, rx, 500)
  }
  pg.pop()
  pg.push()
  pg.textSize(45)
  pg.stroke(colors[4])
  pg.strokeWeight(3)
  pg.fill(colors[4])
  pg.translate(rx3, 500)
  pg.scale(enterScl, enterScl)
  pg.textAlign(CENTER, CENTER)
  pg.text("ENTER", 0, 0)
  pg.scale(1 / enterScl, 1 / enterScl)
  pg.translate(-rx3, -500)
  pg.pop()

//HANGER ICON
  pg.push()
  pg.strokeWeight(10)
  pg.noFill()
  pg.stroke(colors[0])
  pg.translate(1280 / 2 - 220, 600)
  pg.scale(ht, ht)
  pg.rect(0,0, 70, 70, 15)
  pg.scale(1/ht,1/ht)
  pg.translate(-(1280 / 2 - 220), -600)
  pg.translate(1280 / 2 - 220, 604)
  pg.scale(hs,hs)
  pg.beginShape()
  pg.vertex(-10, 0)
  pg.curveVertex(-15, -15)
  pg.vertex(0, -20)
  pg.vertex(0, -5)
  pg.vertex(-15, 10)
  pg.vertex(15, 10)
  pg.vertex(0, -5)
  pg.vertex(0, -5)
  pg.endShape()
  pg.scale(1/hs,1/hs)
  pg.translate(-(1280 / 2 - 220), -604)
  pg.pop()


  if (errorTimer > 0) {
    pg.push()
    pg.textAlign(CENTER, CENTER)
    pg.textSize(errorTimer > 290 ? map(errorTimer, 300, 290, 0, 45) : 45)
    pg.strokeWeight(3)
    pg.stroke(246, 161, 161,
      (errorTimer < 200 ? map(errorTimer, 200, 0, 255, 0) : (errorTimer > 290 ? map(errorTimer, 300, 290, 0, 255) : 255)))
    pg.fill(246, 161, 161,
      (errorTimer < 200 ? map(errorTimer, 200, 0, 255, 0) : (errorTimer > 290 ? map(errorTimer, 300, 290, 0, 255) : 255)))
    if (errorType == 0) {
      pg.text("Invalid Username!", 1280 / 2, 430)
    } else if (errorType == 1) {
      pg.text("Invalid Lobby!", 1280 / 2, 430)
    }
    // pg.ellipse(1280/2,750/2,50000,50000)
    pg.pop()
  }
  if (lobbyType) {
    let d = dist(x3, 0, rx3, 0)
    pg.push()
    pg.fill(237, 161, 248, map(d, 470, 0, 0, 255))
    pg.stroke(237, 161, 248, map(d, 470, 0, 0, 255))
    pg.textAlign(CENTER, CENTER)
    pg.strokeWeight(3)
    pg.textSize(45)
    pg.translate(brx, 500)
    pg.scale(rbrs, rbrs)
    pg.text("ROYALE", 0, 0)
    pg.noFill();
    pg.strokeWeight(10);
    pg.rect(0, 0, 200, 70, 15);
    pg.scale(1 / rbrs, 1 / rbrs)
    pg.translate(-brx, -500)
    pg.pop();
  }

  if (hanger) {
    pg.push()
    pg.strokeWeight(10)
    pg.fill(20)
    pg.stroke(colors[0])
    pg.rect(1280 / 2, 360, width - 100, height - 100, 15)
    pg.noFill()
    let yh = 120
    let offset = 10
    let facesx = 220 - offset
    let gunsx = 1280 / 2 - 145 - offset
    let crossx = 1280 * 0.75 - 190 - offset
    pg.translate(1160, yh)
    pg.scale(leaves, leaves)
    pg.ellipse(0, 0, 70, 70)
    pg.scale(1/leaves, 1/leaves)
    pg.translate(-1160, -yh)
    pg.rect(facesx, yh, 250, 70, 15)
    pg.rect(crossx, yh, 250, 70, 15)
    pg.rect(gunsx, yh, 250, 70, 15)
    pg.line(920, 50, 920, 670)
    examplePlayer.x = 1060
    examplePlayer.y = 400;
    examplePlayer.coloring = colors[0];
    examplePlayer.health = 0;
    examplePlayer.display();
    if (rectHit(1160, yh, mouse.x, mouse.y, 45, 45, 5, 5)) {
      if (mouseIsPressed && mouseAvailable) {
        mouseAvailable = false;
        hanger = false;
      }
      leavet = 1.2
    }else{
      leavet = 1
    }

    for (let i = 0; i < Object.values(selectedItem).length; i++) {
      let x = 160 + (i % 6) * 130;
      let y = 250 + floor(i / 6) * 130;

      let tbig = selectedItemButton[Object.keys(selectedItem)[i]]?.targetBig
      let tsmall = selectedItemButton[Object.keys(selectedItem)[i]]?.targetSmall
      
      let current = selectedItemButton[Object.keys(selectedItem)[i]]?.current
      pg.rect(x, y, current, current, 15);
      if (tab == 0) {
        facesPage(Object.values(selectedItem)[i], x, y);
        if (rectHit(x, y, mouse.x, mouse.y, 100, 100, 5, 5)) {
          if (mouseIsPressed && mouseAvailable) {
            mouseAvailable = false;
            examplePlayer.face = Object.values(selectedItem)[i];
            selectedItemButton[Object.keys(selectedItem)[i]].current = 150
          }

          selectedItemButton[Object.keys(selectedItem)[i]].target = 120


        } else {
          selectedItemButton[Object.keys(selectedItem)[i]].target = 100
        }
        selectedItemButton[Object.keys(selectedItem)[i]].current -= (current - selectedItemButton[Object.keys(selectedItem)[i]].target) / 5
      }

    }
    if (rectHit(facesx, yh, mouse.x, mouse.y, 250, 70, 5, 5) && mouseIsPressed && mouseAvailable) {
      mouseAvailable = false;
      selectedItem = { ...faces }
      for (let i in selectedItem) {
        selectedItemButton[i] = { targetBig: 120, targetSmall: 100, current: 100, target: 100 }
      }
      t =selectedItemButton[Object.keys(selectedItem)[i]]?.target
      tab = 0;
    }
    if (rectHit(crossx, yh, mouse.x, mouse.y, 250, 70, 5, 5) && mouseIsPressed && mouseAvailable) {
      mouseAvailable = false;
      selectedItem = { ...crosshairs }
      for (let i in selectedItem) {
        selectedItemButton[i] = { targetBig: 120, targetSmall: 100, current: 100, target: 100 }
      }
      t =selectedItemButton[Object.keys(selectedItem)[i]]?.target
      tab = 2;
    }
    if (rectHit(gunsx, yh, mouse.x, mouse.y, 250, 70, 5, 5) && mouseIsPressed && mouseAvailable) {
      mouseAvailable = false;
      selectedItem = { ...playerGuns }
      for (let i in selectedItem) {
        selectedItemButton[i] = { targetBig: 120, targetSmall: 100, current: 100, target: 100 }
      }
      t =selectedItemButton[Object.keys(selectedItem)[i]]?.target
      tab = 1;
    }

    pg.fill(colors[0])
    pg.textAlign(CENTER, CENTER)
    pg.textSize(45)
    pg.strokeWeight(3)
    pg.text("Faces", facesx, yh)
    pg.text("TBD", crossx, yh)
    pg.text("Guns", gunsx, yh)
    pg.translate(1160, yh)
    pg.scale(leaves, leaves)
    pg.text("X", 0,0)
    pg.scale(1/leaves, 1/leaves)
    pg.translate(-1160, -yh)
    pg.pop()
  }


  //x,y,x2,y2,xs,ys,xs2,ys2
  if (rectHit(rx2, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
    scls = 1.2

    x3 = 1280 / 2 - 255
    if (lobbyType) {
      x = 1280 / 2 - 50
    } else {
      x = 1280 / 2 - 130
    }
  } else {
    scls = 1
    x = 1280 / 2 - 100
    x3 = 1280 / 2 - 235
    if (lobbyType && !rectHit(rx3, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
      x = 1280 / 2 - 40
    }
  }
  if (lobbyType) {
    x2 = 1280 / 2 + 400
    x3 = 1280 / 2 + 240

    lobbyBoxAim = 380
    if (rectHit(rx3, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
      enterScls = 1.2
      x = 1280 / 2 - 50
      x2 = 1280 / 2 + 420
    } else {
      enterScls = 1
      // x2=1280/2+250
      // x=1280/2-120
    }
    if (rectHit(rx2, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
      x3 = 1280 / 2 + 220
    } else {
      x3 = 1280 / 2 + 240
    }
  } else {
    x2 = 1280 / 2 + 250
    lobbyBoxAim = 500
    if (rectHit(rx2, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
      x3 = 1280 / 2 - 265
    } else {
      x3 = 1280 / 2 - 235
    }
    if (!rectHit(rx3, 500, mouse.x, mouse.y, 150, 70, 5, 5)) {
      enterScls = 1
    }
  }
  if (rectHit(brx, 500, mouse.x, mouse.y, 150, 70, 5, 5) && screen == 0 && lobbyType) {
    brs = 1.2
  } else {
    brs = 1
  }
  if (rectHit(1280/2-220,600,mouse.x,mouse.y,70,70,5,5)&&screen==0&&!hanger) {
    ht = 1.2
  }else{
    ht = 1
  }
  scl -= (scl - scls) / 5
  rbrs -= (rbrs - brs) / 5
  enterScl -= (enterScl - enterScls) / 5
  rx -= (rx - x) / 5
  rx2 -= (rx2 - x2) / 5
  rx3 -= (rx3 - x3) / 5
  lobbyBoxSize -= (lobbyBoxSize - lobbyBoxAim) / 5
  hs -= (hs - ht) / 5
  leaves -= (leaves - leavet) / 5
}


function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  let id = "";
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(floor(random(chars.length)));
  }
  return id;

}

function facesPage(type, x, y) {
  pg.push();
  pg.translate(x, y);
  pg.fill(colors[0]);
  pg.strokeWeight(1);
  pg.textAlign(CENTER, CENTER);
  pg.textSize(100)
  if (type == "scared") {
    pg.text(".", -15, -35);
    pg.text(".", 15, -35);
    pg.textSize(100);
    pg.text("~", 0, 5);
  } else if (type == "dead") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("x", -15, -15);
    pg.text("x", 15, -15);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 5);
  } else if (type == "happy") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("^", -20, -5);
    pg.text("^", 20, -5);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 5);
  } else if (type == "evil") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("*", -15, -4);
    pg.text("*", 15, -4);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("~", 0, 5);
  } else if (type == "shocked") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("o", -19, -12);
    pg.text("o", 19, -12);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 5);
  } else if (type == "sad") {
    pg.textSize(50)
    pg.strokeWeight(3);
    //   pg.text("o",-19,-12);
    //  pg.text("o",19,-12);
    pg.textSize(70)
    pg.strokeWeight(1);
    pg.text(";-;", 0, -6);
  } else if (type == "money") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("$", -19, -10);
    pg.text("$", 19, -10);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 8);
  } else if (type == "ah") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("@", -15, -7);
    pg.text("@", 15, -7);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text(".", 0, 8);
  } else if (type == "bruh") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text("_", -19, -25);
    pg.text("_", 19, -25);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 5);
  } else if (type == "derp") {
    pg.textSize(50)
    pg.strokeWeight(3);
    pg.text(".", -22, -20);
    pg.text(".", 22, -20);
    pg.textSize(100)
    pg.strokeWeight(1);
    pg.text("-", 0, 5);
  }
  pg.pop()
}