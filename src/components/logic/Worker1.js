for (let i = 0; i < numOfTournaments; i++) {
    let playersDecision = [];
    for (let j = 0; j < playersIds.length; j++) {
      playersDecision.push(individuals[playersIds[j]].calculate(j, playerNumber));
      // individuals[playersIds[j]].playedGames++;
    }
    for (let j = 0; j < playersDecision.length; j++) {
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
        if (playerOutputs[playerOutputs.length - 1] === 1) {
          individuals[playersIds[0]].points += c1;
          individuals[playersIds[1]].points += c2;
        } else {
          individuals[playersIds[0]].points += d3;
          individuals[playersIds[1]].points += d4;
        }
      } else {
        if (playerOutputs[0] === 1) {
          individuals[playersIds[0]].points += d1;
          individuals[playersIds[1]].points += c3;
        } else {
          individuals[playersIds[0]].points += c4;
          individuals[playersIds[1]].points += d2;
        }
      }
    } else {
      let preh = playerOutputs.slice();
      let cooperators = countCooperators(preh, playersIds.length);
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