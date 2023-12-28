let bestFitness = 0;

function nextGeneration() {
    generation += 1;

    calculateFitness();

    livingDinos = Array.from({ length: DINOS }, () => pickBest());
    deadDinos = [];
}

function calculateFitness() {
    const sum = deadDinos.reduce((acc, dino) => acc + dino.score, 0);

    deadDinos.forEach(dino => {
        dino.fitness = dino.score / sum;
    });
}

function pickBest() {
    // encontra qual é o individuo com maior fitness
    let bestIndex = deadDinos.reduce((index, dino, i) => (dino.fitness > deadDinos[index].fitness) ? i : index, 0);


    const tempDino = deadDinos[bestIndex];
    //encontra o maior fitness
    if (bestFitness < tempDino.fitness) {
        bestFitness = tempDino.fitness;
        bestScore = tempDino.score;
        bestDino = tempDino;
    }

    const child = new Dino(tempDino.brain);
    child.dinoMutate(0.1);
    return child;
}