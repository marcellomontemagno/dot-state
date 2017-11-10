import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';
import {mount, render} from 'enzyme';

const Component = ({state = {count: 0}, setState, renderingSpy}) => {
  renderingSpy();
  const add1 = () => {
    setState({count: state.count + 1})
  };
  return <div onClick={add1}>{state.count}</div>
}

const testApp = (spy1, spy2) => {
  return <StateProvider state={{counters: []}}>
    <WithState at="counters.1">
      <Component renderingSpy={spy1}/>
    </WithState>
    <WithState at="counters.2">
      <Component renderingSpy={spy2}/>
    </WithState>
  </StateProvider>
};

describe('In a small app having many WithState', () => {

  let spy1;
  let spy2;
  let wrapper;

  beforeEach(() => {
    spy1 = jest.fn();
    spy2 = jest.fn();
    wrapper = mount(testApp(spy1, spy2));
    expect(spy1.mock.calls.length).toBe(1);
    expect(spy2.mock.calls.length).toBe(1);
  })

  it('Should only re-render the components whose state is changed', () => {
    wrapper.find(Component).at(0).find('div').simulate('click');
    expect(spy1.mock.calls.length).toBe(2);
    expect(spy2.mock.calls.length).toBe(1);
  });

});
