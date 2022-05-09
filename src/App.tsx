import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";
import "animate.css";

import Die from "./components/Die";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [play, setPlay] = useState(false);
  const [count, setCount] = useState(0);
  const [record, setRecord] = useState(JSON.parse(localStorage.getItem("record") || 0));

  useEffect(() => {
    if (play && !tenzies) {
      const timer = setInterval(() => {
        rollDice();
        setCount(count + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setPlay(false);
    }
  }, [dice, count, play, rollDice, tenzies]);

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

  function generateNewDice() {
    return {value: Math.ceil(Math.random() * 6), id: nanoid(), isHeld: false};
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
      {tenzies && <p className="winner animate__animated animate__zoomIn">¡YOU WON!</p>}
      {play && (
        <div className="container__grid animate__animated animate__flipInX">{diceElements}</div>
      )}
      {!play && (
        <button
          className="container__button animate__animated animate__bounceIn"
          onClick={rollDice}
        >
          {tenzies ? "New Game" : "Start"}
        </button>
      )}
      {play && <div className="container__count">Roll {count}</div>}
    </main>
  );
}
