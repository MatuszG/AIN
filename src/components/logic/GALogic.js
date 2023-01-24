import {Individual, randomRange} from './utils'

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

export function calcFitness(Individuals, numOfTournaments) {
    let sumFitness = 0;
    let powerValue = 1.2;
    for(let i = 0; i < Individuals.length; i++) {
        // Individuals[i].fitness = Math.pow(Individuals[i].sumPoints/(Individuals[i].calculates * numOfTournaments), powerValue);
        Individuals[i].fitness = Individuals[i].sumPoints/(Individuals[i].calculates * numOfTournaments);
        Individuals[i].fitnessPoints = Individuals[i].sumPoints/(Individuals[i].calculates * numOfTournaments);
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

export function evolve(individuals, crossoverProb, mutationProb, tournament_size, elitist) {
    sortIndividuals(individuals);
    let selectedIndividuals = [];
    let strategyLength = individuals[0].strategy.length;
    while(selectedIndividuals.length < individuals.length) {
        let range = randomRange(strategyLength);
        let firstIndividual = poolSelection(individuals, tournament_size);
        if((range/strategyLength) <= crossoverProb / 100) {
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
    sortIndividuals(selectedIndividuals);
    if(elitist) {
        selectedIndividuals.splice(-1);
        selectedIndividuals.push(new Individual(individuals[0].prehistory, individuals[0].strategy, individuals[0].fitness));
    }
    individuals = selectedIndividuals;
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
    let ind = individuals[individuals.length - 1];
    for(let i = 0; i < tournament_size; i++) {
        let random = Math.random();
        for(let i = 0; i < individuals.Length; i++) {
            random -= individuals[i].fitness;
            if(random <= 0 && ind.fitness < individuals[i].fitness ) {
                ind = new Individual(individuals[i].prehistory, individuals[i].strategy, individuals[i].fitness);
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