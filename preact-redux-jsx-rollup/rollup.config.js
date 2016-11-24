import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolveAliases from 'rollup-plugin-resolve-aliases';

export default {
	entry: 'src/main.js', // Start compiling from here
	dest: 'dist/app.js', // Output into one big optimized file
	format: 'iife', // Export as "iife" (instantly invoked function expression)
	plugins: [ // Ordered list of actions to perform while rolling up the code
    replace({ // Replace any checks for node environment with the string `"production"`
      'process.env.NODE_ENV': "'production'",
    }),
    resolveAliases({ // Replace import aliases
      aliases: {
        'react-dom': 'node_modules/preact-compat/src/index.js', // For `import { Component } from 'react'` do `import { Component } from 'preact-compat'`
        'react': 'node_modules/preact-compat/src/index.js', // For `import React from 'react'` do `import React from 'preact-compat'`
      },
    }),
		nodeResolve({ // Tell rollup to look in `node_modules` for named imports that does not begin "with a path".
			jsnext: true, // Try to import from the file specified in the modules package.json under `main:jsnext`.
      main: true, // Try to import from the file specified in the modules package.json under `main`.
		}),
		commonjs(), // Let our project handle CommonJS modules ex. `module.exports =` and `require()`
    buble({ // Transpile ES6 to ES5
      jsx: 'h', // Transpile JSX with preact `h()` instead of `React.createElement()`
    }),
	],
};
