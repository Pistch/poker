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
  const isDraw = Array.isArray(winner);
  const isTotalDraw = isDraw && winner.length === playersResults.length;

  return (
    <div>
      {playersResults.map(({player, combination}) => {
        return (
          <p key={player.name}>
            <PlayerName player={player} /> got <i>{getCombinationName(combination)}</i>
          </p>
        );
      })}
      {isDraw ? (
        <p>
          <b>Draw</b>
          {!isTotalDraw && (
              <span> between {winner.map(player => (
                  <React.Fragment>
                    <PlayerName player={player} key={player.name} />
                    {' '}
                  </React.Fragment>
              ))}</span>
          )}
        </p>
      ) : (
        <p>
          <PlayerName player={winner} /> wins!
        </p>
      )}
    </div>
  )
}
