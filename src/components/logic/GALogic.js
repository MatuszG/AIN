import {Individual, randomRange, sumPoints} from './utils'

export function findBestPlayer(individuals) {
    let fitnessPoints = 0;
    let player = individuals[0];
    for(let i = 0; i < individuals.length; i++) {
        if(fitnessPoints < individuals[i].fitnessPoints) {
            fitnessPoints = individuals[i].fitnessPoints;
            player = individuals[i];
        }
    }
    // console.log("max:", player.fitnessPoints)
    return player;
}

export function findAveragePlayer(individuals) {
    let player = individuals[0];
    let sumFitnessPoints = 0;
    for(let i = 0; i < individuals.length; i++) {
        sumFitnessPoints += individuals[i].fitnessPoints;
    }
    let avgFitnessPoints = sumFitnessPoints/individuals.length;
    let delta = Number.MAX_SAFE_INTEGER;
    for(let i = 0; i < individuals.length; i++) {
        if(Math.abs(avgFitnessPoints - individuals[i].fitnessPoints) < delta) {
            delta = Math.abs(avgFitnessPoints - individuals[i].fitnessPoints);
            player = individuals[i];
        }
    }
    // console.log("avg:", player.fitnessPoints)
    return player;
}

export function calcFitness(Individuals, numOfTournaments) {
    let sumFitness = 0;
    let powerValue = 2;
    console.log(sumPoints[0]);

    for(let i = 0; i < Individuals.length; i++) {
        // console.log('calc', Individuals[i].calculates);
        // console.log('pts', Individuals[i].sumPoints);
        // console.log('pd', Individuals[i].playedGames);
        // Individuals[i].fitness = Math.pow(Individuals[i].sumPoints/(Individuals[i].calculates * numOfTournaments), powerValue);
        // Individuals[i].fitness = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        // Individuals[i].fitnessPoints = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        // Individuals[i].fitness = Individuals[i].sumPoints/(sumPoints);
        // Individuals[i].fitness = Math.pow(Individuals[i].sumPoints, powerValue);
        // console.log(Individuals[i].playedGames);
        // Individuals[i].fitness = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        Individuals[i].fitness = Individuals[i].sumPoints/sumPoints[0];
        Individuals[i].fitnessPoints = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        // console.log(Individuals[i].fitnessPoints);
        // if(Individuals[i].fitnessPoints>50) {
        //     console.log(Individuals[i])
        //     return;
        // }
        // Individuals[i].fitnessPoints = Individuals[i].sumPoints/(sumPoints);
        // sumFitness = Individuals[i].fitnessPoints;
        sumFitness += Individuals[i].fitness;
    }
    for(let i = 0; i < Individuals.length; i++) {
        if(sumFitness !== 0) {
            Individuals[i].fitness = Individuals[i].fitness/sumFitness;
        }
    }
}

export function evolve(individuals, crossoverProb, mutationProb, tournament_size, elitist) {
    sortIndividuals(individuals);
    console.log(individuals[0].sumPoints/(individuals[0].playedGames * 151));
    console.log(individuals[0].sumPoints)
    // console.log(individuals[0].fitness);
    // for(let i = 0; i < individuals.length; i++) {
    //     console.log(individuals[i].fitness);
    // }
    let selectedIndividuals = [];
    let strategyLength = individuals[0].strategy.length;
    while(selectedIndividuals.length < individuals.length) {
        let range = randomRange(strategyLength);
        let firstIndividual = poolSelection(individuals, tournament_size);
        if((range/strategyLength) <= crossoverProb ) {
            let secondIndividual = poolSelection(individuals, tournament_size);
            if(selectedIndividuals.length === individuals.length - 1){
                selectedIndividuals.push(crossover(firstIndividual, secondIndividual, range));
            }
            else {
                selectedIndividuals.push(crossover(firstIndividual, secondIndividual, range));
                selectedIndividuals.push(crossover(secondIndividual, firstIndividual, range));
            }
        }
        else {
            selectedIndividuals.push(firstIndividual);
        }
    }
    if(elitist) {
        let isElitist = false;
        for(let i = 0; i < selectedIndividuals; i++) {
            if(selectedIndividuals.strategy === individuals[0].strategy) {
                isElitist = true;
            }
        }
        if(!isElitist) {
            selectedIndividuals.splice(-1);
            selectedIndividuals.push(new Individual(individuals[0].prehistory.slice(), individuals[0].strategy.slice(), individuals[0].fitness));
        }
    }
    individuals = selectedIndividuals.slice();
    mutation(individuals, mutationProb);
}

function crossover(firstIndividual, secondIndividual, range) {
    let newStrategy = firstIndividual.strategy.slice(0, range);
    newStrategy = newStrategy.concat(secondIndividual.strategy.slice(range));
    firstIndividual.strategy = newStrategy;
    return firstIndividual;
}

function mutation(individuals, mutationProb) {
    for(let i = 0; i < individuals.length; i++) {
        for(let j = 0; j < individuals[i].strategy.length; j++) {
            if(Math.random() <= mutationProb) {
                individuals[i].strategy[j] = mutateBit(individuals[i].strategy[j]);
            }
        }
    }
}

function mutateBit(bit) {
    if(bit) return 0;
    return 1;
}

function poolSelection(individuals, tournament_size) {
    let ind = individuals[individuals.length - 1];
    for(let i = 0; i < tournament_size; i++) {
        let random = Math.random();
        for(let i = 0; i < individuals.length; i++) {
            random -= individuals[i].fitness;
            if(random <= 0 && ind.fitness < individuals[i].fitness ) {
                // console.log(i);
                // console.log(ind.fitness);
                // console.log(individuals[i].fitness);
                ind = new Individual(individuals[i].prehistory.slice(), individuals[i].strategy.slice(), individuals[i].fitness);
            } 
        }
    }
    return new Individual(ind.prehistory, ind.strategy, ind.fitness);
}

function sortIndividuals(individuals) {
    individuals.sort(function compare(a, b) {
        if(a.fitness > b.fitness) {
            return -1;
        }
        else if(a.fitness < b.fitness) {
            return 1;
        }
        return 0;
    });
}