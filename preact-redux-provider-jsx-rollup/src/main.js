'use strict'
import { h } from 'preact'; // Make JSX parser abailable everywhere
import React, { render } from 'react';
import App from './components/app.js';
import redux from 'preact-redux';
import store from './store/store.js';

window.h = h; // The global used to parse all JSX

const Provider = redux.Provider; // Get provider from preact-redux

// Wrap the main app component with the Provider from redux and give it our store,
// this will allow us to run connect on sub components.
const Main = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

// Render out the contents of main into the "data-js" element
render( Main(), document.querySelector( '[data-js="main"]' ) );
