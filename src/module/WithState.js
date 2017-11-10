import React from 'react';
import PropTypes from 'prop-types';
import im from 'dot-prop-immutable';
import createReactClass from 'create-react-class';

const WithState = createReactClass({

  shouldComponentUpdate (np, ns, nextContext) {
    const statePartial = this.getPartial(this.context.appState, this.props.at);
    const nextStatePartial = this.getPartial(nextContext.appState, this.props.at);
    return statePartial !== nextStatePartial;
  },

  getPartial (state, path) {
    if (typeof path === "object") {
      let result = {};
      for (const key of Object.keys(path)) {
        result[key] = im.get(state, path[key]);
      }
      return result;
    } else {
      const result = path ? im.get(state, path) : state;
      return result === null ? undefined : result; //getInitialState force us to use null for the state but default args in components will use null as a value
    }
  },

  applyMiddleware (componentInstance, newStatePartial) {
    const middleware = this.context.middleware;
    if (middleware) {
      for (let i = 0; i < middleware.length; i++) {
        const result = middleware[i](componentInstance, newStatePartial);
        if (result) {
          newStatePartial = result;
        } else {
          break;
        }
      }
    }
    return newStatePartial;
  },

  render () {
    let result = null;
    if (this.props.children) {
      const componentInstance = this;
      result = React.cloneElement(this.props.children, {
        state: this.getPartial(this.context.appState, this.props.at),
        setState: (newStatePartial) => {
          newStatePartial = this.applyMiddleware(componentInstance, newStatePartial);
          const {appState, boundSetState} = componentInstance.context;
          const {at} = componentInstance.props;
          if (at) {
            if (typeof at === "string") {
              boundSetState(im.set(appState, at, newStatePartial));
            } else {
              let newState = appState;
              for (const key of Object.keys(at)) {
                newState = im.set(newState, at[key], newStatePartial[key]);
              }
              boundSetState(newState);
            }
          } else {
            boundSetState(newStatePartial);
          }
        }
      })
    }
    return result;
  }
})

WithState.contextTypes = {
  appState: PropTypes.object,
  boundSetState: PropTypes.func,
  middleware: PropTypes.array
};

export default WithState;
