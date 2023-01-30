import { calcFitness, evolve, findAveragePlayer, findBestPlayer } from "./GALogic";
import { readData, createRandomInputData, getRandomInt, setSeed, setStart } from "./utils";
import { gener_history_freq } from "./utils";

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
  const strategyLength = Math.pow(2, playerNumber * prehistoryLength);
  playerNumber = setStart(twoPd, n, strategyLength);
  let runs = 0;
  let individuals = createIndividuals(prehistoryLength, playerNumber, strategyFromFile, popSize, debug, strategyLength, probOfInit);
  while (runs++ < numOfRuns) {
    for (let generation = 0; generation <= numOfGenerations; generation++) {
      // console.log(`Generation: ${generation}`);
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
      evolve(individuals, crossoverProb, mutationProb, tournament_size, elistStrategy);
      setGenerations((prev) => [...prev, generation]);
      setMaxSumPoints((prev) => [...prev, max]);
      setAvgSumPoints((prev) => [...prev, avg]);
      resetScoresindividuals(individuals);
    }
  }
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
  let prehistory = individuals[0].prehistory;
  let playerOutputs = prehistory;
  let playersIds;
  playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  for (let j = 0; j < playersIds.length; j++) {
    individuals[playersIds[j]].reset();
  }
  while (playersIds.length > 0) {
    for (let i = 0; i <= numOfTournaments; i++) {
      let playersDecision = [];
      for (let j = 0; j < playersIds.length; j++) {
        playersDecision.push(individuals[playersIds[j]].calculate());
        individuals[playersIds[j]].playedGames++;
      }
      for (let j = 0; j < playersDecision.length; j++) {
        playerOutputs.push(playersDecision[j]);
      }
      playerOutputs.splice(0, playerNumber);
      if (playerNumber === 2) {
        if (
          playerOutputs[prehistory.length - 1] ===
          playerOutputs[prehistory.length - 2]
        ) {
          if (playerOutputs[prehistory.length - 1] === 1) {
            individuals[playersIds[0]].points += c1;
            individuals[playersIds[1]].points += c2;
          } else {
            individuals[playersIds[0]].points += d3;
            individuals[playersIds[1]].points += d4;
          }
        } else {
          if (playerOutputs[prehistory.length - 1] === 1) {
            individuals[playersIds[0]].points += d1;
            individuals[playersIds[1]].points += c3;
          } else {
            individuals[playersIds[0]].points += c4;
            individuals[playersIds[1]].points += d2;
          }
        }
      } else {
        let preh = playerOutputs.slice().reverse();
        let cooperators = countCooperators(preh);
        for (let j = 0; j < playersIds.length; j++) {
          if (preh[j] === 1) {
            individuals[playersIds[j]].points += 2 * (cooperators - 1);
          } else {
            individuals[playersIds[j]].points += 2 * (cooperators - 1) + 1;
          }
        }
      }
      individuals.forEach((element) => {
        element.resetPoints();
      });
    }
    playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  }
  individuals.forEach((element) => {
    element.reset();
  });
}

function findPlayers(individuals, playerNumber, numOfOpponents) {
  let idPlayers = [];
  for (let i = 0; i < individuals.length; i++) {
    if (individuals[i].playedGames <= numOfOpponents) {
      idPlayers.push(i);
      for (let j = 0; j < playerNumber - 1; j++) {
        let randomId;
        do {
          randomId = getRandomInt(0, individuals.length);
        } while (randomId === i);
        idPlayers.push(randomId);
      }
      return idPlayers;
    }
  }
  return idPlayers;
}

function countCooperators(prehistory) {
  let cooperators = 0;
  for (let i = 0; i < prehistory.length; i++) {
    if (prehistory[i] === 1) cooperators++;
  }
  return cooperators;
}

function resetScoresindividuals(Individuals) {
  Individuals.forEach((element) => {
    element.hardReset();
  });
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

