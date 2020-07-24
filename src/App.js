import React from 'react';

import './variables.css';

import { getContainer } from './lib/state';
import Player from './models/Player';
import Game from './models/Game';
import PlayerView from './components/PlayerView';
import TableView from './components/TableView';
import ResultView from './components/ResultView';

export default function App() {
  const player1 = new Player({
    name: '1',
    money: 1000
  });
  const player2 = new Player({
    name: '2',
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
      <Player1Container component={PlayerView} />
      <Player2Container component={PlayerView} />
      <GameContainer component={TableView} />
      <GameContainer component={ResultView} />
    </div>
  );
}
