import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";
import "animate.css";

import Die from "./components/Die";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [play, setPlay] = useState(false);

  console.log(play);

  useEffect(() => {
    if (play && !tenzies) {
      const timer = setInterval(() => {
        rollDice();
        console.log("agggg");
      }, 1500);

      return () => clearInterval(timer);
    } else {
      setPlay(false);
    }
  }, [dice]);

  useEffect(() => {
    const allDieTrue = dice.every((die) => die.isHeld);
    const dieValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === dieValue);

    if (allDieTrue && allSameValue) {
      setTenzies(true);
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
      {!tenzies && (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its current value between
          rolls.
        </p>
      )}
      {tenzies && <p className="winner animate__animated animate__zoomIn">¡YOU WON!</p>}
      {play && (
        <div className="container__grid animate__animated animate__flipInX">{diceElements}</div>
      )}
      {!play && (
        <button className="container__button" onClick={rollDice}>
          {tenzies ? "New Game" : "Start"}
        </button>
      )}
    </main>
  );
}
