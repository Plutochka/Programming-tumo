function setup(){
    createCanvas(400, 400);
    Game.addCommonBalloon()
}
function draw() {

    background('skyblue')

    for (let balloon of Game.balloons){

        balloon.display();
        balloon.move(Game.score);
        let finalScore = Game.score
        

        if (finalScore >= 300 || (balloon.y <= balloon.size / 2 && balloon.color != 'Red')){
            noLoop()
            Game.clouds.length = 0
            Game.balloons.length = 0
            background(136, 220, 166);
            Game.score = ''
            textSize(64);
            fill('white');
            textAlign(CENTER, CENTER);
            text('FINISH', 200, 200);
            textSize(34);

            if (finalScore >= 0)text('Score:' + finalScore, 200, 300);
            else text('Where my money?', 200, 300);
        }
    }
    for (let cloud of Game.clouds){

        cloud.display();
        cloud.move(Game.score);
    }

    textSize(32);
    fill('black');
    text(Game.score, 20, 40);

    if(frameCount % 70 === 0) {
        Game.addCommonBalloon()
    }
    if(frameCount % 120 === 0) {
        Game.addAngryBalloon()
    }
    if(frameCount % 120 === 0) {
        Game.addCloud()
    }
}

function mousePressed() {
    if(!isLooping()){
        loop()
        Game.score = 0
    }
    Game.checkIfBalloonBurst()
}

class Game {
    static balloons = []
    static score = 0
    static clouds = []

    static addCommonBalloon() {
        let commonBalloon = new CommonBalloon(color(random(256), random(256), random(256)), random(30, 50));
        this.balloons.push(commonBalloon);
    }

    static addAngryBalloon() {
        let angryBalloon = new AngryBalloon('Red', 65);
        this.balloons.push(angryBalloon);
    }

    static addCloud(){
        let cloud = new Cloud('White', 50);
        this.clouds.push(cloud);
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        })
    }
}

class Cloud {
    constructor(color, size) {
        this.x = 0;
        this.y = random(height);
        this.color = color;
        this.size = size;
    }

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        ellipse(this.x+20, this.y-15, this.size);
        ellipse(this.x+40, this.y, this.size);
        
    }

    move() {
        this.x -= -0.6
    }
    burst(index) {
        Game.clouds.splice(index, 1)
        Game.score +=1
    }

}
class CommonBalloon {
    constructor(color, size) {
        this.x = random(width);
        this.y = random(height - 10, height + 50);
        this.color = color;
        this.size = size;
    }

    display() {
        strokeWeight(1);
        stroke(1);
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }

    move(score) {
        if(score < 100) {
            this.y -= 1
        }else if (score >= 100 && score <= 200) {
            this.y -= 1.5
        }else {
            this.y -= 2
        }
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score += Math.round(5*(30/this.size))
    }
}



class AngryBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size)
    }

    display() {
        strokeWeight(1);
        stroke(255, 0, 0);
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }

    burst(index) {
        Game.balloons.splice(index, 1)
        Game.score -= 10
    }
}