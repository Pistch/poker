import React from 'react';

import CardList from '../CardList';
import classes from './PlayerView.module.css';

export default function PlayerView(props) {
  return (
    <div className={classes.wrapper}>
      <h3>{props.name}</h3>
      <h4>Money: {props.money}</h4>
      <h4>Hand:</h4>
      <CardList cards={props.cards} className={classes.cardList} />
    </div>
  );
}
