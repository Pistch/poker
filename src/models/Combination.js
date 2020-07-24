import memoize from 'lodash-es/memoize';

import { CARD_RANKS, COMBINATION_NAMES, COMBINATIONS_RANKING } from '../constants';

const buildValueMap = memoize(function (cards) {
  return cards.reduce((map, card) => {
    if (map[card.rank.value]) {
      map[card.rank.value].push(card);
    } else {
      map[card.rank.value] = [card];
    }

    return map;
  }, {});
});

export default class Combination {
  constructor(handCards, tableCards) {
    if (tableCards.length !== 5 || handCards.length !== 2) {
      throw new Error(`Invalid cards quantity for combination, ${
        tableCards.length
      } table (needs to be 5) and ${
        handCards.length
      } (needs to be 2) provided.`);
    }

    this.handCards = handCards;
    this.tableCards = tableCards;
    this.cards = [...handCards, ...tableCards];
  }

  _getMapByValue = () => buildValueMap(this.cards);

  _getMapBySuit = () => this.cards.reduce((map, card) => {
    if (map[card.suit.name]) {
      map[card.suit.name].push(card);
    } else {
      map[card.suit.name] = [card];
    }

    return map;
  }, {});

  _getValueCombos(requiredQuantity) {
    const cardsMap = this._getMapByValue();
    const combos = [];

    Object.keys(cardsMap).forEach(cardValue => {
      if (cardsMap[cardValue].length === requiredQuantity) {
        combos.push(cardsMap[cardValue]);
      }
    });

    return combos;
  }

  _getPairs() {
    return this._getValueCombos(2);
  }

  _getSets() {
    return this._getValueCombos(3);
  }

  _getFours() {
    return this._getValueCombos(4);
  }

  _getStraights() {
    const cardsMap = this._getMapByValue();

    return CARD_RANKS.reduce((straights, rank, ranksPointer) => {
      if (!cardsMap[rank.value] || CARD_RANKS.length <= ranksPointer + 4) {
        return straights;
      }

      const cardsInStraight = [...cardsMap[rank.value]];

      for (let i = 1; i < 5; i++) {
        if (!cardsMap[CARD_RANKS[ranksPointer + i].value]) {
          return straights;
        }

        cardsMap[CARD_RANKS[ranksPointer + i].value].forEach(card => cardsInStraight.push(card));
      }

      if (cardsInStraight.length === 5) {
        straights.push(cardsInStraight);
      } else {
        const intermediateStraights = [[...cardsInStraight]];

        function findCollision(cards) {
          const cardsMap = buildValueMap(cards);
          const collisionValues = Object.keys(cardsMap).filter(value => cardsMap[value].length > 1);

          return collisionValues.length ? cardsMap[collisionValues[0]] : [];
        }

        while (intermediateStraights.some(straight => straight.length !== 5)) {
          for (let i = 0; i < intermediateStraights.length; i++) {
            if (intermediateStraights[i].length !== 5) {
              const firstCollision = findCollision(intermediateStraights[i]);
              const collisionValue = firstCollision[0].rank.value;

              for (let j = 1; j < firstCollision.length; j++) {
                intermediateStraights.push([...intermediateStraights[i]].filter(card => {
                  if (card.rank.value !== collisionValue) {
                    return true;
                  }

                  return card === firstCollision[j];
                }))
              }

              intermediateStraights[i] = [...intermediateStraights[i]].filter(card => {
                if (card.rank.value !== collisionValue) {
                  return true;
                }

                return card === firstCollision[0];
              });
            }
          }
        }

        intermediateStraights.forEach(straight => straights.push(straight));
      }

      return straights;
    }, []);
  }

  [COMBINATION_NAMES.KICKER]() {
    return Math.max(...this.handCards.map(card => card.rank.value));
  }

  [COMBINATION_NAMES.PAIR]() {
    const pairs = this._getPairs();

    if (!pairs.length) {
      return 0;
    }

    return Math.max(...pairs.map(pair => pair[0].rank.value));
  }

