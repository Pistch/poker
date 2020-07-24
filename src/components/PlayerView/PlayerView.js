import React from 'react';

import CardList from '../CardList';

export default function PlayerView(props) {
  return (
    <div>
      <h3>{props.name}</h3>
      <h4>Money: {props.money}</h4>
      <h4>Hand:</h4>
      <CardList cards={props.cards} />
    </div>
  );
}
