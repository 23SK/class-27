const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls = [];
var boats = [];
var boat;
var boatAnimation = [];
var boatSpriteData,boatSpriteSheet;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpriteData = loadJSON("./assets/boat/boat.json");
  boatSpriteSheet = loadImage("./assets/boat/boat.png");

}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;

  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);
  cannon = new Cannon(180, 110, 130, 100, angle);
  //boat = new Boat(width,height-100,180,180,-100);

  var boatFrames = boatSpriteData.frames
  for(var i = 0;i<boatFrames.length;i++){
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  } 
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  push();
  fill("brown");
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  // Matter.Body.setVelocity(boat.body,{x:-0.9,y:0});
  // boat.display();

  cannon.display();
  for (var i = 0; i < balls.length; i++) {
    showCannonBall(balls[i], i);
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {
        var collision = Matter.SAT.collides(boats[j].body, balls[i].body);
        if (collision.collided) {
          boats[j].remove(j);
          World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;
        }
      }
    }
  }

  showBoats();
}


function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    cannonBall = new CannonBall(cannon.x, cannon.y);
    //console.log(cannonBall);
    balls.push(cannonBall);
    //console.log(balls.length)
    balls[balls.length - 1].shoot();
  }
}

function showCannonBall(ball, index) {
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    World.remove(world, ball.body);
    balls.splice(index, 1)
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 300) {
      var positions = [-60, -70, -80, -90]
      var position = random(positions);
      boat = new Boat(width, height - 100, 180, 180, position,boatAnimation);
      boats.push(boat);
    }
    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, { x: -0.9, y: 0 })
      boats[i].display();
      boats[i].animate();
    }
  }
  else {
    boat = new Boat(width, height - 100, 180, 180, -100,boatAnimation);
    boats.push(boat);
  }

}