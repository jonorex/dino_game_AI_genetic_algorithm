const PROB_B = 0.05
const PROB_H = 0.25
const MAX_SPEED = 15

class Obstacle {
 
  constructor(score) {
    this.speed = 6;
    const prob = (score > 20) ? PROB_H: PROB_B;
    const isHighProb = random(0,1) > prob;

    this.h = isHighProb ? random(40,60) : 30;
    this.w = isHighProb ? random(40,60) : 80;
    this.x = width;
    this.y = height - (isHighProb ? this.h : random(120, 160));
  }
  
  move() {
    const difficulty = score/10
    if (this.speed < MAX_SPEED) {
      this.x -= (this.speed + difficulty)
    } 
  }
  
  show() {
    rect(this.x, this.y, this.w, this.h)
  }
}