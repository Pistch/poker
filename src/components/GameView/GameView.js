import React from 'react';

import { getContainer } from '../../lib/state';
import Player from '../../models/Player';
import Game from '../../models/Game';
import PlayerView from '../PlayerView';
import TableView from '../TableView';
import ResultView from '../ResultView';

import classes from './GameView.module.css';

export default function GameView() {
  const player1 = new Player({
    name: 'Joseph',
    money: 1000
  });
  const player2 = new Player({
    name: 'Jessica',
    money: 1000
  });
  const game = new Game([player1, player2]);
  const Player1Container = getContainer(player1);
  const Player2Container = getContainer(player2);
  const GameContainer = getContainer(game);

  game.start();

  return (
    <div>
      <button onClick={() => game.tick()}>Next move</button>
      <button onClick={() => game.start()}>Restart</button>
      <div className={classes.players}>
        <Player1Container component={PlayerView} />
        <GameContainer component={({bets}) => (
          <pre>
            <b>Bets:</b>{'\n\n'}

            {Object.keys(bets).map(playerName => `${playerName}: ${bets[playerName]}\n`)}
          </pre>
        )} />
        <Player2Container component={PlayerView} />
      </div>
      <GameContainer component={TableView} />
      <GameContainer component={ResultView} />
    </div>
  );
}
