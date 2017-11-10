import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';
import {mount, render} from 'enzyme';

const Counter = ({state = {count: 0}, setState}) => {
  const add1 = () => {
    setState({count: state.count + 1})
  };
  return <div onClick={add1}>{state.count}</div>
}

const Footer = ({state = {counters: []}, setState}) => {
  const add1ToAllCounters = () => {
    setState({
      counters: state.counters.map((counter) => {
        return {count: counter.count + 1};
      })
    })
  };
  return <button onClick={add1ToAllCounters}>+1 to all counters</button>
}

function createTestApp () {
  return <StateProvider state={{counters: []}}>
    <WithState at="counters.0">
      <Counter/>
    </WithState>
    <WithState at="counters.1">
      <Counter/>
    </WithState>
    <WithState>
      <Footer/>
    </WithState>
  </StateProvider>
}

let wrapper;

function mountApp () {
  wrapper = mount(createTestApp());
}

function getCounterAt (index) {
  return wrapper.find(Counter).at(index);
}

function getCounterTextAt (index) {
  return getCounterAt(index).text();
}

function clickCounterAt (index) {
  getCounterAt(index).simulate('click');
}

function clickFooterButton () {
  wrapper.find(Footer).at(0).find('button').simulate('click');
}

it('A small application with counters should behave correctly', () => {
  mountApp();
  expect(getCounterTextAt(0)).toBe('0');
  expect(getCounterTextAt(1)).toBe('0');
  clickCounterAt(0);
  clickCounterAt(0);
  clickCounterAt(1);
  expect(getCounterTextAt(0)).toBe('2');
  expect(getCounterTextAt(1)).toBe('1');
  clickFooterButton();
  expect(getCounterTextAt(0)).toBe('3');
  expect(getCounterTextAt(1)).toBe('2');
});

