export const gener_history_freq = [];
export let globalPreh = [];

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

export function readData(popSize, prehistoryLength, playerNumber, strategyFromFile2) {
    let individuals;
    let strategyFromFile = [
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1 ,0 ,1 ,0 ,1, 0, 1, 0 ,1, 0 ,1 ,0 ,1 ,0 ,1, null],
        [0, 0, 0 ,0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, null],
        [0, 1, 1, 0, 0, 0, null]
    ]
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
            while(strategyFromFile[i][j] !== null) {
                strategy.push(strategyFromFile[i][j]);
                j++;
            }
            individuals.push(new Individual(prehistory, strategy, 0));
        }
        globalPreh = prehistory;
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
    globalPreh = prehistory;
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
    calculate(id, playerNumber) {
        let sumOfPrehistory = getPrehistory(id, playerNumber, this.prehistory);
        console.log('prehistory:', id, sumOfPrehistory);
        this.playedGames++;
        let strategyId = parseInt(sumOfPrehistory, 2);
        console.log("strategyID", strategyId);
        this.calculates++;
        console.log("strategyValue", this.strategy[strategyId]);
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

function getPrehistory(id, playerNumber) {
    let prehistory = '';
    let sumOfPrehistory = ''
    let colLength = globalPreh.length / playerNumber;
    for(let i = 0; i < colLength; i++) {
        prehistory += globalPreh[id + i*playerNumber];
        sumOfPrehistory = 0;
        for(let j = 0; j < playerNumber; j++) {
            if(globalPreh[j + i*playerNumber] === 1 && j + i*playerNumber !== id + i*playerNumber) {
                sumOfPrehistory += 1;
            }
        }
        sumOfPrehistory = sumOfPrehistory.toString(2);
        while(sumOfPrehistory.split().length < playerNumber - 1) {
            sumOfPrehistory = '0' + sumOfPrehistory;
        }
        prehistory += sumOfPrehistory;
    }
    return prehistory;
}

// function getPrehistory(id, playerNumber, prehistory) {
//     let sumOfPrehistory = '';
//     let preh = prehistory.slice();
//     let colLength = preh.length / playerNumber;
//     for(let i = 0; i < colLength; i++) {
//         sumOfPrehistory += preh[id + i*playerNumber];
//         for(let j = 0; j < playerNumber; j++) {
//             if(j != id) {
//                 sumOfPrehistory += preh[j + i*playerNumber];
//             }
//         }
//     }
//     return sumOfPrehistory;
// }

