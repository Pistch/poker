import React from 'react';

import { getContainer } from '../../lib/state';
import Player from '../../models/Player';
import Game from '../../models/Game';
import PlayerView from '../PlayerView';
import TableView from '../TableView';
import ResultView from '../ResultView';

import classes from './GameView.module.css';

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function gameAutoRunner(mGame) {
  while (true) {
    mGame.start();

    if (!mGame.state.canContinue) {
      return;
    }

    while (mGame.state.canContinue && !mGame.state.isFinished) {
      try {
        mGame.tick();
      } catch (e) {
        console.log(mGame.state.log);
        throw e;
      }

      await wait(50);
    }
  }
}

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

  gameAutoRunner(game);

  return (
    <div>
      <div className={classes.players}>
        <Player1Container component={PlayerView} />
        <GameContainer component={({bets, bank}) => (
          <pre>
            <b>Bank: </b>{bank}{'\n\n'}

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
