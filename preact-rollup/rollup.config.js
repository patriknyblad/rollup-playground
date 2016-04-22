import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-npm';


export default {
	entry: 'src/main.js',
	dest: 'dist/app.js',

	format: 'iife',
	plugins: [
		nodeResolve({
			jsnext: true,
		}),
		commonjs(),
		babel({
			presets: [ 'es2015-rollup' ],
			plugins: [
    		[ 'transform-react-jsx', { 'pragma' : 'h' }],
  		],
		}),
		npm({
			jsnext: true,
			main: true,
			browser: true
		}),
	],
};
