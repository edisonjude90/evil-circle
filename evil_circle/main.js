// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var balls = [];





function Shape(x,y,velX,velY,exist){
  this.x = x;
  this.y = y; 
  this.velX = velX;
  this.velY = velY;
  this.exist = exist;
}

/* Ball Constructor */
function Ball(x,y,velX,velY,size,color,exist){
  Shape.call(this,x,y,velX,velY,exist);
  this.color = color;
  this.size = size;
}

/* Ball inherits from Shape */
Ball.prototype = Object.create(Shape.prototype);
Ball.constructor = Ball;

Ball.prototype.draw = function(){
   
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.fill();

}

Ball.prototype.update = function(){

    
  if (this.x + this.size >= width){ // right of the screen
    this.velX = -(this.velX); 
  }

  if ((this.x - this.size) <= 0){ // left of the screen 
    this.velX = -(this.velX);
  }

  if (this.y + this.size >= height){ // bottom of the screen
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0){ // top of the screen
    this.velY = -(this.velY);
  }
  
  this.x += this.velX;
  this.y += this.velY;

}


Ball.prototype.collisionDetect = function(){

   for (var j = 0; j < balls.length; j++){
      if(!(this === balls[j]) && balls[j].exist){ // skip self and balls set as exist = false
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
              balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            }
      }

   }

}

/* EvilCircle Constructor */
function EvilCircle(x,y){
  Shape.call(this,x,y,20,20,true);
  this.size = 10;
  this.color = "White";
}

/* EvilCircle inherits from Shape */
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.constructor = EvilCircle;

EvilCircle.prototype.draw = function(){
   
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
    ctx.stroke();

}

EvilCircle.prototype.checkBounds = function(){
    
  if (this.x + this.size >= width){ // right of the screen
      this.x -= 5;
  }

  if ((this.x - this.size) <= 0){ // left of the screen 
      this.x += 5;
  }

  if (this.y + this.size >= height){ // bottom of the screen
      this.y -= 5;  
  }

  if ((this.y - this.size) <= 0){ // top of the screen
      this.y += 5;
  }

}

EvilCircle.prototype.setControls = function(){

  var _this = this; // setting this to maintain reference to the EvilCircle 
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  }

}

EvilCircle.prototype.collisionDetect = function(){

   for (var j = 0; j < balls.length; j++){
      if(balls[j].exist){ // Ball still exist continue to check collision  
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
              balls[j].exist = false;  
            }
      }

   }

}

var evilCircle = new EvilCircle(50,50);
evilCircle.setControls();
var counterVal = document.getElementById("ball-count");

function loop(){

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    var i = 0;
    while(balls.length < 10){
        var ball = new Ball(
           random(0,width),
           random(0,height),
           random(7,-7),
           random(7,-7),
           random(10,20),
           "rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")",
           true
        );
        balls[i] = ball;
        i++;
    }

    ballsCount = 0;
    for (var j = 0; j < balls.length; j++){
      if (balls[j].exist){ // skipping balls which are set as exist = false;
        
        ballsCount++;
        balls[j].draw(); 
        balls[j].update();
        balls[j].collisionDetect();

        evilCircle.draw();
        evilCircle.checkBounds();
        evilCircle.collisionDetect();

      }
    }

    counterVal.innerHTML = ballsCount;

    if (ballsCount == 0){
      document.getElementById("win-message").style.display = "block";
    }

    requestAnimationFrame(loop);

}


function random(min,max) {
  var num = Math.floor(Math.random()*(max-min + 1)) + min;
  return num;
}

(function(){

  loop();

})();