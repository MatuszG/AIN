import React, { useState } from "react";
import "./HomePage.sass";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import Logic from "../logic/Logic";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const HomePage = () => {
  const [popSize, setPopSize] = useState(2);
  const [numOfGenerations, setNumOfGenerations] = useState(1);
  const [tournamentSize, setTournamentSize] = useState(1);
  const [crossoverProb, setCrossoverProb] = useState(0);
  const [mutationProb, setMutationProb] = useState(0);
  const [numOfRuns, setNumOfRuns] = useState(1);
  const [seed, setSeed] = useState(0);
  const [fregGenStart, setFregGenStart] = useState(0);
  const [deltaFreg, setDeltaFreg] = useState(0);
  const [n, setN] = useState(3);
  const [probOfInit, setProbOfInit] = useState(0);
  const [numOfTournaments, setNumOfTournaments] = useState(1);
  const [numOfOpponents, setNumOfOpponents] = useState(1);
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
  const [clockSeed, setClockSeed] = useState(false);
  const [debug, setDebug] = useState(false);
  const [twoPd, setTwoPd] = useState(true);
  const [pd, setPd] = useState(false);

  const data = {
    labels: ["MAY 12", "MAY 13", "MAY 14", "MAY 15", "MAY 16", "MAY 17"],
    datasets: [
      {
        data: [seed, numOfRuns, mutationProb, 8, 7, 5, 6],
        borderColor: "red",
        tension: 0.5,
      },
    ],
  };
  const options = {
    plugins: {
      legend: false,
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
              <input type="checkbox" id="2pPD" checked={twoPd} onChange={() => {
                setTwoPd(!twoPd);
                setPd(twoPd)
              }}/>
              <label htmlFor="2pPD" >2pPD</label>
            </div>
            <div>
              <div className="HomePage-container-PD-checkbox">
                <input type="checkbox" id="PD" checked={pd} onChange={() => {
                setTwoPd(pd);
                setPd(!pd)
              }}/>
                <label htmlFor="PD">PD</label>
              </div>
              <div>
                N{" "}
                <input
                  type="number"
                  className="HomePage-container-PD-input"
                  value={n}
                  onChange={(e) => {
                    if(e.target.value >= 3)setN(e.target.value)}
                  }
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
                  onChange={(e) => setC1(e.target.value)}
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                C D{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c3}
                  onChange={(e) => setC3(e.target.value)}
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d1}
                  onChange={(e) => setD1(e.target.value)}
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                D C{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d2}
                  onChange={(e) => setD2(e.target.value)}
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={c4}
                  onChange={(e) => setC4(e.target.value)}
                />
              </div>
              <div className="HomePage-container-payoff-settings-container">
                D D{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d3}
                  onChange={(e) => setD3(e.target.value)}
                />{" "}
                <input
                  type="number"
                  className="HomePage-container-payoff-settings-input"
                  value={d4}
                  onChange={(e) => setD4(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="HomePage-container-prob">
            <div className="HomePage-container-prob-info">
              <p>prob_of_init_C</p>
              <input
                type="number"
                value={probOfInit}
                onChange={(e) => setProbOfInit(e.target.value)}
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>num_of_tournaments</p>
              <input
                type="number"
                value={numOfTournaments}
                onChange={(e) => setNumOfTournaments(e.target.value)}
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>num of opponents {">"}=</p>
              <input
                type="number"
                value={numOfOpponents}
                onChange={(e) => setNumOfOpponents(e.target.value)}
              />
            </div>
            <div className="HomePage-container-prob-info">
              <p>prehistory L</p>
              <input
                type="number"
                value={prehistoryLength}
                onChange={(e) => setPrehistory(e.target.value)}
              />
            </div>
          </div>
          <div className="HomePage-container-parameters">
            <p className="HomePage-container-parameters-title">CA Parameters</p>
            <div className="HomePage-container-parameters-info">
              <p>pop_size</p>
              <input
                type="number"
                value={popSize}
                onChange={(e) => {
                  if(e.target.value >= 2)setPopSize(e.target.value)}}
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>num_of_generations</p>
              <input
                type="number"
                value={numOfGenerations}
                onChange={(e) => setNumOfGenerations(e.target.value)}
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>tournament_size</p>
              <input
                type="number"
                value={tournamentSize}
                onChange={(e) => setTournamentSize(e.target.value)}
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>crossover_prob</p>
              <input
                type="number"
                value={crossoverProb}
                onChange={(e) => setCrossoverProb(e.target.value)}
              />
            </div>
            <div className="HomePage-container-parameters-info">
              <p>mutation_prob</p>
              <input
                type="number"
                value={mutationProb}
                onChange={(e) => setMutationProb(e.target.value)}
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
            <div className="HomePage-container-start-container">
              <p>num_of_runs</p>
              <input
                type="number"
                value={numOfRuns}
                onChange={(e) => setNumOfRuns(e.target.value)}
              />
            </div>
            <div className="HomePage-container-start-container">
              <div className="HomePage-container-start-container-element">
                <p>seed</p>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="checkbox"
                  id="seed"
                  value={clockSeed}
                  onChange={() => setClockSeed(!clockSeed)}
                />
                <label htmlFor="seed"> clock_seed</label>
              </div>
            </div>
            <div className="HomePage-container-start-container">
              <div className="HomePage-container-start-container-element">
                <p>freg_gen...start</p>
                <input
                  type="number"
                  className="HomePage-container-start-container-text"
                  value={fregGenStart}
                  onChange={(e) => setFregGenStart(e.target.value)}
                />
              </div>
              <div className="HomePage-container-start-container-element">
                <p>delta_freg</p>
                <input
                  type="number"
                  className="HomePage-container-start-container-text"
                  value={deltaFreg}
                  onChange={(e) => setDeltaFreg(e.target.value)}
                />
              </div>
            </div>
            <div className="HomePage-container-start-container-button">
              <div className="HomePage-container-start-container-checkbox">
                <input
                  type="checkbox"
                  id="debug"
                  checked={debug}
                  onChange={() => setDebug(!debug)}
                />
                <label htmlFor="debug"> debug</label>
              </div>
              <button className="HomePage-container-start-container-button-btn" onClick={() => Logic(
                numOfRuns, numOfGenerations, numOfTournaments, numOfOpponents, popSize, prehistoryLength, n, twoPd,
                c1, c2, c3, c4, d1, d2, d3, d4
                )}>
                start
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="Charts">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HomePage;
