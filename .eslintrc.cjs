'use strict'

module.exports = {
	env: {
		es2021: true,
		node: true
	},
	parser: '@babel/eslint-parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: ['html'],
	extends: [
		'xo',
		'plugin:unicorn/recommended'
	],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'semi-spacing': [
			'error',
			{
				before: false,
				after: true
			}
		],
		'no-console': 0,
		camelcase: 0,
		'capitalized-comments': 0,
		'spaced-comment': 0,
		'padding-line-between-statements': 0,
		'unicorn/filename-case': 0,
		'unicorn/prevent-abbreviations': 0,
		'unicorn/prefer-module': 0,
		'unicorn/no-zero-fractions': 0,
		// 'unicorn/no-abusive-eslint-disable': 0,
		// Bug do svelte lint
		'no-multiple-empty-lines': [
			'error',
			{max: 2, maxBOF: 2, maxEOF: 0}
		],
		// Bug no ctx.body Koa
		'require-atomic-updates': 0
	}
}
