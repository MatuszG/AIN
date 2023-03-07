import { calcFitness, evolve, findAveragePlayer, findBestPlayer } from "./GALogic";
import { readData, createRandomInputData, getRandomInt, setSeed, setPlayers, globalPreh, sumPoints, setFreq, calcFreq, copyArray, getPrehistory, getDebugPrehistory } from "./utils";
import { gener_history_freq, resetFreq } from "./utils";
import request from "./requests";
export let points = [];
export let generationsData = [];
export let data = [];

export let mainInfo = [];
export let debugData = [];

function sendData(data) {
  request.post("/", {data})
        .then(res=>{
        });
}

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
  fregGenStart,
  deltaFreg,
  setGenerations,
  setMaxSumPoints,
  setAvgSumPoints,
  setStrategies,
  setStrategiesId
) {
  data = [];
 
  setSeed(clockSeed, seed);
  let playerNumber = n;
  playerNumber = setPlayers(twoPd, n);
  const strategyLength = Math.pow(2, playerNumber * parseInt(prehistoryLength));
  setFreq(strategyLength);

  let strategiesId;
  let generalHistory;
  let generationsToPrintPlot = [];
  for(let i = 0; i < numOfGenerations; i++) {
    let generationToPrint = parseInt(fregGenStart) + i * parseInt(deltaFreg);
    generationsToPrintPlot.push(generationToPrint);
  }

  let runs = 0;
  let individuals = createIndividuals(prehistoryLength, playerNumber, strategyFromFile, popSize, debug, strategyLength, probOfInit);

  mainInfo = [];
  if(debug) {
    mainInfo.push("print_11\n");
    mainInfo.push("Strategies");
    for(let i = 0; i < individuals.length; i++) {
      mainInfo.push(individuals[i].strategy.slice().join(' '));
    }
    mainInfo.push("\nPrehistory");
    mainInfo.push(globalPreh.slice().join(' '));
    mainInfo.push('');
  }

  while (runs++ < numOfRuns) {
    strategiesId = [...Array(strategyLength).keys()];
    generalHistory = [];
    for (let generation = 0; generation <= numOfGenerations; generation++) {
      console.log(`Generation: ${generation}`);
      // debugData.push(generation)
      standardGame(
        parseInt(numOfTournaments),
        individuals,
        playerNumber,
        parseInt(numOfOpponents),
        c1,
        c2,
        c3,
        c4,
        d1,
        d2,
        d3,
        d4,
        debug
      );
      calcFitness(individuals, parseInt(numOfTournaments), debug);
      const bestPlayer = findBestPlayer(individuals);
      const avgPlayer = findAveragePlayer(individuals);
      const max = bestPlayer.fitnessPoints;
      const avg = avgPlayer.fitnessPoints;
      setGenerations((prev) => [...prev, generation]);
      setMaxSumPoints((prev) => [...prev, max]);
      setAvgSumPoints((prev) => [...prev, avg]);
      individuals = evolve(individuals, parseFloat(crossoverProb), parseFloat(mutationProb), parseInt(tournament_size), elistStrategy, debug);
      resetScoresindividuals(individuals);
      if(generationsToPrintPlot.includes(generation)) {
        generalHistory.push(calcFreq(gener_history_freq));
        resetFreq(strategyLength);
      }
      debugData.push(mainInfo.join('\n'));
      debugData.push(generationsData);
      mainInfo = [];
      generationsData = [];
    }
  }
  setStrategiesId(strategiesId);
  setStrategies(generalHistory);
  if(debug) {
    data.push({
        filename: "debug.txt",
        flag: 'w',
        data: debugData.join('\n')
    });

  }
  if(data !== null) {
    sendData(data);
    debugData = [];
    data = [];
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
  d4,
  debug
) {
  let playerOutputs = globalPreh.slice();
  let playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  sumPoints[0] = 0;
  while(playersIds.length > 0) {
    if(debug) {
      // console.log(playersIds.slice());
      mainInfo.push("\nprint_12");
      mainInfo.push("\nP1_strat");
      mainInfo.push(individuals[playersIds[0]].strategy.slice().join(' '));
      mainInfo.push("P2_strat");
      mainInfo.push(individuals[playersIds[1]].strategy.slice().join(' '));
      mainInfo.push('');
      let temp_gener_his = gener_history_freq.slice();
      for (let j = 0; j < playersIds.length; j++) {
        temp_gener_his[individuals[playersIds[j]].calculate(j, playerNumber, 0)]++;
      }
  
      mainInfo.push('\nprint_13');
      mainInfo.push('\nc_of_opponents');
      let c_of_opp = [];
      for(let i = 0; i < individuals.length; i++) {
        c_of_opp.push(individuals[i].playedGames);
      }
      mainInfo.push(c_of_opp.join(' '));
      mainInfo.push('\ngener_history_freq');
      
      mainInfo.push(temp_gener_his.slice().join(' '));
      // for(let i = 0; i < gener_history_freq; i++) {
      //   gener_history_freq[i] = 0;
      // }
    }
    for (let i = 0; i < numOfTournaments; i++) {
      if(debug) {
        mainInfo.push('\nprint_14');
        mainInfo.push('Tournament - 2 players');
        mainInfo.push(`Gra = ${i+1}`);
      }
      let playersDecision = [];
      for (let j = 0; j < playersIds.length; j++) {
        playersDecision.push(individuals[playersIds[j]].calculate(j, playerNumber, 1));
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
        if(debug) {
          for(let i = 0; i < playersIds.length; i++) {
            mainInfo.push(`payoff_P${i} = ${individuals[playersIds[i]].points}`);
          }
        }
      } else {
        let preh = playerOutputs.slice();
        let cooperators = countCooperators(preh, playersIds.length);
        for (let j = 0; j < playersIds.length; j++) {
          if (preh[j] === 1) {
            let points =  2 * (cooperators - 1);
            if(points > 0)
            individuals[playersIds[j]].points += 2 * (cooperators - 1);
          } else {
            let points =  2 * (cooperators - 1) + 1;
            if(points > 0)
            individuals[playersIds[j]].points += 2 * (cooperators - 1) + 1;
          }
        }
      }
      
      if(debug) {
        mainInfo.push('SUM_with_opponents');
      }
      let sumPoints = [];
      for(let i = 0; i < individuals.length; i++) {
        individuals[i].resetPoints();
        if(debug) {
          sumPoints.push(individuals[i].sumPoints);
        }
      }
      if(debug) {
        mainInfo.push(sumPoints.slice().join(' '));
        mainInfo.push('Prehistory');
        mainInfo.push(globalPreh.slice().join(' '));
        for(let i = 0; i < playerNumber; i++) {
          mainInfo.push(`P${i}_preh`);
          let playerPreh = getDebugPrehistory(getPrehistory(i, playerNumber)).slice().join(' ');
          mainInfo.push(playerPreh);
        }

        
        if(i != numOfTournaments - 1) {
          let temp_gener_his = gener_history_freq.slice();
          for (let j = 0; j < playersIds.length; j++) {
            temp_gener_his[individuals[playersIds[j]].calculate(j, playerNumber, 0)]++;
          }
          mainInfo.push('\ngener_history_freq\n');
          mainInfo.push(temp_gener_his.slice().join(' '));
        }
        else {
          let playersDecision = [];
          // for (let j = 0; j < playersIds.length; j++) {
          //   individuals[playersIds[j]].calculate(j, playerNumber, 3)
          // }
          for (let j = 0; j < playersIds.length; j++) {
            playersDecision.push(individuals[playersIds[j]].calculate(j, playerNumber, 2));
          }
          for (let j = playersDecision.length - 1; j >= 0; j--) {
            playerOutputs.unshift(playersDecision[j]);
          }
          playerOutputs.splice(playerOutputs.length - 2, 2);
          let slicedPreh = playerOutputs.slice();
          for(let i = 0; i < globalPreh.length; i++) {
            globalPreh[i] = slicedPreh[i];
          }
          // mainInfo.push('global preh');
          // mainInfo.push(globalPreh.slice().join(' '));
          // for(let i = 0; i < playerNumber; i++) {
          //   mainInfo.push(`P${i}_preh`);
          //   let playerPreh = getDebugPrehistory(getPrehistory(i, playerNumber)).slice().join(' ');
          //   mainInfo.push(playerPreh);
          // }
          mainInfo.push('\ngener_history_freq\n');
          mainInfo.push(gener_history_freq.slice().join(' '));
        }
          
        }
    }
    playersIds = findPlayers(individuals, playerNumber, numOfOpponents);
  }
}

function findPlayers(individuals, playerNumber, numOfOpponents) {
  let idPlayers = [];
  if(individuals.length < playerNumber) return idPlayers;
  let bestIndividualID = -1;
  let bestPlayedGames = 999;
  for (let i = 0; i < individuals.length; i++) {
    if (individuals[i].playedGames < numOfOpponents && idPlayers.length < playerNumber) {
      if(individuals[i].playedGames < bestPlayedGames) {
        bestPlayedGames = individuals[i].playedGames;
        bestIndividualID = i;
      }
    }
  }
  if(bestIndividualID !== -1) {
    idPlayers.push(bestIndividualID)
    individuals[bestIndividualID].playedGames++;
  }
  while (idPlayers.length < playerNumber && idPlayers.length > 0) {
    let randomId;
    do {
      randomId = getRandomInt(0, individuals.length);
    } while (idPlayers.includes(randomId));
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
  if (debug && playerNumber == 2 && (popSize == 2 || popSize == 3)
  ) {
    individuals = readData(popSize, prehistoryLength, playerNumber, strategyFromFile, debug);
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

