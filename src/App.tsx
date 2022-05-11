import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";
import "animate.css";

import Die from "./components/Die";

interface DieProps {
  value: number;
  isHeld: boolean;
  id: string;
}

interface AppState {
  dice: Array<DieProps>;
  tenzies: boolean;
  play: boolean;
  count: number;
  record: string;
}

export default function App() {
  const [dice, setDice] = useState<AppState["dice"]>(allNewDice() || []);
  const [tenzies, setTenzies] = useState<AppState["tenzies"]>(false);
  const [play, setPlay] = useState<AppState["play"]>(false);
  const [count, setCount] = useState<AppState["count"]>(0);
  const [record, setRecord] = useState<AppState["record"]>(
    JSON.parse(localStorage.getItem("record") || "0"),
  );

  console.log(dice);
  useEffect(() => {
    if (play && !tenzies) {
      const timer = setInterval(() => {
        rollDice();
        setCount((prevCount) => prevCount + 1);
      }, 1500);

      return () => clearInterval(timer);
    } else {
      setPlay(false);
    }
  }, [play, count]);

  useEffect(() => {
    const allDieTrue = dice.every((die) => die.isHeld);
    const dieValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === dieValue);

    if (allDieTrue && allSameValue) {
      localStorage.setItem("record", JSON.stringify(count));
      setTenzies(true);
      setRecord((prevRecord) => {
        if (prevRecord === 0) {
          localStorage.setItem("record", JSON.stringify(count));

          return count;
        } else if (prevRecord < count) {
          localStorage.setItem("record", JSON.stringify(prevRecord));

          return prevRecord;
        } else {
          localStorage.setItem("record", JSON.stringify(count));

          return count;
        }
      });
    }
  }, [dice]);

  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }

    return newDice;
  }
  function generateNewDice() {
    return {value: Math.ceil(Math.random() * 6), id: nanoid(), isHeld: false};
  }

  function rollDice() {
    if (!tenzies) {
      setPlay(true);
      setDice((oldDice) => oldDice.map((dice) => (dice.isHeld ? dice : generateNewDice())));
    } else {
      setTenzies(false);
      setDice(allNewDice());
      setCount(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((dice) => (dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice)),
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      holdDice={() => holdDice(die.id)}
      id={die.id}
      isHeld={die.isHeld}
      value={die.value}
    />
  ));

  return (
    <main className="container">
      {tenzies && <Confetti />}
      {!tenzies && <h1 className="title animate__animated animate__flipInX">TenzieS</h1>}
      {!tenzies && <p className="instructions">When you press Start, match all the numbers.</p>}
      <div className="instructions">Actual Record: {record}</div>
      {tenzies && <p className="winner animate__animated animate__rubberBand">¡YOU WON!</p>}
      {play && (
        <div className="container__grid animate__animated animate__flipInX">{diceElements}</div>
      )}
      {!play && (
        <button
          className="container__button animate__animated animate__backInDown"
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Start"}
        </button>
      )}
      {play && <div className="container__count">Roll {count}</div>}
    </main>
  );
}