  [COMBINATION_NAMES.TWO_PAIRS]() {
    const pairs = this._getPairs();

    if (pairs.length < 2) {
      return 0;
    }

    return Math.max(...pairs.map(pair => pair[0].rank.value));
  }

  [COMBINATION_NAMES.SET]() {
    const sets = this._getSets();

    if (!sets.length) {
      return 0;
    }

    return Math.max(...sets.map(pair => pair[0].rank.value));
  }

  // [COMBINATION_NAMES.STRAIGHT]() {
  //   const cardsMap = this._getMapByValue();
  //
  //   return CARD_RANKS.reduce((maxStraightValue, rank, ranksPointer) => {
  //     if (!cardsMap[rank.value] || CARD_RANKS.length <= ranksPointer + 4) {
  //       return maxStraightValue;
  //     }
  //
  //     for (let i = 1; i < 5; i++) {
  //       if (!cardsMap[CARD_RANKS[ranksPointer + i].value]) {
  //         return maxStraightValue;
  //       }
  //     }
  //
  //     return rank.value + 4;
  //   }, 0);
  // }

  [COMBINATION_NAMES.STRAIGHT]() {
    const straights = this._getStraights();

    if (!straights.length) {
      return 0;
    }

    return Math.max(...straights.map(straight => Math.max(...straight.map(card => card.rank.value))));
  }

  [COMBINATION_NAMES.FLUSH]() {
    const cardsMap = this._getMapBySuit();

    return Math.max(...Object.keys(cardsMap).map(suitName => {
      if (Array.isArray(cardsMap[suitName]) && cardsMap[suitName].length >= 5) {
        return Math.max(...cardsMap[suitName].map(card => card.rank.value));
      }

      return 0;
    }));
  }

  [COMBINATION_NAMES.FULL_HOUSE]() {
    const pair = this[COMBINATION_NAMES.PAIR]();
    const set = this[COMBINATION_NAMES.SET]();

    if (pair && set) {
      return set;
    }

    return 0;
  }

  [COMBINATION_NAMES.FOUR_OF_A_KIND]() {
    const fours = this._getFours();

    if (!fours.length) {
      return 0;
    }

    return Math.max(...fours.map(pair => pair[0].rank.value));
  }

  [COMBINATION_NAMES.STRAIGHT_FLUSH]() {
    const straights = this._getStraights().filter(straight => straight.every(card => card.suit.name === straight[0].suit.name));

    if (!straights.length) {
      return 0;
    }

    return Math.max(...straights.map(straight => Math.max(...straight.map(card => card.rank.value))));
  }

  [COMBINATION_NAMES.ROYAL_FLUSH]() {
    const straightFlush = this[COMBINATION_NAMES.STRAIGHT_FLUSH]();

    return straightFlush === 14 ? straightFlush : 0;
  }

  getBest() {
    const bestCombinationName = COMBINATIONS_RANKING.find(
      combinationName => Boolean(this[combinationName]())
    );

    return {
      name: bestCombinationName,
      value: this[bestCombinationName]()
    };
  }

  static compare(c1, c2) {
    const c1data = c1.getBest();
    const c2data = c2.getBest();
    const c1rank = COMBINATIONS_RANKING.indexOf(c1data.name);
    const c2rank = COMBINATIONS_RANKING.indexOf(c2data.name);

    if (c1rank > c2rank) {
      return -1;
    } else if (c1rank < c2rank) {
      return 1;
    } else if (c1data.value > c2data.value) {
      return 1;
    } else if (c1data.value < c2data.value) {
      return -1;
    } else {
      const c1Kicker = c1[COMBINATION_NAMES.KICKER]();
      const c2Kicker = c2[COMBINATION_NAMES.KICKER]();

      if (c1Kicker > c2Kicker) {
        return 1;
      } else if (c1Kicker < c2Kicker) {
        return -1;
      }

      return 0;
    }
  }
}
