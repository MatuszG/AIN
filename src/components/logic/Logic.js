import {readData, createRandomInputData} from './utils'

export default function Logic(
    numOfRuns, numOfGenerations, numOfTournaments, popSize, prehistoryLength, n, twoPd,
    c1, c2, c3, c4, d1, d2, d3, d4
) {
    let runs = 0;
    let playerNumber = n;
    if(twoPd) {
        playerNumber = 2;
    }
    const strategyLength = 2^(popSize * playerNumber) > 128 ? (popSize * playerNumber) : 128;

    while(runs++ < numOfRuns) {
        let individuals;
        if(playerNumber === 2 && (popSize === 2 || popSize === 3) ||
            (playerNumber === 3 && (popSize === 3 || popSize === 4))
        ) {
            // individuals = readData(playerNumber);
            individuals = createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength);
        }
        else {
            individuals = createRandomInputData(popSize, prehistoryLength, playerNumber, strategyLength);
        }
        if(numOfGenerations == 0) return;
        for(let generation = 0; generation <= numOfGenerations; generation++) {
            // console.log(`Generation: ${generation}`);
            if(playerNumber === 2) {
                standardGame(numOfTournaments, individuals, c1, c2, c3, c4, d1, d2, d3, d4);
            } 
            else {
                console.log("Tomek ma małego");
            }
        }
    }
}

function standardGame(numOfTournaments, individuals, c1, c2, c3, c4, d1, d2, d3, d4) {
    let prehistory = individuals[0].prehistory;
    let playerOutputs = prehistory;
    for(let i = 0; i < numOfTournaments; i++) {
        individuals[0].reset();
        individuals[1].reset();
        playerOutputs.push(individuals[0].calculate());
        playerOutputs.push(individuals[1].calculate());
        playerOutputs.splice(0,2);
        if(playerOutputs[prehistory.length - 1] === playerOutputs[prehistory.length - 2]) {
            if(playerOutputs[prehistory.length - 1] === 1) {
                individuals[0].points += c1;
                individuals[1].points += c2;
            }
            else {
                individuals[0].points += d3;
                individuals[1].points += d4;
            }
        }
        else {
            if(playerOutputs[prehistory.length - 1] === 1) {
                individuals[0].points += d1;
                individuals[1].points += c3;
            }
            else {
                individuals[0].points += c4;
                individuals[1].points += d2;
            }
        }
    }
    individuals.forEach(element => {
        element.prehistory = playerOutputs;
    });
}
