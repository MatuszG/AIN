import {Individual, randomRange, sumPoints, copyArray, getRandomInt, myrng} from './utils'
import { data, generationsData } from './Logic';
export function findBestPlayer(individuals) {
    let fitnessPoints = 0;
    let player = individuals[0];
    let id = 0;
    for(let i = 0; i < individuals.length; i++) {
        if(fitnessPoints < individuals[i].fitnessPoints) {
            fitnessPoints = individuals[i].fitnessPoints;
            player = individuals[i];
            id = i;
        }
    }
    // console.log(player);
    // console.log(id);
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

export function calcFitness(Individuals, numOfTournaments, debug) {
    let sumFitness = 0;
    console.log(sumPoints[0]);

    for(let i = 0; i < Individuals.length; i++) {
        // let tournaments = numOfTournaments;
        // if(debug) {
        //     tournaments = numOfTournaments + 1;
        // }
        Individuals[i].fitness = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        Individuals[i].fitnessPoints = Individuals[i].sumPoints/(Individuals[i].playedGames * numOfTournaments);
        sumFitness += Individuals[i].fitness;
    }
    for(let i = 0; i < Individuals.length; i++) {
        if(sumFitness !== 0) {
            Individuals[i].fitness = Individuals[i].fitness/sumFitness;
        }
    }
}

function findParent(individuals, tournament_size) {
    let individualsIDs = [];
    for(let j = 0; j < tournament_size; j++) {
        individualsIDs.push(getRandomInt(0, individuals.length));
    }
    let fitness = 0;
    let selectedId = -1;
    for(let j = 0; j < individualsIDs.length; j++) {
        // console.log('fit');
        if(individuals[individualsIDs[j]].fitness > fitness) {
            fitness = individuals[individualsIDs[j]].fitness
            selectedId = individualsIDs[j];
        }
        // console.log('tu');
        // console.log(individuals)
        // console.log(selectedId)
        // console.log(individuals[selectedId].strategy.slice());
        // console.log(selectedId)
    }
    return new Individual([],individuals[selectedId].strategy.slice(), 0);
}

export function evolve(individuals, crossoverProb, mutationProb, tournament_size, elitist, debug) {
    sortIndividuals(individuals);
    let gaInfo = [];
    if(debug) {
        gaInfo.push("\nprint_31\n");
        gaInfo.push("After GA operators");
        gaInfo.push("\ntemp_strategies");
        for(let i = 0; i < individuals.length; i++) {
            gaInfo.push(individuals[i].strategy.slice().join(' '));
        }
        gaInfo.push("\nparent_strategies");
    }
    let parent_strategies = [];
    let parents = [];
    for(let i = 0; i < individuals.length; i++) {
        if(myrng() < crossoverProb || debug) {
            parent_strategies.push(1);
            parents.push(new Individual([],individuals[i].strategy.slice(), individuals[i].fitness));
        }
        else {
            parent_strategies.push(0);
        }
    }
    // console.log('ind', parents.length);
    if(debug) {
        gaInfo.push(parent_strategies.join(' '));
    }

    let childs = [];
    // console.log(individuals[0]);
    let strategyLength = individuals[0].strategy.length;
    while(childs.length < individuals.length) {
        let range = randomRange(strategyLength);
        let firstIndividual = findParent(parents, tournament_size);
        let secondIndividual = findParent(parents, tournament_size);
        if(childs.length === individuals.length - 1){
            childs.push(crossover(firstIndividual, secondIndividual, range));
        }
        else {
            childs.push(crossover(firstIndividual, secondIndividual, range));
            childs.push(crossover(secondIndividual, firstIndividual, range));
        }
    }
    // console.log('child ind', parents.length);
    if(debug) {
        gaInfo.push("\nchild_strategies");
        for(let i = 0; i < childs.length; i++) {
            gaInfo.push(childs[i].strategy.slice().join(' '));
        }
    }
    // let selectedIndividuals = [];
    // let strategyLength = individuals[0].strategy.length;
    // while(selectedIndividuals.length < individuals.length) {
    //     let range = randomRange(strategyLength);
    //     let firstIndividual = poolSelection(individuals, tournament_size);
    //     if((range/strategyLength) <= crossoverProb ) {
    //         let secondIndividual = poolSelection(individuals, tournament_size);
    //         // selectedIndividuals.push(crossover(firstIndividual, secondIndividual, range));
    //         if(selectedIndividuals.length === individuals.length - 1){
    //             selectedIndividuals.push(crossover(firstIndividual, secondIndividual, range));
    //         }
    //         else {
    //             selectedIndividuals.push(crossover(firstIndividual, secondIndividual, range));
    //             selectedIndividuals.push(crossover(secondIndividual, firstIndividual, range));
    //         }
    //     }
    //     else {
    //         selectedIndividuals.push(new Individual(firstIndividual.prehistory.slice(), copyArray(firstIndividual.strategy), firstIndividual.fitness));
    //     }
    // }
    if(elitist) {
        let isElitist = false;
        for(let i = 0; i < childs.length; i++) {
            if(childs.strategy === individuals[0].strategy) {
                isElitist = true;
            }
        }
        if(!isElitist) {
            childs.splice(-1);
            childs.push(new Individual(individuals[0].prehistory.slice(), copyArray(firstIndividual.strategy), individuals[0].fitness));
        }
    }
    individuals = copyArray(childs);
    mutation(individuals, mutationProb);

    if(debug) {
        gaInfo.push("\nstrategies");
        for(let i = 0; i < childs.length; i++) {
            gaInfo.push(childs[i].strategy.slice().join(' '));
        }
    }
    
    generationsData.push(gaInfo.join('\n\n'));

    return individuals;
}

function crossover(firstIndividual, secondIndividual, range) {
    let newStrategy = firstIndividual.strategy.slice(0, range);
    newStrategy = newStrategy.concat(secondIndividual.strategy.slice(range));
    return new Individual(firstIndividual.prehistory.slice(), newStrategy, 0);
}

function mutation(individuals, mutationProb) {
    for(let i = 0; i < individuals.length; i++) {
        for(let j = 0; j < individuals[i].strategy.length; j++) {
            if(myrng() <= mutationProb) {
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
    
    // for(let i = 0; i < individuals.length; i++) {
    //     random -= individuals[i].fitness;
    //     if(random <= 0 && ind.fitness < individuals[i].fitness ) {
    //         // console.log(i);
    //         // console.log(ind.fitness);
    //         // console.log(individuals[i].fitness);
    //         ind = new Individual(individuals[i].prehistory.slice(), individuals[i].strategy.slice(), individuals[i].fitness);
    //     } 
    // }
    let random = myrng();
    for(let i = 0; i < tournament_size; i++) {
        let random2 = myrng();
        if(random < random2) {
            random = random2;
        }
    }
    for(let i = 0; i < individuals.length; i++) {
        random -= individuals[i].fitness;
        if(random <= 0) {
            // console.log(i);
            // console.log(ind.fitness);
            // console.log(individuals[i].fitness);
            ind = new Individual(individuals[i].prehistory.slice(), individuals[i].strategy.slice(), individuals[i].fitness);
        } 
    }

    return new Individual(ind.prehistory, ind.strategy, ind.fitness);
}

function poolSelection2(individuals, tournament_size) {
    let newInd = [];
    for(let i = 0; i < tournament_size; i++) {
        let random = Math.floor(myrng() * individuals.length);
        newInd.push(individuals[random])
    }
    sortIndividuals(newInd);
    return newInd[0];
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