import React from 'react';
import classNames from 'classnames';

import classes from './Card.module.css';

export default function Card({ suit, rank, className, style }) {
  const ownStyle = { color: suit.color };
  const resultingStyle = style ? { ...ownStyle, ...style } : ownStyle;

  return (
    <div
      className={classNames(classes.wrapper, className)}
      style={resultingStyle}
    >
      <div className={classes.edgeContainer}>
        <span>{rank.symbol}{suit.symbol}</span>
      </div>
      <div className={classes.centerContainer}>
        &nbsp;
      </div>
      <div className={classes.reversedEdgeContainer}>
        <span>{rank.symbol}{suit.symbol}</span>
      </div>
    </div>
  )
}
