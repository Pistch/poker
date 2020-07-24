import { State } from '../lib/state';

import { PLAYER_ACTIONS } from '../constants';
import Combination from './Combination';
import Deck from './Deck';

function randomInt(min, max) {
  return Math.round(Math.random() * max - min) + min;
}

export default class Game {
  constructor(players) {
    this.players = players;
    this.state = new State({
      tableCards: [],
      bank: 0,
      result: null,
      isFinished: false,
      smallBlind: 50,
      bets: {},
      log: [],
      inactivePlayers: {},
      canContinue: true
    });
  }

  get activePlayers() {
    return this.players.filter(player => !this.state.inactivePlayers[player.name]);
  }

  get maxBet() {
    return Math.max(...Object.values(this.state.bets));
  }

  _getNextCard() {
    return this.deck.drawCard();
  }

  * giveCardsToPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      yield this.players[i].takeCard(this._getNextCard());
    }
  }

  setLogEntry(playerName, operation, amount) {
    const logEntry = [playerName, operation, amount].filter(Boolean);
    this.state.log = [...this.state.log, logEntry];

    // console.log(logEntry);
  }

  _raise(player, amount) {
    this.state.bank += player.giveMoney(amount);
    this.state.bets = {
      ...this.state.bets,
      [player.name]: (this.state.bets[player.name] || 0) + amount
    };
  }

  actualizePossibility(isInitialCheck) {
    if (isInitialCheck) {
      this.players.forEach(player => {
        if (!player.hasMoney(this.state.smallBlind * 2)) {
          this.kickPlayer(player);
        }
      });
    }

    if (this.activePlayers.length < 2) {
      this.state.canContinue = false;
    }
  }

  [PLAYER_ACTIONS.RAISE](player, amount) {
    this._raise(player, amount);

    this.setLogEntry(player.name, PLAYER_ACTIONS.RAISE, amount);
  }

  [PLAYER_ACTIONS.CALL](player) {
    const maxBet = this.maxBet;
    const valueToGive = maxBet - this.state.bets[player.name];

    this._raise(player, valueToGive);

    this.setLogEntry(player.name, PLAYER_ACTIONS.CALL, maxBet);
  }

  [PLAYER_ACTIONS.CHECK](player) {
    this.setLogEntry(player.name, PLAYER_ACTIONS.CHECK);
  }

  [PLAYER_ACTIONS.FOLD](player) {
    this.kickPlayer(player);
    this.setLogEntry(player.name, PLAYER_ACTIONS.FOLD);
  }

  kickPlayer(player) {
    this.state.inactivePlayers[player.name] = true;
  }

  takeBlinds() {
    this._raise(this.players[0], this.state.smallBlind);
    this.setLogEntry(this.players[0].name, 'small blind', this.state.smallBlind);
    this._raise(this.players[1], this.state.smallBlind * 2);
    this.setLogEntry(this.players[1].name, 'big blind', this.state.smallBlind * 2);
  }

  giveMoneyToWinner() {
    if (this.state.result && !this.state.result.winner) {
      const amount = this.state.bank / this.activePlayers.length;

      this.activePlayers.forEach(player => player.takeMoney(amount));
      this.state.bank = 0;

      return;
    }

    this.activePlayers
      .find(player => player.name === this.state.result.winner.name)
      .takeMoney(this.state.bank);
    this.state.bank = 0;
  }

  putCardOnTable() {
    this.state.tableCards = this.state.tableCards.concat(this._getNextCard());
  }

  playersActions() {
    let playersFinishedTurn = 0;
    let playersPointer = 0;

    while (playersFinishedTurn < this.activePlayers.length) {
      const player = this.activePlayers[playersPointer];
      const maxBet = this.maxBet;
      const hasEnoughMoney = player.hasMoney(maxBet);
      const availablePlayerActions = {
        [PLAYER_ACTIONS.RAISE]: hasEnoughMoney,
        [PLAYER_ACTIONS.CALL]: hasEnoughMoney && maxBet > this.state.bets[player.name],
        [PLAYER_ACTIONS.CHECK]: hasEnoughMoney && maxBet === this.state.bets[player.name],
        [PLAYER_ACTIONS.FOLD]: true
      };
      const { action, amount } = player.performAction(availablePlayerActions);

      this[action](player, amount);

      if (action !== PLAYER_ACTIONS.RAISE) {
        playersFinishedTurn++;
      } else {
        playersFinishedTurn = 1;
      }

      playersPointer = playersPointer + 1 >= this.activePlayers.length
        ? 0
        : playersPointer + 1;
    }

    this.state.bets = this.players.reduce((playersMap, player) => {
        playersMap[player.name] = 0;

        return playersMap;
    }, {});
  }

  * game() {
    yield this.takeBlinds();
    yield* this.giveCardsToPlayers();
    yield* this.giveCardsToPlayers();
    yield this.playersActions();
    this.putCardOnTable();
    this.putCardOnTable();
    yield this.putCardOnTable();
    yield this.playersActions();
    yield this.putCardOnTable();
    yield this.playersActions();
    yield this.putCardOnTable();
    yield this.playersActions();
    this.state.result = this.getResult();
    this.giveMoneyToWinner();
  }

  start() {
    this.players.forEach(player => player.dropCards());
    this.state.tableCards = [];
    this.state.bank = 0;
    this.state.result = null;
    this.state.isFinished = false;
    this.state.inactivePlayers = {};
    this.actualizePossibility(true);
    this.deck = new Deck();
    this._gen = this.game();
  }

  tick() {
    this.actualizePossibility();

    if (!this.state.canContinue) {
      if (!this.state.isFinished) {
        this.activePlayers[0].takeMoney(this.state.bank);
        this.state.bank = 0;
      }

      return;
    }

    const { done } = this._gen.next();

    if (done) {
      this.state.isFinished = true;
    }
  }

  getResult() {
    const results = this.players.map(
      player => ({
        player,
        combination: new Combination(player.hand, this.state.tableCards)
      })
    );
    const comparatorResult = Combination.compare(
      results[0].combination,
      results[1].combination
    );

    return {
      playersResults: results.map(result => ({...result, combination: result.combination.getBest()})),
      winner: !comparatorResult
        ? null
        : comparatorResult > 0 ? this.players[0] : this.players[1]
    };
  }
}
