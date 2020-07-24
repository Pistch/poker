import { PLAYER_ACTIONS } from '../constants';
import { State } from '../lib/state';

export default class Player {
  constructor({
    name= '',
    money = 0
  }) {
    this.name = name;
    this.state = new State({
      cards: [],
      name,
      money
    });
  }

  dropCards() {
    this.state.cards = [];
  }

  takeCard(card) {
    if (this.state.cards.length > 1) {
      return;
    }

    this.state.cards = this.state.cards.concat(card);
  }

  get hand() {
    return this.state.cards;
  }

  hasMoney(amount) {
    return this.state.money >= amount;
  }

  giveMoney(amount) {
    if (amount <= this.state.money) {
      this.state.money = this.state.money - amount;

      return amount;
    }

    const possibleGiveaway = this.state.money;

    this.state.money = 0;

    return possibleGiveaway;
  }

  takeMoney(amount) {
    this.state.money = this.state.money + amount;
  }

  performAction(availableActions) {
    const actionsPriority = [
      PLAYER_ACTIONS.CHECK,
      Math.random() > 0.8 && PLAYER_ACTIONS.RAISE,
      PLAYER_ACTIONS.CALL,
      PLAYER_ACTIONS.FOLD
    ].filter(Boolean);
    const action = actionsPriority.find(actionName => {
      if (!availableActions[actionName]) {
        return null;
      }

      return true;
    });

    return { action, amount: 100 };
  }
}
