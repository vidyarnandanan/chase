//Create variables here
var dog,dog_happy,foodS,foodStock;
var x=20;
var button1,button2,fedTime,lastFed;
var foodObj;
var bedroom,garden,washroom;
var bedroom_IMG,garden_IMG,washroom_IMG;
var gameState
function preload()
{
  dog=loadImage("images/dogImg.png")
  dog_happy=loadImage("images/dogImg1.png")
  bedroom=loadImage("virtual pet images/Bed Room.png")
  washroom=loadImage("virtual pet images/Wash Room.png")
  garden=loadImage("virtual pet images/Garden.png")
	//load images here
}

function setup() {
  database=firebase.database()
  createCanvas(500, 500);
  dogSprite=createSprite(300,300,50,50)
  dogSprite.scale=0.2
  dogSprite.addImage(dog);
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  foodObj=new Food()

     button1=createButton("Feed the dog")
button1.position(600,100)
button1.mousePressed(feedDog);
 button2=createButton("Add food")
button2.position(700,100)
button2.mousePressed(addFoods);

}

function draw() {  
background(46, 139, 87)
console.log(gameState)
//foodObj.display()
currentTime=hour();
if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
}else if(currentTime==(lastFed+2)){
    update("sleeping");
    //background();  
    foodObj.bedroom();
}else if(currentTime==(lastFed+3)){
    update("Bathing");
    foodObj.washroom();

}else{
    update("Hungry")
    foodObj.display();
}

fedTime=database.ref('FeedTime')
fedTime.on("value",function(data){
  lastFed=data.val()
})

readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
})

if(gameState!="Hungry"){
  button1.hide();
  button2.hide()
  dogSprite.remove();
}


else{
  button1.show();
  button2.show()
  dogSprite.addImage(dog);

}

  drawSprites();
  fill(255,255,254);
  //text("vidya",250,250)
   //textSize(15);
   if(lastFed>=12){
       text("Last Feed : "+lastFed%12 + " PM",300,30)
   }else if(lastFed==0){
       text("Last Feed : 12 AM",350,30)
   }else{
       text("Last Feed : "+lastFed + " AM",300,30)
   }

  }
  //add styles here


function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
  }

  function writeStock(x){
    if(x<=0){
      x=0;
      textSize(15)
      fill("white")
    }else{
      x=x-1;
    }

    database.ref('/').update({
      Food:x
    })
  }

  function feedDog(){
    dogSprite.addImage(dog_happy);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
    
    database.ref('/').update({
Food:foodObj.getFoodStock(),
 FeedTime:hour(),
 gameState:"Hungry"
    })
}

function addFoods(){
    foodS++;
    database.ref('/').update({
        Food:foodS
    })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}