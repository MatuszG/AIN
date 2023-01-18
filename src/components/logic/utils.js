export function getBinary() {
    if(Math.random() > 0.5) return 1;
    else return 0;
}

export function readData(n) {
    return n;
}

export function createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength) {
    let individuals = [];
    let prehistory = [];
    for(let i = 0; i < prehistoryLength; i++) {
        for(let i = 0; i < playerNumber; i++) {
            prehistory.push(getBinary());
        }
    }
    for(let i = 0; i < popSize; i++) {
        let strategy = [];
        for(let i = 0; i < strategyLength; i++) {
            strategy.push(getBinary());
        }
        individuals.push(new Individual(prehistory, strategy));
    }
    return individuals;
}


class Individual {
    constructor(prehistory, strategy) {
        this.prehistory = prehistory
        this.strategy = strategy
        this.points = 0;
        this.sumPoints = 0;
    }
    calculate() {
        let sumOfPrehistory = '';
        this.prehistory.forEach(el => {
            sumOfPrehistory += String(el);
        });
        let strategyId = parseInt(sumOfPrehistory, 2);
        if(strategyId <= this.strategy.length)
        return this.strategy[strategyId];
        console.log("Strategy length ERROR");
        return -1;
    }
    reset() {
        this.sumPoints += this.points;
        this.points = 0;
    }
    hardReset() {
        this.points = 0;
        this.sumPoints = 0;
    }
    say() {
        console.log(`prehistory: ${this.prehistory}`);
        console.log(`strategy: ${this.strategy}`);
        console.log(`points: ${this.points}`);
    }
}