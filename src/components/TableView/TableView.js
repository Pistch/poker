import React from 'react';

import CardList from '../CardList';

export default function TableView(props) {
  return (
    <div>
      <h4>Table:</h4>
      <CardList cards={props.tableCards} />
    </div>
  )
}
