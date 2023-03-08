import { calcFitness, evolve, findAveragePlayer, findBestPlayer } from "./GALogic";
import { readData, createRandomInputData, getRandomInt, setSeed, setPlayers, globalPreh, sumPoints, setFreq, calcFreq, copyArray, getPrehistory, getDebugPrehistory, setGeneralFreq, history_freq } from "./utils";
import { gener_history_freq, resetFreq } from "./utils";
import request from "./requests";
export let points = [];
export let generationsData = [];
export let data = [];

export let mainInfo = [];
export let debugData = [];

let result1 = [];
let result2 = [];
let results2 = [];
let result3 = [];
let mResults1 = [];

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
  setGeneralFreq(strategyLength);

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
  result1 = [];
  result2 = [];
  result3 = [];
  if(numOfRuns == 1) {
    result1.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
    result1.push(`# frequency of game histories`);
    result1.push(`# gen best_fit avg_fit`);
    result2.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
    result2.push(`# gen ${[...Array(strategyLength).keys()].join(' ')}`);
    result3.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
    result3.push('# best strategy');
    result3.push(`# gen ${[...Array(strategyLength).keys()].join(' ')}`);
  }
  let sums = []
  let maxs = [];
  let std_dev = [];
  for(let i = 0; i <= numOfGenerations; i++) {
    sums.push(0);
    std_dev.push(0);
    maxs.push([]);
  }

  while (runs++ < numOfRuns) {
    strategiesId = [...Array(strategyLength).keys()];
    generalHistory = [];
    if(numOfRuns > 1) {
      if(runs > 1) {
        mResults1.push('');
      }
      mResults1.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
      mResults1.push(`# Run: ${runs}`);
      mResults1.push(`# gen best_fit avg_fit`);
    }
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
      let row = [];
      row.push(generation);
      row.push(max);
      row.push(avg);
      if(numOfRuns == 1) {
        result1.push(row.join(' '));
        result2.push([generation, calcFreq(history_freq).join(' ')].join(' '));
        result3.push([generation, bestPlayer.strategy.slice().join(' ')].join(' '));
      }
      else {
        sums[generation] += avg;
        maxs[generation].push(max);
        mResults1.push(row.join(' '));
      }
      setGenerations((prev) => [...prev, generation]);
      setMaxSumPoints((prev) => [...prev, max]);
      setAvgSumPoints((prev) => [...prev, avg]);
      individuals = evolve(individuals, parseFloat(crossoverProb), parseFloat(mutationProb), parseInt(tournament_size), elistStrategy, debug);
      resetScoresindividuals(individuals);
      if(generationsToPrintPlot.includes(generation)) {
        generalHistory.push(calcFreq(history_freq));
        if(numOfRuns == 1) {
          let results2 = [];
          let results2Plot = [];
          results2.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
          results2.push(`# frequency of game histories`);
          results2.push(`# generation: ${generation}`);
          results2.push(`# history freq_of_game_histories`);
          for(let i = 0; i < calcFreq(history_freq).length; i++) {
            results2.push([i, calcFreq(history_freq)[i]].join(' '));
          }
          data.push({
            filename: `./Results/result_2_gen_${generation}.txt`,
            flag: 'w',
            data: results2.join('\n')
          });

          results2Plot.push("set style data lines");
          results2Plot.push("set xlabel \"History\"");
          results2Plot.push("set ylabel \"Frequency of game histories\"");
          results2Plot.push(`plot 'result_2_gen_${generation}.txt' using 1:2 with lines lc 3 lw 3  title "Frequency of game histories"`);
          data.push({
            filename: `./Results/result_2_gen_${generation}.plt`,
            flag: 'w',
            data: results2Plot.join('\n')
          });
          sendData(data);
          data = [];
        }
      }
      resetFreq(strategyLength);
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
        filename: "./Results/debug.txt",
        flag: 'w',
        data: debugData.join('\n')
    });
  }

  if(mResults1.length > 0) {
    let std_result_1 = [];
    std_result_1.push(`# seed: ${seed} playerNumbers: ${playerNumber} popSize: ${popSize} strategyLength: ${strategyLength}`);
    std_result_1.push(`# gen avg_best std_best`);
    for(let i = 0; i <= numOfGenerations; i++) {
      sums[i] = sums[i]/numOfRuns;
      std_dev[i] = Math.sqrt(maxs[i].reduce((acc, val) => acc + (val - sums[i]) ** 2, 0) / numOfRuns);
      std_result_1.push([i,sums[i],std_dev[i]].join(' '));
    }

    // for()
    data.push({
      filename: "./Results/m_result_1.txt",
      flag: 'w',
      data: mResults1.join('\n')
    });
    data.push({
      filename: "./Results/std_result_1.txt",
      flag: 'w',
      data: std_result_1.join('\n')
    });
  }

  if(result1.length > 0) {
    data.push({
      filename: "./Results/result_1.txt",
      flag: 'w',
      data: result1.join('\n')
    });
  }

  if(result2.length > 0) {
    data.push({
      filename: "./Results/result_2.txt",
      flag: 'w',
      data: result2.join('\n')
    });
  }

  if(result3.length > 0) {
    data.push({
      filename: "./Results/result_3.txt",
      flag: 'w',
      data: result3.join('\n')
    });
  }

  if(data.length > 0) {
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

