import {Individual} from './utils'

export function findBestPlayer(individuals) {
    let fitness = 0;
    let player = individuals[0];
    for(let i = 0; i < individuals.length; i++) {
        if(fitness < individuals[i].fitness) {
            fitness = individuals[i].fitness;
            player = individuals[i];
        }
    }
    return player;
}

export function calcFitness(Individuals, elitist) {
    let sumFitness = 0;
    let powerValue = 2;
    if(elitist) {
        powerValue = 6;
    }
    for(let i = 0; i < Individuals.length; i++) {
        Individuals[i].fitness = Math.pow(Individuals[i].sumPoints, powerValue);
        sumFitness = Individuals[i].fitness;
    }
    for(let i = 0; i < Individuals.length; i++) {
        if(sumFitness === 0) {
            Individuals[i].fitness = 0;
        }
        else {
            Individuals[i].fitness = Individuals[i].fitness/sumFitness;
        }
    }
}

export function evolve(individuals, crossoverProb, mutationProb, tournament_size) {
    sortIndividuals(individuals);
    let selectedIndividuals = [];
    let strategyLength = individuals[0].strategy.length;
    for(let i = 0; i < individuals.length/100; i++) {
        selectedIndividuals.push[individuals.slice(i, i + 1)];
    }
    while(selectedIndividuals.length < individuals.length) {
        let range = randomRange(strategyLength);
        let firstIndividual = poolSelection(individuals, tournament_size);
        if((range/strategyLength) <= crossoverProb/100) { // crossover
            let secondIndividual = poolSelection(individuals, tournament_size);
            console.log(secondIndividual);
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
    mutation(individuals, mutationProb);
}

function randomRange(strategyLength) {
    return Math.round(Math.random() * (strategyLength - 1));
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
            if(Math.random() <= mutationProb/100) {
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
    let ind = individuals[0];
    for(let i = 0; i < tournament_size; i++) {
        let random = Math.random();
        for(let i = 0; i < individuals.Length; i++) {
            random -= individuals[i].fitness;
            if(random <= 0 && ind.fitness < individuals[i].fitness ) {
                ind = new Individual(individuals[i].prehistory, individuals[i].strategy);
            } 
        }
        return ind = new Individual(individuals[individuals.length - 1].prehistory, individuals[individuals.length - 1].strategy);
    }
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