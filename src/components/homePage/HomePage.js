import React, { useState, useEffect } from "react";
import "./HomePage.sass";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Legend,
} from "chart.js";
import Strategies from "../../../Strategies.txt";

import Logic from "../logic/Logic";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Legend
);

const HomePage = () => {
  const [popSize, setPopSize] = useState(100);
  const [numOfGenerations, setNumOfGenerations] = useState(200);
  const [tournamentSize, setTournamentSize] = useState(3);
  const [crossoverProb, setCrossoverProb] = useState(0.9);
  const [mutationProb, setMutationProb] = useState(0.003);
  const [numOfRuns, setNumOfRuns] = useState(1);
  const [seed, setSeed] = useState(0);
  const [fregGenStart, setFregGenStart] = useState(30);
  const [deltaFreg, setDeltaFreg] = useState(10);
  const [n, setN] = useState(4);
  const [probOfInit, setProbOfInit] = useState(0.5);
  const [numOfTournaments, setNumOfTournaments] = useState(151);
  const [numOfOpponents, setNumOfOpponents] = useState(10);
  const [prehistoryLength, setPrehistory] = useState(3);
  const [c1, setC1] = useState(30);
  const [c2, setC2] = useState(30);
  const [c3, setC3] = useState(0);
  const [c4, setC4] = useState(0);
  const [d1, setD1] = useState(50);
  const [d2, setD2] = useState(50);
  const [d3, setD3] = useState(10);
  const [d4, setD4] = useState(10);
  const [elistStrategy, setElistStrategy] = useState(false);
  const [clockSeed, setClockSeed] = useState(true);
  const [debug, setDebug] = useState(false);
  const [twoPd, setTwoPd] = useState(true);
  const [pd, setPd] = useState(false);
  const [generations, setGenerations] = useState([]);
  const [sumMaxPoints, setMaxSumPoints] = useState([]);
  const [sumAvgPoints, setAvgSumPoints] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [strategiesId, setStrategiesId] = useState([]);
  const [strategyLength, setStrategyLength] = useState(2);
  const [strategyFromFile, setStrategyFromFile] = useState();

  const exportInfo = () => {
    const fileData = JSON.stringify("test");
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "info.txt";
    link.href = url;
    link.click();
    link.parentNode.removeChild(link);
  };
  const array = [];
  for (let i = 0; i < 10; i++) {
    array[i] = [];
    for (let j = 0; j < 128; j++) {
      array[i][j] = null;
    }
  }

  useEffect(async () => {
    if (!debug) {
      setPopSize(100);
      setPrehistory(3);
      setNumOfTournaments(151);
      setNumOfOpponents(10);
      setStrategyLength(2);
      setStrategyFromFile(array);
    } else {
      let textDebug = await fetch(Strategies).then((r) => r.text());
      let index;
      setTwoPd(true);
      setPd(false);
      index = textDebug.search("pop_size");
      if (index !== -1)
        setPopSize(
          Number(textDebug.slice(index + 9, textDebug.indexOf(";", index + 9)))
        );
      index = textDebug.search("l_preh");
      if (index !== -1)
        setPrehistory(
          Number(textDebug.slice(index + 7, textDebug.indexOf(";", index + 7)))
        );
      index = textDebug.search("length_of_strategy");
      if (index !== -1)
        setStrategyLength(
          Number(
            textDebug.slice(index + 19, textDebug.indexOf(";", index + 19))
          )
        );
      index = textDebug.search("num_of_tournaments");
      if (index !== -1)
        setNumOfTournaments(
          Number(
            textDebug.slice(index + 19, textDebug.indexOf(";", index + 19))
          )
        );
      index = textDebug.indexOf("\n");
      if (index !== -1) {
        let pom1 = 0;
        let pom2 = 0;
        for (let i = index + 1; i < textDebug.length; i++) {
          if (textDebug[i] === "\n") {
            pom1++;
            pom2 = 0;
            continue;
          }
          if (textDebug[i] === " " || textDebug[i] === "\r") continue;
          let copy = [...strategyFromFile];
          copy[pom1][pom2] = Number(textDebug[i]);
          setStrategyFromFile(copy);
          pom2++;
        }
      }
    }
  }, [debug]);

  // console.log(strategyFromFile);

  const data = {
    labels: generations,
    datasets: [
      {
        data: sumMaxPoints,
        borderColor: "red",
        label: "Best fit",
        tension: 0.1,
      },
      {
        data: sumAvgPoints,
        label: "Avg fit",
        borderColor: "blue",
        tension: 0.1,
      },
    ],
  };
  const colors = [
    "green",
    "purple",
    "yellow",
    "grey",
    "white",
    "olive",
    "black",
    "gold",
    "lime",
    "cyan",
    "pink",
    "brown",
    "indigo",
  ];
  const datasets = [];
  useEffect(async () => {
    while (colors.length < strategies.length) {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    colors.push(randomColor);
  }},[]);

  for (let i = 0; i < strategies.length; i++) {
    let nr = parseInt(fregGenStart) + parseInt(deltaFreg) * i;
    datasets[i] = {
      data: strategies[i],
      borderColor: colors[i],
      label: `gen ${nr}`,
      tension: 0.1,
    };
  }

  const strategyData = {
    labels: strategiesId,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "average total payoff (ATP)",
        font: {
          size: 25,
        },
        color: "white",
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "frequencies of applied strategies",
        font: {
          size: 25,
        },
        color: "white",
      }
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <div className="App">
      <div className="HomePage">
        <p className="HomePage-title">PD Game Parameters</p>
        <div className="HomePage-container">
          <div className="HomePage-container-PD">
            <div className="HomePage-container-PD-checkbox">
              <input
                type="checkbox"
                id="2pPD"
                checked={twoPd}
                onChange={() => {
                  setTwoPd(!twoPd);
                  setPd(twoPd);
                }}
              />
              <label className="dwa" htmlFor="2pPD">2pPD</label>
            </div>
            <div>
              <div className="HomePage-container-PD-checkbox">
                <input
                  type="checkbox"
                  id="PD"
                  checked={pd}
                  onChange={() => {
                    setTwoPd(pd);
                    setPd(!pd);
                  }}
                />
                <label className="dwa" htmlFor="PD">PD</label>
              </div>
              <div>
                N{" "}
                <input
                  type="number"
                  className="HomePage-container-PD-input"
                  value={n}
                  onChange={(e) => {
                    if (e.target.value >= 3) setN(e.target.value);
                  }}
                  disabled={twoPd}
                />
              </div>
            </div>
          </div>
          <div className="HomePage-container-payoff">
            <p className="HomePage-container-payoff-title">
              2pPD payoff function
            </p>
            <div className="HomePage-container-payoff-settings">
              <div className="HomePage-container-payoff-settings-container">
                C C{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c1}
                  onChange={(e) =>
                    e.target.value >= 0 ? setC1(e.target.value) : undefined
                  }
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c2}
                  onChange={(e) =>
                    e.target.value >= 0 ? setC2(e.target.value) : undefined
                  }
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                C D{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c3}
                  onChange={(e) =>
                    e.target.value >= 0 ? setC3(e.target.value) : undefined
                  }
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d1}
                  onChange={(e) =>
                    e.target.value >= 0 ? setD1(e.target.value) : undefined
                  }
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                D C{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d2}
                  onChange={(e) =>
                    e.target.value >= 0 ? setD2(e.target.value) : undefined
                  }
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c4}
                  onChange={(e) =>
                    e.target.value >= 0 ? setC4(e.target.value) : undefined
                  }
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                D D{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d3}
                  onChange={(e) =>
                    e.target.value >= 0 ? setD3(e.target.value) : undefined
                  }
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d4}
                  onChange={(e) =>
                    e.target.value >= 0 ? setD4(e.target.value) : undefined
                  }
                />
              </div>
            </div>
          </div>
          <div className="HomePage-container-prob">
            <div className="HomePage-container-prob-info">
              <p>prob_of_init_C</p>
              <input
                className="input"
                type="number"
                step="0.01"
                value={probOfInit}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setProbOfInit(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>num_of_tournaments</p>
              <input
                className="input"
                type="number"
                value={numOfTournaments}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setNumOfTournaments(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>num of opponents {">"}=</p>
              <input
                className="input"
                type="number"
                value={numOfOpponents}
                onChange={(e) =>
                  e.target.value >= 1
                    ? setNumOfOpponents(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>prehistory L</p>
              <input
                className="input"
                type="number"
                value={prehistoryLength}
                onChange={(e) =>
                  e.target.value >= 1
                    ? setPrehistory(e.target.value)
                    : undefined
                }
              />
            </div>
          </div>
          <div className="HomePage-container-parameters">
            <p className="HomePage-container-parameters-title">GA Parameters</p>
            <div className="HomePage-container-parameters-info">
              <p>pop_size</p>
              <input
                className="input"
                type="number"
                value={popSize}
                onChange={(e) =>
                  e.target.value >= 2 ? setPopSize(e.target.value) : undefined
                }
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>num_of_generations</p>
              <input
                className="input"
                type="number"
                value={numOfGenerations}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setNumOfGenerations(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>tournament_size</p>
              <input
                className="input"
                type="number"
                value={tournamentSize}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setTournamentSize(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>crossover_prob</p>
              <input
                className="input"
                type="number"
                step="0.01"
                value={crossoverProb}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setCrossoverProb(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>mutation_prob</p>
              <input
                className="input"
                type="number"
                step="0.001"
                value={mutationProb}
                onChange={(e) =>
                  e.target.value >= 0
                    ? setMutationProb(e.target.value)
                    : undefined
                }
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <div className="HomePage-container-parameters-info-checkbox">
                <input
                  type="checkbox"
                  id="elist"
                  checked={elistStrategy}
                  onChange={() => setElistStrategy(!elistStrategy)}
                />
                <label htmlFor="elist">elist_strategy</label>
              </div>
            </div>
          </div>
          <div className="HomePage-container-start">
            <div>
              <div className="HomePage-container-start-container">
                <div className="HomePage-container-start-container-element">
                  <p>num_of_runs</p>
                  <input
                    type="number"
                    className="HomePage-container-start-container-text"
                    value={numOfRuns}
                    onChange={(e) =>
                      e.target.value >= 0
                        ? setNumOfRuns(e.target.value)
                        : undefined
                    }
                  />
                </div>
              </div>
              <div className="HomePage-container-start-container">
                <div className="HomePage-container-start-container-element">
                  <p>seed</p>
                  <input
                    type="number"
                    className="HomePage-container-start-container-text"
                    value={seed}
                    onChange={(e) =>
                      e.target.value >= 0 ? setSeed(e.target.value) : undefined
                    }
                  />
                </div>
              </div>
              <div className="HomePage-container-start-container">
                <div className="HomePage-container-start-container-element">
                  <p>freq_gen_start</p>
                  <input
                    type="number"
                    className="HomePage-container-start-container-text"
                    value={fregGenStart}
                    onChange={(e) =>
                      e.target.value >= 0
                        ? setFregGenStart(e.target.value)
                        : undefined
                    }
                  />
                </div>
              </div>
              <div className="HomePage-container-start-container-checkbox">
                  <input
                    type="checkbox"
                    id="debug"
                    checked={debug}
                    onChange={() => setDebug(!debug)}
                  />
                  <label htmlFor="debug"> debug</label>
                </div>
            </div>
            <div className="masz">
              <div className="HomePage-container-start-container-button">
                <div>
                <label htmlFor="seed"> clock_seed </label>
                <input
                  type="checkbox"
                  id="seed"
                  value={clockSeed}
                  onChange={() => setClockSeed(!clockSeed)}
                />
              </div>
              <div className="HomePage-container-start-container">
                <div className="HomePage-container-start-container-element">
                  <p>delta_freq</p>
                  <input
                    type="number"
                    className="HomePage-container-start-container-text"
                    value={deltaFreg}
                    onChange={(e) =>
                      e.target.value >= 0
                        ? setDeltaFreg(e.target.value)
                        : undefined
                    }
                  />
                </div>
              </div>
                <button
                  className="HomePage-container-start-container-button-btn"
                  onClick={() => {
                    setMaxSumPoints([]);
                    setAvgSumPoints([]);
                    setGenerations([]);
                    setStrategies([]);
                    setStrategiesId([]);
                    Logic(
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
                      tournamentSize,
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
                    );
                  }}
                >
                  start
                </button>
              </div>
              {/* <div className="HomePage-container-start-container-file">
                <button
                  onClick={exportInfo}
                  className="HomePage-container-start-container-file-button"
                >
                  Pobierz
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="Charts">
        <div className="Chart">
          <Line data={data} options={options} />
        </div>
        <div className="Chart">
          <Line data={strategyData} options={options2} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
