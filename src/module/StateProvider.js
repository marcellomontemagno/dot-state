import React from 'react';
import PropTypes from 'prop-types';
import immutableState from 'react-immutable-state';
import createReactClass from 'create-react-class';

const StateProvider = createReactClass({

  getInitialState () {
    return this.props.state || null;
  },

  getChildContext () {
    const result = {
      appState: this.state,
      boundSetState: this.setState.bind(this),
      middleware: this.props.middleware
    }
    return result;
  },

  render () {
    return this.props.children ? <div>{this.props.children}</div> : null;
  },

});

StateProvider.childContextTypes = {
  appState: PropTypes.object,
  boundSetState: PropTypes.func,
  middleware: PropTypes.array
};

const ImmutableStateProvider = immutableState(StateProvider); //do not move inside the render method, moving it there breaks the hot reload

const Wrapper = createReactClass({

  render () {
    const {enforceImmutability = true} = this.props;
    const Wrapped = enforceImmutability ? ImmutableStateProvider : StateProvider;
    return <Wrapped {...this.props} />
  }

});

export default Wrapper;
