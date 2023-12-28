const HIGH_GRAVITY = 1.8;
const LOW_GRAVITY = 0.6;

class Dino {
  constructor(brain) {
    this.r = 100;// altura
    this.w = 50; // largura
    this.x = 50; // posição no eixo x
    this.y = height - this.r; // posição no eixo y
    this.vy = 0; // variação da posição no eixo y para executar o salto
    this.gravity = LOW_GRAVITY;
    this.live = true;
    this.score = 0;
    this.d = false; //inidica se o dina está abaixado ou de pé
    
    this.fitness = 0;//parâmetro utilizado para saber qual será a influênica de cada modelo na
                     //na próxima geraçãco
                  
    this.brain = brain instanceof NeuralNetwork ? brain.copy() : new NeuralNetwork(4, 64, 3);
    // iniciação da rede neural caso ela já existe, apenas será retornado uma cópia
  }

  jump() {
    this.gravity = LOW_GRAVITY; // a gravidade é definida como baixa
    this.d = false; //caso o dino esteja abaixado, ele fica de pé para realizar o salto
    if (height - this.y - this.r === 0) {//verificação para saber se o dino está no chão
      this.vy = -15; // variação na posição do eixo x
    }
  }

  hits(obs) { // função para ver se o dino colidiu com algum obstáculo
    const yAdjust = this.d ? this.r / 2 : 0;// necessário para saber se o dino está abaixado ou não
    //função de colisão da lib p5, parametros: pos em x, pos em y, largura e altura, 
    //e mesma coisa para o obstáculo
    return collideRectRect(this.x, this.y + yAdjust, this.w, this.r - yAdjust, obs.x, obs.y, obs.w, obs.h);
  }

  move() {
    this.y += this.vy; //função de movimentação do player que só se movimenta no eixo vertical
    this.vy += this.gravity;
    this.y = constrain(this.y, 0, height - this.r);// restrição de movimentação no eixo y
  }

  duck() {
    const elev = height - this.y - this.r; //utilizado para saber se o dino está no chão ou não
    this.gravity = elev !== 0 ? HIGH_GRAVITY : LOW_GRAVITY; //se ele não estiver no chão a gravidade 
                                                            //é alterada para High, para que ele 
                                                            //caia mais rápido 
    this.d = elev === 0;//se a elevação for igual a zero o player abaixa
  }

  show() {
    const yAdjust = this.d ? this.r / 2 : 0;  //utilizado para mostrar o player de pé ou abaixado
    rect(this.x, this.y + yAdjust, this.w, this.r - yAdjust);
  }

  dinoThink() {
    let nObstacle; // próximo obstáculo
    let minDistance = Infinity; // distância do obstáculo mais próximo

    for (const obstacle of obstacles) { // encontrando o obstáculo mais próximo
      const distance = obstacle.x - this.x + 20;

      if (distance < minDistance && distance > 0) { 
        nObstacle = obstacle;
        minDistance = distance;
      }
    }

    if (nObstacle) {// caso ele exista 
      const i0 = map(nObstacle.x, this.x, width, 0, 1); // primeira entrada distância entre 
                                                        // o player e próximo obstáculo.
                                                        // normalizada entre 0 e 1

      const i1 = map(nObstacle.x + nObstacle.w, this.x, width, 0, 1);// segunda entrada distância entre o player
                                                                     // e o próximo obstáculo + a largura do 
                                                                     //obstáculo normalizada entre 0 e 1    

      const i2 = nObstacle.h === 30 ? -0.5 : 0.5; // terceira entrada indica se o obstáculo está no chão ou não
                                                  // normalizada entre -0.5 e 0.5.

      const i3 = (nObstacle.speed - 6) / (15 - 6);//Quarta entrada velocidade do obstáculo e do jogo normalizada entre 0 e 1
      
      const inputs = [i0, i1, i2, i3]; //conjunto de entrada
      const output = this.brain.predict(inputs);//saídas

      if (output[0] > output[1] && output[0] > output[2]) this.jump(); // se a maior saída for a zero o dino pula
      else if (output[1] > output[0] && output[1] > output[2]) this.duck();//se for a 1 ele abaixa
      else this.d = false;//se for a 2 ele continua se movimentando normalmente e se estiver abaixado levanta
    }
  }

  copy() {
    return new Dino(this.brain);
  }

  dinoMutate(rate) {
    this.brain.mutate(rate);
  }



  dinoDispose() {
    this.brain.dispose();//discarta o modelo
  }
}