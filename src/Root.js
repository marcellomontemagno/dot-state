import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';

const Counter = ({state, setState}) => {
  const count = state.count || 0;
  const highlighted = state.highlighted || false;
  const add1 = () => {
    setState({...state, count: count + 1});
  };
  const highlight = () => {
    setState({...state, highlighted: !highlighted});
  };
  return <div>
    {highlighted && '-->'}{count}
    <button onClick={add1}>+</button>
    <button onClick={highlight}>toggle highlight</button>
  </div>
};

const Footer = ({state = {counters: []}, setState}) => {
  const add1ToAllCounters = () => {
    setState({
      counters: state.counters.map((count) => {
        return count + 1;
      })
    });
  };
  return <button onClick={add1ToAllCounters}>+1 to all counters</button>
};

const Counters = ({state}) => {
  return <div>
    {state.counters.map((count, i) => {
      return <WithState key={i} at={{count: `counters.${i}`, highlighted: `highlights.${i}`}}>
        <Counter/>
      </WithState>
    })}
  </div>
};

const Root = () => {
  return <StateProvider state={{counters: [0, 0], highlights: [false, false]}}>
    <WithState>
      <Counters/>
    </WithState>
    <WithState>
      <Footer/>
    </WithState>
  </StateProvider>
}

export default Root;