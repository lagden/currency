/* eslint no-new: 0 */

'use strict'

import simulant from 'simulant'
import Currency from '../src/index.js'

beforeEach(() => {
	document.body.innerHTML = '<input id="money" type="text">'
})

test('static mask number default', () => {
	const v = Currency.masking(1100)
	expect(v).toEqual('1.100,00')
})

test('static mask number', () => {
	const v = Currency.masking(1100, {prefix: 'R$'})
	expect(v).toEqual('R$ 1.100,00')
})

test('static mask number 0', () => {
	const v = Currency.masking(0, {prefix: 'R$'})
	expect(v).toEqual('R$ 0,00')
})

test('static mask number fraction', () => {
	const v = Currency.masking(5500.00, {prefix: 'R$'})
	expect(v).toEqual('R$ 5.500,00')
})

test('static mask number string', () => {
	const v = Currency.masking('1111', {prefix: 'R$'})
	expect(v).toEqual('R$ 11,11')
})

test('static mask number string fraction', () => {
	const v = Currency.masking('1111.00', {prefix: 'R$'})
	expect(v).toEqual('R$ 1.111,00')
})

test('static euro', () => {
	const v = Currency.masking('1111.00', {sufix: '€'})
	expect(v).toEqual('1.111,00 €')
})

test('static position', () => {
	const pos = Currency.position('1.111,00 €', {sufix: '€'})
	expect(pos).toEqual(8)
})

test('input', () => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	for (const char of '1045'.split('')) {
		input.value += char
		simulant.fire(input, 'input')
	}

	expect(input.value).toEqual('10,45')
	mask.destroy()
})

test('input init', () => {
	const input = document.querySelector('#money')
	input.value = '12.99'
	const mask = new Currency(input, {init: true})

	expect(input.value).toEqual('12,99')
	mask.destroy()
})

test('keyup', () => {
	const input = document.querySelector('#money')
	input.value = ''
	const mask = new Currency(input, {
		keyEvent: 'keyup',
		maskOpts: {
			sufix: '€'
		}
	})
	for (const char of '111199'.split('')) {
		input.value += char
		simulant.fire(input, 'keyup')
	}

	expect(input.value).toEqual('1.111,99 €')
	mask.destroy()
})

test('blur', () => {
	const input = document.querySelector('#money')
	input.value = ''

	const mask = new Currency(input, {keyEvent: 'keyup', triggerOnBlur: true})
	input.value = '1250'
	simulant.fire(input, 'blur')

	expect(input.value).toEqual('12,50')
	mask.destroy()
})

test('click', () => {
	const input = document.querySelector('#money')
	input.value = '1250'

	const mask = new Currency(input)
	simulant.fire(input, 'click')

	expect(input.value).toEqual('1250')
	mask.destroy()
})

test('options', () => {
	const input = document.querySelector('#money')
	input.value = ''

	const mask = new Currency(input, {triggerOnBlur: true, maskOpts: {
		prefix: 'US$',
		decimal: '.',
		thousand: ','
	}})
	input.value = '1500099'
	simulant.fire(input, 'blur')

	expect(input.value).toEqual('US$ 15,000.99')
	mask.destroy()
})

test('get instance', () => {
	const input = document.querySelector('#money')
	const mask = new Currency(input)
	const _mask = Currency.data(input)

	expect(mask).toEqual(_mask)
	mask.destroy()
	_mask.destroy()
})

test('throws instanced', () => {
	expect(() => {
		const input = document.querySelector('#money')
		new Currency(input)
		new Currency(input)
	}).toThrow('The input has already been instanced. Use the static method `Currency.data(input)` to get the instance.')
})

test('throws sem input', () => {
	expect(() => {
		new Currency('not a input')
	}).toThrow('The input should be a HTMLInputElement')
})
