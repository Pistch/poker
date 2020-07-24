import React, { useState } from 'react';

import './variables.css';

import Deck from './models/Deck';
import Combination from './models/Combination';
import CardList from './components/CardList';

const mDeck = new Deck();

function getGameSituation() {
  return [
    mDeck.drawFewCards(5),
    mDeck.drawFewCards(2),
    mDeck.drawFewCards(2)
  ];
}

export default function App() {
  const [cardList, setCardList] = useState(getGameSituation());
  const getNewSituation = () => {
    mDeck.fill();
    setCardList(getGameSituation());
  };
  const [table, hand1, hand2] = cardList;
  const c1 = new Combination(hand1, table);
  const c2 = new Combination(hand2, table);
  const best1 = c1.getBest();
  const best2 = c2.getBest();
  const result = Combination.compare(c1, c2);
  const isKickerDecision = best1.name === best2.name && best1.value === best2.value;

  return (
    <div>
      <h4>Hand 1:</h4>
      <CardList cards={hand1} />
      <h4>Hand 2:</h4>
      <CardList cards={hand2} />
      <h4>Table:</h4>
      <CardList cards={table} />
      <p>Player 1 got {best1.name} at {best1.value}{isKickerDecision && ` (kicker ${c1.KICKER()})`}</p>
      <p>Player 2 got {best2.name} at {best2.value}{isKickerDecision && ` (kicker ${c2.KICKER()})`}</p>
      {!result ? (
        <p><b>Draw!</b></p>
      ) : (
        <p>Player {result > 0 ? '1' : '2'} wins!</p>
      )}
      <button onClick={getNewSituation}>Make another</button>
    </div>
  );
}
