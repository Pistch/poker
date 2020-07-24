import React from 'react';

class Handlers {
  constructor(handlers = []) {
    Object.defineProperty(this, "__handlers__", {
      enumerable: false,
      configurable: false,
      value: new Set([])
    });

    handlers.forEach(handler => this.register(handler));
  }

  get() {
    return this.__handlers__;
  }

  register(handler) {
    this.__handlers__.add(handler);
  }

  drop(handler) {
    this.__handlers__.delete(handler);
  }

  runAll(data) {
    this.__handlers__.forEach(handler => handler(data));
  }
}

export class State {
  constructor(initialState = {}, handlers = []) {
    Object.defineProperty(this, "__state__", {
      enumerable: false,
      configurable: false,
      value: {}
    });
    Object.defineProperty(this, "__handlers__", {
      enumerable: false,
      configurable: false,
      value: new Handlers(handlers)
    });

    this.__changeStateItems(initialState);
  }

  __runHandlers() {
    this.__handlers__.runAll(this.get());
  }

  __changeStateItems(diffObj) {
    Object.keys(diffObj).forEach(stateKey => {
      const stateValue = diffObj[stateKey];

      this.__changeStateItem(stateKey, stateValue);
    });
  }

  __changeStateItem(stateKey, stateValue) {
    this.__state__[stateKey] = stateValue;

    Object.defineProperty(this, stateKey, {
      get: () => this.__state__[stateKey],
      set: newValue => {
        this.__state__[stateKey] = newValue;

        this.__runHandlers();
      }
    });
  }

  get() {
    return JSON.parse(JSON.stringify(this.__state__));
  }

  registerHandler(handler) {
    this.__handlers__.register(handler);
  }

  dropHandler(handler) {
    this.__handlers__.drop(handler);
  }
}

export function getContainer(stateModel, methods) {
  return class Container extends React.PureComponent {
    state = stateModel.get();

    componentDidMount() {
      stateModel.registerHandler(this.setInnerState);
    }

    componentWillUnmount() {
      stateModel.dropHandler(this.setInnerState);
    }

    setInnerState = (diff) => {
      this.setState(diff);
    }

    render()  {
      const { component: Component } = this.props;

      return <Component {...this.state} {...methods} />;
    }
  }
}
