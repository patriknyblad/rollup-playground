'use strict'

import { h, render } from 'preact'
import App from './components/app.js'

render(<App />, document.querySelector('[data-js="main"]'));
