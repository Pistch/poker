import React from 'react';

import CardList from '../CardList';

export default function PlayerView(props) {
  return (
    <div>
      <h4>Player {props.name} hand:</h4>
      <CardList cards={props.cards} />
    </div>
  );
}
