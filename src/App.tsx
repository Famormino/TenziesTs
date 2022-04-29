import {useState} from "react";
import {nanoid} from "nanoid";

import Die from "./components/Die";

export default function App() {
  const [dice, setDice] = useState(allNewDice());

  function allNewDice() {
    const newDice = [];

    for (let i = 0; i < 10; i++) {
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        id: nanoid(),
        isHeld: false,
      });
    }

    return newDice;
  }

  return (
    <main className="container">
      <h1>Tenzie Game</h1>
      <div className="container__grid">
        {dice.map((die) => (
          <Die key={die.id} number={die.value} />
        ))}
      </div>
      <button className="container__button">Roll</button>
    </main>
  );
}
