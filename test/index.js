/* eslint no-unused-vars: 0 */
/* eslint import/extensions: 0 */

'use strict'

const test = require('ava')
const simulant = require('simulant')
const Currency = require('../src')

test('static mask', t => {
	const v = Currency.masking('1100.99', {prefix: 'R$'})
	t.is(v, 'R$ 1.100,99')
})

test('throws sem input', t => {
	t.throws(() => {
		const mask = new Currency('not a input')
	}, {instanceOf: TypeError, message: 'The input should be a HTMLInputElement'})
})

test('input', t => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	for (const char of '1045'.split('')) {
		input.value += char
		simulant.fire(input, 'input')
	}

	t.is(input.value, '10,45')
	mask.destroy()
})

test('input init', t => {
	const input = document.querySelector('#money')
	input.value = '12.99'
	const mask = new Currency(input, {init: true})
	t.is(input.value, '12,99')
	mask.destroy()
})

test('keyup', t => {
	const input = document.querySelector('#money')
	input.value = ''
	const mask = new Currency(input, {keyEvent: 'keyup'})
	for (const char of '111199'.split('')) {
		input.value += char
		simulant.fire(input, 'keyup')
	}

	t.is(input.value, '1.111,99')
	mask.destroy()
})

test('blur', t => {
	const input = document.querySelector('#money')
	input.value = ''

	const mask = new Currency(input, {keyEvent: 'keyup', triggerOnBlur: true})
	input.value = '1250'
	simulant.fire(input, 'blur')

	t.is(input.value, '12,50')
	mask.destroy()
})

test('options', t => {
	const input = document.querySelector('#money')
	input.value = ''

	const mask = new Currency(input, {triggerOnBlur: true, maskOpts: {
		prefix: 'US$',
		decimal: '.',
		thousand: ','
	}})
	input.value = '1500099'
	simulant.fire(input, 'blur')

	t.is(input.value, 'US$ 15,000.99')
	mask.destroy()
})

test('instance and destroy', t => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	const _mask = new Currency(input)
	t.true(mask === _mask)
	mask.destroy()
	_mask.destroy()
})
