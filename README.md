[![CircleCI](https://circleci.com/gh/marcellomontemagno/dot-state.svg?style=shield)](https://circleci.com/gh/marcellomontemagno/dot-state)

# Api not used in production

This library is a WIP experiment trying to join the awesome FP react approach with a bit of OOP helping with information hiding and responsibilities segregation.

# What is it?

A "developer experience" focused state management library for React applications.

- Neatly concise
- Helps you having the whole application state in a single object
- Enforces state immutability
- Prevents unnecessary re-rendering with no extra code needed

# How does it work? (A simple example)

This library provides you two components

- `StateProvider` takes the application state and potentially provides it to all its children components
- `WithState` give the ability to a child component to read and mutate part of the application state provided by `StateProvider`

here a small example:

```javascript
const appState = {
  counters: [
    {count: 2},
    {count: 1},
    {count: 3}
  ],
  someOtherState: 'someOtherState'
};

const Counter = ({state, setState}) => {

  const onPlus = () => {
    setState({count: state.count + 1});
  }

  const onMinus = () => {
    setState({count: state.count - 1});
  }

  return <div>
    <h1>Count: {state.count}</h1>
    <button onClick={onPlus}>+</button>
    <button onClick={onMinus}>-</button>
  </div>

}

ReactDOM.render(
  <StateProvider state={appState}>
    <WithState at="counters.1">
      <Counter/>
    </WithState>
  </StateProvider>,
  document.getElementById('root')
)
```

`WithState` will value two properties of the `Counter` component as follow:

 - the property `state` will be valued with the part of `appState` specified in `at="counters.1"`
 - the property `setState` will be valued with a function that can be invoked to modify the part of `appState` specified in `at="counters.1"`

as a result

 - This small application will render a single simple counter component with two buttons respectively increasing and decreasing the counter value on click
 - `Counter` only knows a portion of the application state, and that is the only portion of the state it can mutate trough the property `setState`
 - Other portions of the state can be used by other components simply wrapping them into a `WithState`

the property `at` of `WithState` can be valued with any dot notation path e.g `someState.anArray.2.aProp`

# It enforces state immutability

`StateProvider` enforce state immutability by default when you are in development mode (when `process.env.NODE_ENV !== "production"`).

This means that the following example:

```javascript
const Counter = ({state, setState}) => {

   const onPlus = () => {
     let newState = state;
     newState.count = newState.count + 1; //this line will throw an exception when executed
     setState(newState);
   }

   /*
   - this is the correct way of setting the new state without mutating the old one:
   const onPlus = () => {
     setState({...state, count: state.count + 1}); //notice that we are reusing the part of the object that is not changed
   }
   */

   return <div>
     <h1>
       Count: {state.count}
     </h1>
     <button onClick={onPlus}>+</button>
   </div>

 }
 ```

will result into an exception when `onPlus` is executed.

Enforcing state immutability has a few important advantages:

- Avoid side effects: it protects you from unintentional mutation of the state by some other object having a reference to it.
- Allows the library to easily understand which part of the state is changed (an === is enough) so that it can avoid re-rendering all the components whose state is not changed.

Throwing an exception when the state is mutated can be disabled setting the property `enforceImmutability` of `StateProvider` to `false` but we strongly suggest to leave it active.
