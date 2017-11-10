import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';
import {mount, render} from 'enzyme';

const Component = ({state}) => {
  return <div>{state.something.count}</div>
}

function createTestApp (enforceImmutability) {
  return <StateProvider state={{something: {count: 0}}} enforceImmutability={enforceImmutability}>
    <WithState>
      <Component/>
    </WithState>
  </StateProvider>
}

const exceptionMessage = "Cannot assign to read only property";

it('should prevent state mutations by default', () => {
  let wrapper = mount(createTestApp(undefined));
  expect(() => {
    wrapper.props().state.something.count = 2;
  }).toThrow(exceptionMessage);
});

it('should prevent state mutations if enforceImmutability = true', () => {
  let wrapper = mount(createTestApp(true));
  expect(() => {
    wrapper.props().state.something.count = 2;
  }).toThrow(exceptionMessage);
});

it('should NOT prevent state mutations if enforceImmutability = false', () => {
  let wrapper = mount(createTestApp(false));
  wrapper.props().state.something.count = 2;
  expect(wrapper.props().state.something.count).toBe(2);
});
