'use strict'

const config = [
	{
		input: 'src/index.js',
		output: [
			{
				file: 'dist/index.js',
				format: 'es',
				name: 'Currency',
				sourcemap: true,
				strict: false
			},
			{
				file: 'dist/index.umd.js',
				format: 'umd',
				name: 'Currency',
				sourcemap: true,
				strict: false
			}
		]
	}
]

export default config
