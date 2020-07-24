import React from 'react';
import upperFirst from 'lodash-es/upperFirst';

function getCombinationName(combination) {
  return `${
    combination.name.toLowerCase().replace('_', ' ')
  } of ${combination.value}`;
}

function PlayerName({ player }) {
  return <b>{upperFirst(player.name)}</b>;
}

export default function ResultView(props) {
  if (!props.result) {
    return null;
  }

  const { playersResults, winner } = props.result;

  return (
    <div>
      {playersResults.map(({player, combination}) => {
        return (
          <p key={player.name}>
            <PlayerName player={player} /> got <i>{getCombinationName(combination)}</i>
          </p>
        );
      })}
      {!winner ? (
        <p><b>Draw!</b></p>
      ) : (
        <p>
          <PlayerName player={winner} /> wins!
        </p>
      )}
    </div>
  )
}
