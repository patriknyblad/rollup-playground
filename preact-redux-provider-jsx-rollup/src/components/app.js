'use strict'

import React, { Component } from 'react';
import { createStore } from 'redux'
import Counter from './counter'
import redux from 'preact-redux';

class App extends Component {
  constructor() {

  }

  render() {

    return (
      <div>
        // Use the counter property assigned by our mapStateToProps function below, redux will keep this updated thanks to the connect function
        {this.props.counters.map((value, index) => (
           <Counter
           key={index}
            value={value}
            // Use the dispatch functions assigned by our mapDispatchToProps function below through redux
            onIncrement={() => {
              this.props.incrementCounter( index );
            }}
            onDecrement={() => {
              this.props.decrementCounter( index );
            }}
            onRemoveCounter={() => {
              this.props.removeCounter( index );
            }}
          />
        ))}

        <button onClick={() => {
          this.props.addCounter();
        }}>
          Add counter
        </button>
        <button onClick={() => {
          this.props.removeCounter( this.props.counters.length - 1 );
        }}>
          Remove counter
        </button>
      </div>
    )
  }
}

// connect to Redux store

const mapStateToProps = function( state ) {
    // This component will have access to `appstate.counters` through `this.props.counters`
    return {
      counters: state.counters
    };
};

const mapDispatchToProps = function( dispatch ) {
    // This component will have access to `appstate.incrementCounter` through `this.props.incrementCounter` etc...
    return {
      incrementCounter: index => { dispatch( { type: 'INCREMENT', index } ) },
      decrementCounter: index => { dispatch( { type: 'DECREMENT', index } ) },
      removeCounter: index => { dispatch( { type: 'REMOVE_COUNTER', index } ) },
      addCounter: index => { dispatch( { type: 'ADD_COUNTER' } ) },
    };
};

// Connect our component with the state to props and dispatch to props filter functions
export default redux.connect( mapStateToProps, mapDispatchToProps )( App );
