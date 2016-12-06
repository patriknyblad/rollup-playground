'use strict'

const counter = (state = {counters:[0]}, action) => {
  let newState = Object.assign({},state);
  switch(action.type) {
    case 'ADD_COUNTER': return addCounter(newState)
    case 'REMOVE_COUNTER': return removeCounter(newState, action.index)
    case 'INCREMENT': return incrementCounter(newState, action.index)
    case 'DECREMENT': return decrementCounter(newState, action.index)
    default: return state
  }
}

const addCounter = (state) => {
  state.counters = [...state.counters, 0];
  return state;
}

const removeCounter = (state, index) => {
  state.counters =  [
    ...state.counters.slice(0, index),
    ...state.counters.slice(index + 1)
  ];
  return state;
}

const incrementCounter = (state, index) => {
  state.counters =  [
    ...state.counters.slice(0, index),
    state.counters[index] + 1,
    ...state.counters.slice(index + 1)
  ];
  return state;
}

const decrementCounter = (state, index) => {
  state.counters =  [
    ...state.counters.slice(0, index),
    state.counters[index] - 1,
    ...state.counters.slice(index + 1)
  ];
  return state;
}

export default counter
