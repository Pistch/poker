import React from 'react';

export default function ResultView(props) {
  if (!props.result) {
    return null;
  }

  const { playersResults, winner } = props.result;

  return (
    <div>
      {playersResults.map(({player, combination}) => {
        return (
          <p key={player.name}>Player {player.name} got {combination.name} of {combination.value}</p>
        );
      })}
      {!winner ? (
        <p><b>Draw!</b></p>
      ) : (
        <p>Player {winner.name} wins!</p>
      )}
    </div>
  )
}
