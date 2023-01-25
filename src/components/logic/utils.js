export const gener_history_freq = [];

export function getBinary(probOfInit) {
    if(Math.random() < probOfInit) return 1;
    else return 0;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function randomRange(strategyLength) {
    return Math.round(Math.random() * (strategyLength - 1));
}

export function readData(popSize, prehistoryLength, playerNumber, strategyFromFile) {
    let individuals;
    if(strategyFromFile === []) {
        individuals = createRandomInputData(
          popSize,
          prehistoryLength,
          playerNumber,
          strategyLength,
          probOfInit
        );
    }
    else {
        let prehistory = [];
        let j = 0;
        while(strategyFromFile[popSize][j] !== null) {
            prehistory.push(strategyFromFile[popSize][j]);
            j++;
        }
        individuals = [];
        for(let i = 0; i < popSize; i++) {
            let strategy = [];
            let j = 0;
            while(strategyFromFile[popSize][j] !== null) {
                strategy.push(strategyFromFile[popSize][j]);
                j++;
            }
            individuals.push(new Individual(prehistory, strategy, 0));
        }
    }
    return individuals;
}

export function createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength, probOfInit) {
    let individuals = [];
    let prehistory = [];
    for(let i = 0; i < prehistoryLength*playerNumber; i++) {
        prehistory.push(getBinary(probOfInit/100));
    }
    for(let i = 0; i < popSize; i++) {
        let strategy = [];
        for(let i = 0; i < strategyLength; i++) {
            strategy.push(getBinary(probOfInit/100));
        }
        individuals.push(new Individual(prehistory, strategy, 0));
    }
    return individuals;
}


export class Individual {
    constructor(prehistory, strategy, fitness) {
        this.prehistory = prehistory;
        this.strategy = strategy;
        this.fitness = fitness;
        this.playedGames = 0;
        this.points = 0;
        this.sumPoints = 0;
        this.fitnessPoints = 0;
        this.calculates = 0;
    }
    calculate() {
        let sumOfPrehistory = '';
        this.prehistory.slice().reverse().forEach(el => {
            sumOfPrehistory += String(el);
        });
        // this.prehistory.slice().forEach(el => {
        //     sumOfPrehistory += String(el);
        // });
        let strategyId = parseInt(sumOfPrehistory, 2);
        this.calculates++;
        gener_history_freq[strategyId]++;
        return this.strategy[strategyId];
    }
    resetPoints() {
        this.sumPoints += this.points;
        this.points = 0;
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
        this.calculates = 0;
        this.fitnessPoints = 0;
        this.fitness = 0;
    }
    say() {
        console.log(`prehistory: ${this.prehistory}`);
        console.log(`strategy: ${this.strategy}`);
        console.log(`points: ${this.points}`);
    }
}