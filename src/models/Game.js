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
    const activePlayers = this.activePlayers;

    for (let i = 0; i < activePlayers.length; i++) {
      yield activePlayers[i].takeCard(this._getNextCard());
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
    if (!this.state.result) {
      return;
    }

    if (Array.isArray(this.state.result.winner)) {
      const amount = this.state.bank / this.state.result.winner.length;

      this.state.result.winner.forEach(player => player.takeMoney(amount));
    } else {
      this.state.result.winner.takeMoney(this.state.bank);
    }

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
    const activePlayers = this.activePlayers;
    const results = activePlayers.map(
      player => ({
        player,
        combination: new Combination(player.hand, this.state.tableCards)
      })
    ).sort((r1, r2) => Combination.compare(
        r1.combination,
        r2.combination
    ));
    const comparatorResult = results.reduce((acc, result, index, allResults) => {
      const isFirst = index === 0;
      const isLast = index === allResults.length - 1;
      let isResultPlaced = false;

      if (!isFirst) {
        const previousResultRank = acc[acc.length - 1];
        const previousResult = allResults[index - 1];

        if (
            Array.isArray(previousResultRank) &&
            !Combination.compare(previousResult.combination, result.combination)
        ) {
          previousResultRank.push(result.player);
          isResultPlaced = true;
        }
      }

      if (!isLast && !isResultPlaced) {
        const nextResult = allResults[index + 1];

        if (!Combination.compare(nextResult.combination, result.combination)) {
          acc.push([result.player]);
          isResultPlaced = true;
        }
      }

      if (!isResultPlaced) {
        acc.push(result.player);
      }

      return acc;
    }, []);

    const winner = comparatorResult[0];
    const playerCombos = results.map(result => result.combination.getBest());
    let isKickerIrrelevant = false;
    const shouldShowKickerForPlayer = playerCombos.map((combo, index) => {
      if (isKickerIrrelevant) {
        return false;
      }

      const isFirst = index === 0;
      const isLast = index === playerCombos.length - 1;

      if (isFirst && isLast) {
        isKickerIrrelevant = true;

        return false;
      } else if (isFirst && !isLast) {
        const nextPlayerCombo = playerCombos[index + 1];
        const shouldShowKicker = combo.name === nextPlayerCombo.name && combo.value === nextPlayerCombo.value;

        if (!shouldShowKicker) {
          isKickerIrrelevant = true;
        }

        return shouldShowKicker;
      } else {
        const previousPlayerCombo = playerCombos[index - 1];
        const shouldShowKicker = combo.name === previousPlayerCombo.name && combo.value === previousPlayerCombo.value;

        if (!shouldShowKicker) {
          isKickerIrrelevant = true;
        }

        return shouldShowKicker;
      }
    });

    return {
      playersResults: results.map((result, index) => {
        return {
          ...result,
          combinationName: result.combination.toString(shouldShowKickerForPlayer[index])
        };
      }),
      winner,
    };
  }
}
