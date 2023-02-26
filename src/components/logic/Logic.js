import { calcFitness, evolve, findAveragePlayer, findBestPlayer } from "./GALogic";
import { readData, createRandomInputData, getRandomInt, setSeed, setStart, globalPreh, sumPoints } from "./utils";
import { gener_history_freq } from "./utils";

export let points = [];

export default function Logic(
  numOfRuns,
  numOfGenerations,
  numOfTournaments,
  numOfOpponents,
  popSize,
  prehistoryLength,
  strategyFromFile,
  n,
  twoPd,
  c1,
  c2,
  c3,
  c4,
  d1,
  d2,
  d3,
  d4,
  elistStrategy,
  mutationProb,
  crossoverProb,
  tournament_size,
  probOfInit,
  debug,
  clockSeed,
  seed,
  setGenerations,
  setMaxSumPoints,
  setAvgSumPoints
) {
  setSeed(clockSeed, seed);
  let playerNumber = n;
  playerNumber = setStart(twoPd, n, strategyLength);
  const strategyLength = Math.pow(2, playerNumber * prehistoryLength);
  let runs = 0;
  let individuals = createIndividuals(prehistoryLength, playerNumber, strategyFromFile, popSize, debug, strategyLength, probOfInit);
  let strategies = [];
  while (runs++ < numOfRuns) {
    for (let generation = 0; generation <= numOfGenerations; generation++) {
      console.log(`Generation: ${generation}`);
      points = [];
      for (let i = 0; i < individuals.length; i++) {
        points.push([-1]);
      }
      // console.log(points);
      standardGame(
        numOfTournaments,
        individuals,
        playerNumber,
        numOfOpponents,
        c1,
        c2,
        c3,
        c4,
        d1,
        d2,
        d3,
        d4
      );
      calcFitness(individuals, numOfTournaments);
      const bestPlayer = findBestPlayer(individuals);
      const avgPlayer = findAveragePlayer(individuals);
      const max = bestPlayer.fitnessPoints;
      const avg = avgPlayer.fitnessPoints;
      let test = individuals.slice();
      let strategies_some = [];
      for (let i = 0; i < test.length; i++) {
        // console.log(`points ${i}`, test[i].sumPoints);
        // console.log(`strategy ${i}`, test[i].strategy);
        // console.log(`fitnessPoints ${i}`, test[i].fitnessPoints);
        // console.log(`fitness ${i}`, test[i].fitness);
        strategies_some.push(test[i].strategy);
      }
      strategies.push(strategies_some);
      evolve(individuals, crossoverProb, mutationProb, tournament_size, elistStrategy);
      setGenerations((prev) => [...prev, generation]);
      setMaxSumPoints((prev) => [...prev, max]);
      setAvgSumPoints((prev) => [...prev, avg]);
      resetScoresindividuals(individuals);
    }
  }
  console.log(strategies);
}

function standardGame(
  numOfTournaments,
  individuals,
  playerNumber,
  numOfOpponents,
  c1,
  c2,
  c3,
  c4,
  d1,
  d2,
  d3,
  d4
) {
  let playerOutputs = globalPreh.slice();
  let playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  // console.log(individuals)
  sumPoints[0] = 0;
  while(playersIds.length > 0) {
    for (let i = 0; i < numOfTournaments; i++) {
      let playersDecision = [];
      for (let j = 0; j < playersIds.length; j++) {
        playersDecision.push(individuals[playersIds[j]].calculate(j, playerNumber));
      }
      for (let j = playersDecision.length - 1; j >= 0; j--) {
        playerOutputs.unshift(playersDecision[j]);
      }
      playerOutputs.splice(playerOutputs.length - 2, 2);
      let slicedPreh = playerOutputs.slice();
      for(let i = 0; i < globalPreh.length; i++) {
        globalPreh[i] = slicedPreh[i];
      }
      if (playerNumber === 2) {
        if (
          playerOutputs[0] ===
          playerOutputs[1]
        ) {
          if (playerOutputs[1] === 1) {
            individuals[playersIds[0]].points += parseInt(c1);
            individuals[playersIds[1]].points += parseInt(c2);
          } else {
            individuals[playersIds[0]].points += parseInt(d3);
            individuals[playersIds[1]].points += parseInt(d4);
          }
        } else {
          if (playerOutputs[1] === 1) {
            individuals[playersIds[0]].points += parseInt(d1);
            individuals[playersIds[1]].points += parseInt(c3);
          } else {
            individuals[playersIds[0]].points += parseInt(c4);
            individuals[playersIds[1]].points += parseInt(d2);
          }
        }
        points[playersIds[0]].push(individuals[playersIds[0]].points);
        points[playersIds[1]].push(individuals[playersIds[1]].points);
      } else {
        let preh = playerOutputs.slice();
        let cooperators = countCooperators(preh, playersIds.length);
        for (let j = 0; j < playersIds.length; j++) {
          if (preh[j] === 1) {
            individuals[playersIds[j]].points += parseInt(2 * (cooperators - 1));
          } else {
            individuals[playersIds[j]].points += parseInt2(2 * (cooperators - 1) + 1);
          }
        }
      }
      for(let i = 0; i < individuals.length; i++) {
        individuals[i].resetPoints();
      }
    }
    playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  }
}

function findPlayers(individuals, playerNumber, numOfOpponents) {
  let idPlayers = [];
  if(individuals.length < playerNumber) return idPlayers;
  sortIndividuals(individuals);
  for (let i = 0; i < individuals.length; i++) {
    if (individuals[i].playedGames <= numOfOpponents && idPlayers.length < playerNumber) {
      idPlayers.push(i);
      individuals[i].playedGames++;
    }
  }
  while (idPlayers.length < playerNumber && idPlayers.length > 0) {
    let randomId;
    do {
      randomId = getRandomInt(0, individuals.length);
    } while (idPlayers.includes(randomId) && individuals[randomId].playedGames > individuals[0].playedGames);
    idPlayers.push(randomId);
    individuals[randomId].playedGames++;
  }

  return idPlayers;
}

function sortIndividuals(individuals) {
  individuals.sort(function compare(a, b) {
      if(a.playedGames > b.playedGames) {
          return 1;
      }
      else if(a.playedGames < b.playedGames) {
          return -1;
      }
      return 0;
  });
}

function countCooperators(prehistory, playerNumber) {
  let cooperators = 0;
  for (let i = 0; i < playerNumber; i++) {
    if (prehistory[i] === 1) cooperators++;
  }
  return cooperators;
}

function resetScoresindividuals(individuals) {
  for(let i = 0; i < individuals.length; i++) {
    individuals[i].hardReset();
  }
}

function createIndividuals(prehistoryLength, playerNumber, strategyFromFile, popSize, debug, strategyLength, probOfInit) {
  let individuals;
  if ( debug &&
    (playerNumber === 2 && (popSize === 2 || popSize === 3)) 
    // || (playerNumber === 3 && (popSize === 3 || popSize === 4))
  ) {
    individuals = readData(popSize, prehistoryLength, playerNumber, strategyFromFile);
  } else {
    individuals = createRandomInputData(
      popSize,
      prehistoryLength,
      playerNumber,
      strategyLength,
      probOfInit
    );
  }
  return individuals;
}

