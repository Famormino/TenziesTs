import {useEffect, useState} from "react";
import {nanoid} from "nanoid";
import Confetti from "react-confetti";

import Die from "./components/Die";

export default function App() {
  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allDieTrue = dice.every((die) => die.isHeld);
    const dieValue = dice[0].value;
    const allSameValue = dice.map((die) => die.value === dieValue);

    if (allDieTrue && allSameValue) {
      setTenzies(true);
    }
  });

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      if (e.code == "Space") {
        rollDice();
      }
    });
  }, []);

  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDice());
    }

    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) => oldDice.map((dice) => (dice.isHeld ? dice : generateNewDice())));
    } else {
      setDice(allNewDice());
      setTenzies(false);
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
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its current value between
        rolls.
      </p>
      <div className="container__grid">{diceElements}</div>
      <button className="container__button" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
