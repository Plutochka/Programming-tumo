function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  Game.addCommonBalloon();
}
function draw() {
  background("skyblue");

  for (let balloon of Game.balloons) {
    balloon.display();
    balloon.move(Game.score);
    let finalScore = Game.score;

    if (
      finalScore >= 300 ||
      (balloon.y <= balloon.size / 2 && balloon.color != "Red")
    ) {
      noLoop();
      Game.clouds.length = 0;
      Game.balloons.length = 0;
      background(120, 120, 120);
      Game.score = "";
      textSize(64);
      fill("white");
      textAlign(CENTER, TOP);
      text("FINISH", 200, 200, width);
      textSize(34);
      if (finalScore >= 0) text("Score:" + finalScore, 200, 300, width);
      else
        text(
          `Noob?
            Try Again!`,
          200,
          300,
          width
        );
    } else if (Game.score <= -50) {
      noLoop();
      Game.clouds.length = 0;
      Game.balloons.length = 0;
      background(120, 120, 120);
      Game.score = "";
      textSize(64);
      fill("white");
      textAlign(CENTER, CENTER);
      text("HA! HA! HA! HA!", 200, 200, width);
      textSize(34);
      text("Try to find a Bug?", 200, 300, width);
    }
  }
  for (let cloud of Game.clouds) {
    cloud.display();
    cloud.move(Game.score);
  }

  textAlign(CENTER, CENTER);
  textSize(32);
  fill("black");
  text(Game.score, 20, 40);

  if (frameCount % 70 === 0) {
    Game.addCommonBalloon();
  }
  if (frameCount % 120 === 0) {
    Game.addAngryBalloon();
  }
  if ((frameCount % 100) * (980 / width) === 0) {
    Game.addCloud();
  }
}

function mousePressed() {
  if (!isLooping()) {
    setTimeout(
      () => {
        loop();
        Game.score = 0;
      },
      2 * 1000
    );
  }
  Game.checkIfBalloonBurst();
}

class Game {
  static balloons = [];
  static score = 0;
  static clouds = [];

  static addCommonBalloon() {
    let commonBalloon = new CommonBalloon(
      color(random(256), random(256), random(256)),
      random(30, 50)
    );
    this.balloons.push(commonBalloon);
  }

  static addAngryBalloon() {
    let angryBalloon = new AngryBalloon("Red", 65);
    this.balloons.push(angryBalloon);
  }

  static addCloud() {
    let cloud = new Cloud("White", 50, random(0, 100));
    this.clouds.push(cloud);
  }

  static checkIfBalloonBurst() {
    this.balloons.forEach((balloon, index) => {
      let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
      if (distance <= balloon.size / 2) {
        balloon.burst(index);
        popSound.play();
      }
    });
  }
}

function calc(width) {
  if (1 / width > 0.01 && 1 / width < 0.2) {
    return (1 / width) * 145;
  } else {
    return 150;
  }
}

class Cloud {
  constructor(color, size, isRightDirection) {
    if (isRightDirection > 50) {
      this.speed = random(-0.001, -0.0009);
      this.x = 0;
    } else if (isRightDirection <= 50) {
      this.speed = random(0.001, 0.0009);
      this.x = width;
    }
    this.y = random(height);
    this.color = color;
    this.size = size;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    ellipse(this.x + 20, this.y - 15, this.size);
    ellipse(this.x + 40, this.y, this.size);
  }

  move() {
    this.x -= this.speed * width;
  }
  burst(index) {
    Game.clouds.splice(index, 1);
    Game.score += 1;
  }
}
class CommonBalloon {
  constructor(color, size) {
    this.x = random(40, width - 40);
    this.y = random(height - 10, height + 50);
    this.color = color;
    this.size = size;
    this.xstart = this.x;
  }

  display() {
    strokeWeight(1);
    stroke(1);
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
  }

  move(score) {
    this.y -= 1 + score * 0.01;
    this.x = Math.sin(this.y * 0.02) * 12 + this.xstart;
  }

  burst(index) {
    Game.balloons.splice(index, 1);
    Game.score += Math.round(8 * (30 / this.size));
  }
}

class AngryBalloon extends CommonBalloon {
  constructor(color, size) {
    super(color, size);
  }

  display() {
    strokeWeight(1);
    stroke(255, 0, 0);
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
  }

  burst(index) {
    Game.balloons.splice(index, 1);
    Game.score -= 10;
  }
}

const music = new Audio(
  "music/music.mp3"
);

music.loop = true;
music.volume = 0.3;

var popSound = new Audio("music/pop.wav");
popSound.volume = 0.3;

let clicked = false;

// browser blocks autoplay so you need to click anywhere first

document.addEventListener("click", (event) => {
  if (!clicked) {
    music.play();
    clicked = true;
  }
});