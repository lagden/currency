import commonjs from '@rollup/plugin-commonjs'
export default [
	{
		input: './src/currency.js',
		output: {
			file: 'dist/currency.cjs',
			format: 'cjs',
			strict: false,
			sourcemap: false,
		},
		plugins: [
			commonjs(),
		]
	},
]
