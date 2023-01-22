export function getBinary(probOfInit) {
    if(Math.random() < probOfInit) return 1;
    else return 0;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

export function readData(n) {
    return n;
}

export function createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength, probOfInit) {
    let individuals = [];
    let prehistory = [];
    for(let i = 0; i < prehistoryLength*playerNumber; i++) {
        prehistory.push(getBinary(probOfInit));
    }
    for(let i = 0; i < popSize; i++) {
        let strategy = [];
        for(let i = 0; i < strategyLength; i++) {
            strategy.push(getBinary(probOfInit));
        }
        individuals.push(new Individual(prehistory, strategy, 0));
    }
    return individuals;
}


export class Individual {
    constructor(prehistory, strategy, fitness) {
        this.prehistory = prehistory
        this.strategy = strategy
        this.playedGames = 0;
        this.points = 0;
        this.sumPoints = 0;
        this.fitness = fitness;
    }
    calculate() {
        let sumOfPrehistory = '';
        this.prehistory.slice().reverse().forEach(el => {
            sumOfPrehistory += String(el);
        });
        let strategyId = parseInt(sumOfPrehistory, 2);
        return this.strategy[strategyId];
    }
    reset() {
        this.sumPoints += this.points;
        this.points = 0;
        this.playedGames = 0;
    }
    hardReset() {
        this.points = 0;
        this.sumPoints = 0;
        this.playedGames = 0;
    }
    say() {
        console.log(`prehistory: ${this.prehistory}`);
        console.log(`strategy: ${this.strategy}`);
        console.log(`points: ${this.points}`);
    }
}