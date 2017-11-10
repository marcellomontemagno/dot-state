import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';
import {mount, render} from 'enzyme';

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
    <span>{highlighted && '-->'}{count}</span>
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

let wrapper;

function mountApp () {
  wrapper = mount(<StateProvider state={{counters: [0, 0], highlights: [false, false]}}>
    <WithState>
      <Counters/>
    </WithState>
    <WithState>
      <Footer/>
    </WithState>
  </StateProvider>);
}

function getCounterAt (index) {
  return wrapper.find(Counter).at(index);
}

function getCounterTextAt (index) {
  return getCounterAt(index).find('span').at(0).text();
}

function increaseCounterAt (index) {
  getCounterAt(index).find('button').at(0).simulate('click');
}

function toggleHighlightAt (index) {
  getCounterAt(index).find('button').at(1).simulate('click');
}

function clickFooterButton () {
  wrapper.find(Footer).at(0).find('button').simulate('click');
}

it('A small application with counters should behave correctly', () => {
  mountApp();
  expect(getCounterTextAt(0)).toBe('0');
  expect(getCounterTextAt(1)).toBe('0');
  increaseCounterAt(0);
  increaseCounterAt(0);
  increaseCounterAt(1);
  toggleHighlightAt(1);
  expect(getCounterTextAt(0)).toBe('2');
  expect(getCounterTextAt(1)).toBe('-->1');
  clickFooterButton();
  expect(getCounterTextAt(0)).toBe('3');
  expect(getCounterTextAt(1)).toBe('-->2');
  toggleHighlightAt(0);
  toggleHighlightAt(1);
  expect(getCounterTextAt(0)).toBe('-->3');
  expect(getCounterTextAt(1)).toBe('2');
});

