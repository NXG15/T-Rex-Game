var PLAY =1;
var END =0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var rand;

var score = 0;
var gameOver, restart;
var gameOverImg, restartImg;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

function preload(){
  trex_running = loadAnimation("trex1.png",     "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  //clouds and obstable images
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //restart and game over
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600,200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.4;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);
  ground.velocityX = -(6 + 3*score/100);
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //Groups
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //game over and restart
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  gameOver.visible = false;
  restart.visible = false;
  
  
}

function spawnClouds(){
  if(frameCount % 60 ==0){
    
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale=0.5;
    cloud.velocityX = -3;
    
    //lifetime
    cloud.lifetime = 200;
    
    //depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //group of clouds
    cloudsGroup.add(cloud);
  }}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    
    //generate random obstacles
    rand = Math.round(random(1,6));
    
    switch(rand){
      
      case 1: obstacle.addImage(obstacle1);
      break;
      
      case 2 : obstacle.addImage(obstacle2);
      break;
      
      case 3 : obstacle.addImage(obstacle3);
      break;
      
      case 4 : obstacle.addImage(obstacle4);
      break;
      
      case 5 : obstacle.addImage(obstacle5);
      break;
      
      case 6 : obstacle.addImage(obstacle6);
      break;
           
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
  
function draw() {
  background(180);
  
  //score
  textSize(14);
  stroke("white");
  fill("white");
  textFont("Georgia");
  //textStyle(BOLD);
  text("Score: " + score, 500, 50);
  
  //invisible ground
  trex.collide(invisibleGround); 
  
  //collider raduis
  trex.debug=false;
  trex.setCollider("circle",0,0,30);
  
  //PLAY
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
  
  //jumping trex
  if(keyDown("space") && trex.y>166){
     trex.velocityY = -10;
    //console.log(trex.y);
  }
    
  trex.velocityY = trex.velocityY + 0.64;
    
  //moving ground
  if(ground.x<0){
    ground.x = ground.width/2;
  }
    
  
    
  spawnClouds();
  spawnObstacles();
  
  if (obstaclesGroup.isTouching(trex)){
    gameState=END;
  }
  
   //END
  if(gameState == END){
    //visibility
    gameOver.visible = true;
    restart.visible = true;
    
    //velocities
    trex.velocityX=0;
    trex.velocityY=0;
    
    
    ground.velocityX=0;
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    
    //animation
    trex.changeAnimation("collided", trex_collided);
    
    //lifetimes
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    
    
    }
  
  }  
  
  //restart
    if(mousePressedOver(restart)){
      reset();
  }
  
  drawSprites();
}

function reset(){
   gameState = PLAY;
   
   gameOver.visible = false;
   restart.visible = false;
   
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
   
   trex.changeAnimation("running", trex_running);
   
   score =0;
   
   
 
 }
  
  