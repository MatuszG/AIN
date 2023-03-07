import { mainInfo } from "./Logic";

export const gener_history_freq = [];
export let globalPreh = [];
export let sumPoints = [0];
export let myrng;
  // if(debug) {
  //   data.push(
  //     {
  //       filename: "debug.txt",
  //       flag: 'w',
  //       data: '\nTEST\n'
  //     }
  //   )
  // }

export function setSeed(clockSeed, seed) {
    if(!clockSeed) {
        seed = Math.random();
    }
    else {
        seed = seed;
    }
    myrng = new Math.seedrandom(seed);
}


export function copyArray(original) {
    return [...original];
}

export function getBinary(probOfInit) {
    if(myrng() < parseFloat(probOfInit)) return 1;
    else return 0;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(myrng() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function randomRange(strategyLength) {
    return Math.round(myrng() * (strategyLength - 1));
}

export function readData(popSize, prehistoryLength, playerNumber, strategyFromFile2, debug) {
    let individuals;
    let strategyFromFile = [
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1 ,0 ,1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,null],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0 ,1 ,1 ,1 ,1 ,1 ,0 ,0 ,0 ,0,null],
        [0, 0 ,0 ,0 ,0 ,0 ,0, 0, 0 ,0 ,0 ,0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,1 ,1 ,1 ,1 ,1 ,1 ,1, 1, 1, 1, 1, 1, 1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1 ,1, null],
        [0, 0, 1, 0, 0, 1, null]
    ]
    if(strategyFromFile === [] && !debug) {
        individuals = createRandomInputData(
          popSize,
          prehistoryLength,
          playerNumber,
          strategyLength,
          probOfInit
        );
    }
    else {
        let preh = [];
        let j = 0;
        while(strategyFromFile[3][j] !== null) {
            preh.push(strategyFromFile[3][j]);
            j++;
        }
        globalPreh = preh.slice();
        individuals = [];
        for(let i = 0; i < popSize; i++) {
            let strategy = [];
            let j = 0;
            while(strategyFromFile[i][j] !== null) {
                strategy.push(strategyFromFile[i][j]);
                j++;
            }
            individuals.push(new Individual(preh, strategy, 0));
        }
    }
    return individuals;
}

export function createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength, probOfInit) {
    let individuals = [];
    let prehistory = [];
    for(let i = 0; i < prehistoryLength * playerNumber; i++) {
        prehistory.push(getBinary(probOfInit));
    }
    for(let i = 0; i < popSize; i++) {
        let strategy = [];
        for(let i = 0; i < strategyLength; i++) {
            strategy.push(getBinary(probOfInit));
        }
        individuals.push(new Individual(prehistory, strategy, 0));
    }
    globalPreh = prehistory.slice();
    // console.log(strategyLength);
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
    calculate(id, playerNumber, debug) {
        let sumOfPrehistory = getPrehistory(id, playerNumber);
        let strategyId = parseInt(sumOfPrehistory, 2);
        let debugId = id + 1;
        if(debug == 0) {
            mainInfo.push(`strat_id_${debugId} = ${strategyId}`);
            return strategyId;
        }
        else if(debug == 2) {
            mainInfo.push(`strat_id_${debugId} = ${strategyId}`);
        }
        else if(debug == 3) {
            mainInfo.push(`curr_action_P${debugId} = ${this.strategy[strategyId]}`);
            return;
        }
        else if(debug == 1) {
            mainInfo.push(`curr_action_P${debugId} = ${this.strategy[strategyId]}`);
        }
        this.calculates++;
        if(debug != 0) {
            gener_history_freq[strategyId]++;
        }
        return this.strategy[strategyId];
    }
    resetPoints() {
        this.sumPoints += this.points;
        sumPoints[0] += this.points;
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

export function setPlayers(twoPd, n) {
    let playerNumber = n;
    if (twoPd) {
        playerNumber = 2;
    }
    return playerNumber;
}

export function setFreq(strategyLength) {
    if(gener_history_freq.length === 0) {
        for(let i = 0; i < strategyLength; i++) {
            gener_history_freq.push(0);
        }
    }
    for(let i = 0; i < strategyLength; i++) {
        gener_history_freq[i] = 0;
    }
}

export function resetFreq(strategyLength) {
    for(let i = 0; i < strategyLength; i++) {
        gener_history_freq[i] = 0;
    }
}

export function calcFreq() {
    let initialValue = 0;
    let history_freq = gener_history_freq.slice();
    let sum = history_freq.reduce((accumulator, currentValue) => accumulator + currentValue, initialValue);
    for(let i = 0; i < gener_history_freq.length; i++) {
        history_freq[i] = history_freq[i]/sum;
    }
    return history_freq;
}

export function getPrehistory(id, playerNumber) {
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
        while(sumOfPrehistory.split('').length < playerNumber - 1) {
            sumOfPrehistory = '0' + sumOfPrehistory;
        }
        prehistory += sumOfPrehistory;
    }
    // console.log(prehistory);
    return prehistory;
}

export function getDebugPrehistory(sumOfPrehistory) {
    let debugPreh = sumOfPrehistory.split('').slice();
    let debugPrehNumber = [];
    for (let i = 0; i < debugPreh.length; i++) debugPrehNumber.push(parseInt(debugPreh[i]));
    return debugPrehNumber;
}

// function getPrehistory(id, playerNumber) {
//     let sumOfPrehistory = '';
//     let preh = globalPreh.slice();
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