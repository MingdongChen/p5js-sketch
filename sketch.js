class Ball {
  constructor(x, y, creationTime) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.dropped = false;
    this.ballColor = color(random(255), random(255), random(255));
    this.creationTime = creationTime;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.5;
  }

  update() {
    if (!this.dropped) {
      this.x = mouseX;
      this.y = mouseY;
      if (mouseIsPressed) {
        this.size = 50 + (millis() - this.creationTime) / 10;
      } else {
        this.creationTime = millis() - (int(this.size) * 10) + 500;
      }
    } else {
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;

      if (this.x < this.size / 2 || this.x > width - this.size / 2) {
        this.vx = -this.vx * 0.9;
      }
      if (this.y < this.size / 2 || this.y > height - this.size / 2) {
        this.vy = -abs(this.vy) * 0.9;
      }
    }
  }

  display() {
    noStroke();
    fill(this.ballColor);
    ellipse(this.x, this.y, this.size, this.size);
  }

  collidesWith(other) {
    let distance = dist(this.x, this.y, other.x, other.y);
    return distance < (this.size / 2 + other.size / 2);
  }

  resolveCollision(other) {
    let overlap = (this.size / 2 + other.size / 2) - dist(this.x, this.y, other.x, other.y);
    let angle = atan2(this.y - other.y, this.x - other.x);
    this.x += cos(angle) * overlap / 2;
    this.y += sin(angle) * overlap / 2;
    other.x -= cos(angle) * overlap / 2;
    other.y -= sin(angle) * overlap / 2;
  }
}

let balls = [];

function setup() {
  createCanvas(800, 600);
  balls.push(new Ball(mouseX, mouseY, millis()));
}

function draw() {
  background(255);
  for (let ball of balls) {
    ball.update();
  }

  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      let ball1 = balls[i];
      let ball2 = balls[j];
      if (ball1.collidesWith(ball2)) {
        ball1.resolveCollision(ball2);
      }
    }
  }

  for (let ball of balls) {
    ball.display();
  }
}

function mouseReleased() {
  let lastBall = balls[balls.length - 1];
  lastBall.dropped = true;
  lastBall.vy = -5;
  balls.push(new Ball(mouseX, mouseY, millis()));
}
