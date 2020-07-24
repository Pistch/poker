import { State } from '../lib/state';

import Combination from './Combination';
import Deck from './Deck';

export default class Game {
  constructor(players) {
    this.players = players;
    this.state = new State({
      tableCards: [],
      bank: 0,
      result: null
    });
  }

  _getNextCard() {
    return this.deck.drawCard();
  }

  * giveCardsToPlayers() {
    for (let i = 0; i < this.players.length; i++) {
      yield this.players[i].takeCard(this._getNextCard());
    }
  }

  putCardOnTable() {
    this.state.tableCards = this.state.tableCards.concat(this._getNextCard());
  }

  * game() {
    yield* this.giveCardsToPlayers();
    yield* this.giveCardsToPlayers();
    this.putCardOnTable();
    this.putCardOnTable();
    yield this.putCardOnTable();
    yield this.putCardOnTable();
    yield this.putCardOnTable();
    this.state.result = this.getResult();
  }

  start() {
    this.players.forEach(player => player.dropCards());
    this.state.tableCards = [];
    this.state.bank = 0;
    this.state.result = null;
    this.deck = new Deck();
    this._gen = this.game();
  }

  tick() {
    this._gen.next();
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
