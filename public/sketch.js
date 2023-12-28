let obstacles = [];
let score, next, randint;
let DINOS = 5, generation = 0, count = 0, record = 0;
let dino, deadDinos = [], livingDinos = [];
let runBest = false

function setup() {
  createCanvas(1200, 500);
  textSize(24);
  createDinos();
  resetSketch();
}

function resetSketch() {
  score = 0;
  next = 0;
  dino = livingDinos[deadDinos.length];
  randint = int(random(20, 100));
  loop();
}

function draw() {
  background(220);
  text(`${score}\nGeração: ${generation}\nDino ${deadDinos.length}\nRecord ${record}`, 5, 24);
  next += 1;

  if (next == randint) {
    obstacles.push(new Obstacle(score));
    score += 1;
    // dino.score = score;//conta o score a cada obstáculo
    next = 0;
    randint = int(random(40, width / 6));
  }

  if (obstacles.length > 0) {// se tiver mais de um osbstáculo a ia é chamada
    livingDinos.forEach(dino => {
      dino.dinoThink()
    })
    //dino.dinoThink();
  }

  obstacles = obstacles.filter(o => o.x >= 0);//filtra os obstaculos que estão em tela
  obstacles.forEach(o => { o.move(); o.show(); });//mostra os obstáculos

  livingDinos.forEach(dino => {
    if (obstacles.some(o => dino.hits(o))) {//verifica se o dino bateu em algum obstáculo
      if (dino.live) {
        deadDinos.push(dino);//player que bateu é colocado dentro do vetor deadDinos
        dino.live = false
        dino.score = score
        if (!(deadDinos.length < DINOS)) {//se todos os dinos ja jogaram inicia-se uma nova geração
          livingDinos = [];
          nextGeneration();
          reset();
        } else if (runBest) {
          runBest = false
        }
      }
    }
  })


  livingDinos.forEach(dino => {
    if (dino.live) {
      dino.show();
      dino.move();
    }

  });
}

function createDinos() {
  livingDinos = Array.from({ length: DINOS }, () => new Dino());
}


function runBestModel() {
  livingDinos = Array.from({ length: 1 }, () => new Dino());
  livingDinos[0].brain.load();
  runBest = true;
}

function keyPressed() {
  runBestModel();
}

function reset() {
  obstacles = [];
  if (score > record) {
    record = score;
    if (score > 100) dino.brain.save(score);
  }
  resetSketch();
}
