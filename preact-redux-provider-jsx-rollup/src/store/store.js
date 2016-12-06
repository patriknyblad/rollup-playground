import * as Redux from 'redux'
import counter from '../reducers/counter'

// Counter reducer provides its own initial state
export const store = Redux.createStore( counter )

export default store;
