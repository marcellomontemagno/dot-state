import React from 'react';
import StateProvider from '../src/module/StateProvider';
import WithState from '../src/module/WithState';
import {mount, render} from 'enzyme';

const Component = (state, setState) => {
  return <div className="myContent"/>
}

it('StateProvider should work with no props and no children', () => {
  mount(<StateProvider/>)
});

it(`WithState should work with no children`, () => {
  mount(<StateProvider>
    <WithState/>
  </StateProvider>);
});

describe('When StateProvider is used with children and no props', () => {

  let wrapper;

  beforeEach(() => {
    wrapper = mount(<StateProvider>
      <WithState>
        <Component/>
      </WithState>
    </StateProvider>);
  });

  it(`should render the children`, () => {
    expect(wrapper.find('.myContent').length).toBe(1);
  });

  it(`should pass undefined to the prop "state" of the child of WithState`, () => {
    expect(wrapper.find(Component).props().state).toBe(undefined);
  });

});
