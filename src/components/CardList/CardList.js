import React, { useState } from 'react';
import classNames from 'classnames';
import memoize from 'lodash-es/memoize';

import Card from '../Card';
import classes from './CardList.module.css';

const getCardStyle = memoize(function (isStacked, cardIndex) {
  return isStacked
    ? { transform: `translate3d(${cardIndex}px, ${cardIndex}px, ${cardIndex}px)` }
    : null;
}, (isStacked, cardIndex) => `${isStacked}${cardIndex}`);

export default function CardList({ cards }) {
  const [isStacked, setIsStacked] = useState(false);
  const toggleStacking = () => setIsStacked(!isStacked);

  return (
    <div
      className={classNames(classes.wrapper, {
        [classes.stacked]: isStacked
      })}
      onClick={toggleStacking}
    >
      {cards.map(({ suit, rank }, cardIndex) => (
        <Card
          suit={suit}
          rank={rank}
          key={rank.symbol + suit.symbol}
          className={classes.card}
          style={getCardStyle(isStacked, cardIndex)}
        />
      ))}
    </div>
  );
}
